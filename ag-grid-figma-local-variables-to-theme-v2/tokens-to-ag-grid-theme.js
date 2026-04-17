import { readFileSync, writeFileSync } from "fs";
import { parseArgs } from "util";

import {
  THEME_PARAM_NAMES,
  THEME_BORDER_PARAM_NAMES,
} from "./data/paramNames.js";

// Parse command line arguments
const cliArgs = parseArgs({
  args: process.argv.slice(2),
  options: {
    tokens: {
      type: "string",
      default: "./tokens/quartz-light-example-tokens.json",
    },
  },
}).values;

// Configuration for theme generation
const TOKENS_FILE =
  cliArgs.tokens || "./tokens/quartz-light-example-tokens.json";

// Load Figma design tokens from JSON file
const tokensJson = readFileSync(TOKENS_FILE, "utf-8");
const exampleTokens = JSON.parse(tokensJson);

// Extract the mode name from Figma extensions metadata (e.g., "Quartz Light")
const modeName = exampleTokens.$extensions?.["com.figma.modeName"];
if (!modeName) {
  throw new Error(
    'No "com.figma.modeName" found in $extensions. Is this a valid token file?',
  );
}

const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Derive the camelCase theme name used for the export variable and filename
const themeName = modeName
  .split(/\s+/)
  .map((word, i) => {
    const lower = word.toLowerCase();
    return i === 0 ? lower : capitalizeFirst(lower);
  })
  .join("");

const THEME_PARAM_NAMES_LOWERCASE = THEME_PARAM_NAMES.map((paramName) =>
  paramName.toLowerCase(),
);

// Converts a lowercase key to its properly cased theme parameter name
const getThemeParamName = (key) => {
  return THEME_PARAM_NAMES[
    THEME_PARAM_NAMES_LOWERCASE.indexOf(key.toLowerCase())
  ];
};

// Finds the border parameter name that matches the given key (for width tokens)
const getBorderParamName = (key) => {
  return THEME_BORDER_PARAM_NAMES.find(
    (paramName) => paramName.toLowerCase() + "width" === key.toLowerCase(),
  );
};

// Checks if a given key is a valid AG-Grid theme parameter name
const isThemeParamName = (key) => {
  return getThemeParamName(key) !== undefined;
};

// Checks if a given key is a border width parameter
const isBorderWidthParam = (key) => {
  return getBorderParamName(key) !== undefined;
};

// Shadow parameters use special string handling and do not resolve through colorToHex
const SHADOW_PARAMS = new Set([
  "cardShadow",
  "cellEditingShadow",
  "dialogShadow",
  "dragAndDropImageShadow",
  "dropdownShadow",
  "focusShadow",
  "inputFocusShadow",
  "menuShadow",
  "popupShadow",
]);

// Flatten the nested Figma token structure into a single lookup map keyed by token name
const flatTokens = Object.entries(exampleTokens).reduce(
  (acc, [category, categoryObj]) => {
    if (category === "$extensions") return acc;
    if (!categoryObj || typeof categoryObj !== "object") return acc;
    if (categoryObj.$type) return acc;

    Object.entries(categoryObj).forEach(([tokenName, tokenObj]) => {
      if (!tokenObj || typeof tokenObj !== "object" || !tokenObj.$type) return;
      if (category === "charts" && acc[tokenName]) return;

      acc[tokenName] = {
        $type: tokenObj.$type,
        $value: tokenObj.$value,
        category,
      };
    });

    return acc;
  },
  {},
);

// Recursively resolves token references of the form "{category.tokenName}"
const resolveValue = (value, depth = 0) => {
  if (depth > 10) {
    console.warn("Warning: circular reference detected, stopping resolution");
    return value;
  }

  if (
    typeof value === "string" &&
    value.startsWith("{") &&
    value.endsWith("}")
  ) {
    const refPath = value.slice(1, -1);
    const tokenName = refPath.split(".").pop();
    const referenced = flatTokens[tokenName];

    if (!referenced) {
      console.warn(`Warning: unresolved reference ${value}`);
      return value;
    }

    return resolveValue(referenced.$value, depth + 1);
  }

  return value;
};

// Converts a Figma color object ({hex, alpha}) into a CSS hex string with optional alpha channel
const colorToHex = (colorValue) => {
  if (typeof colorValue === "string") return colorValue;

  const { hex, alpha } = colorValue;
  const hexLower = hex.toLowerCase();

  if (alpha >= 1) return hexLower;
  if (alpha <= 0) return hexLower + "00";

  const alphaHex = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0");

  return hexLower + alphaHex;
};

// Converts a raw token value into the shape AG-Grid expects
// Handles shadow params (fall back to "none"), color objects (hex strings),
// and browserColorScheme (lowercase to match CSS color-scheme values)
const convertValue = (tokenName, type, rawValue) => {
  const resolved = resolveValue(rawValue);

  if (SHADOW_PARAMS.has(tokenName)) {
    if (typeof resolved === "string") return resolved;
    return "none";
  }

  if (
    type === "color" &&
    typeof resolved === "object" &&
    resolved !== null &&
    resolved.hex
  ) {
    return colorToHex(resolved);
  }

  if (type === "string") {
    if (tokenName === "browserColorScheme") return resolved.toLowerCase();
    return resolved;
  }

  return resolved;
};

// Parses border value from width and color tokens and creates a border object
const parseBorderValue = (borderName, allTokens) => {
  const widthKey = borderName + "Width";
  const colorKey = borderName + "Color";

  const widthToken = allTokens[widthKey];
  const colorToken = allTokens[colorKey];

  if (!widthToken || !colorToken) return null;

  const width = resolveValue(widthToken.$value);
  const resolvedColor = resolveValue(colorToken.$value);
  const color =
    typeof resolvedColor === "object" && resolvedColor !== null
      ? colorToHex(resolvedColor)
      : resolvedColor;

  return {
    width,
    color,
    style: "solid",
  };
};

// Formats a JavaScript object with unquoted keys for standard JS object syntax
const formatJSObject = (obj, indent = 2) => {
  const spaces = " ".repeat(indent);
  const entries = Object.entries(obj);

  if (entries.length === 0) return "{}";

  const formattedEntries = entries.map(([key, value]) => {
    // Check if key needs quotes (contains special characters, spaces, or starts with number)
    const needsQuotes = /[^a-zA-Z0-9_$]/.test(key) || /^[0-9]/.test(key);
    const formattedKey = needsQuotes ? `"${key}"` : key;

    let formattedValue;
    if (typeof value === "object" && value !== null) {
      formattedValue = formatJSObject(value, indent + 2);
    } else if (typeof value === "string") {
      formattedValue = `"${value}"`;
    } else {
      formattedValue = String(value);
    }

    return `${spaces}${formattedKey}: ${formattedValue}`;
  });

  return `{\n${formattedEntries.join(",\n")}\n${" ".repeat(indent - 2)}}`;
};

// Build the final theme object by filtering and resolving valid theme parameters
const unsortedAgGridTheme = Object.entries(flatTokens).reduce(
  (themeParams, [tokenName, token]) => {
    if (isThemeParamName(tokenName)) {
      const paramName = getThemeParamName(tokenName);
      themeParams[paramName] = convertValue(
        paramName,
        token.$type,
        token.$value,
      );
    }

    // Handle border parameters by combining width and color tokens into border objects
    if (isBorderWidthParam(tokenName)) {
      const borderParamName = getBorderParamName(tokenName);
      const borderValue = parseBorderValue(borderParamName, flatTokens);

      if (borderValue) {
        themeParams[borderParamName] = borderValue;
      }
    }

    return themeParams;
  },
  {},
);

// Sort the theme object alphabetically by key for consistent output
const agGridTheme = Object.keys(unsortedAgGridTheme)
  .sort()
  .reduce((sortedTheme, key) => {
    sortedTheme[key] = unsortedAgGridTheme[key];
    return sortedTheme;
  }, {});

const filepath = `./themes/${themeName}-ag-grid-theme.js`;
const fileContent = `export const ${themeName}Theme = ${formatJSObject(agGridTheme)};\n`;

// Write the formatted theme object to a JavaScript file
writeFileSync(filepath, fileContent, "utf8");

console.log(`✅  Theme conversion completed! File saved as: ${filepath}`);
