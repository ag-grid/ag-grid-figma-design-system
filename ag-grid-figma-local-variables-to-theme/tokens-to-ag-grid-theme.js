import { readFileSync, writeFileSync } from "fs";
import { parseArgs } from "util";

import StyleDictionary from "style-dictionary";
import {
  convertTokenData,
  resolveReferences,
  usesReferences,
} from "style-dictionary/utils";

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
      default: "./tokens/example-tokens-14-07-25.json",
    },
    theme: {
      type: "string",
      default: "quartz",
    },
    mode: {
      type: "string",
      default: "light",
    },
  },
}).values;

// Configuration for theme generation
const TOKENS_FILE = cliArgs.tokens || "./tokens/example-tokens-14-07-25.json";
const THEME = cliArgs.theme || "quartz";
const MODE = cliArgs.mode || "light";

// Load Figma design tokens from JSON file
const tokensJson = readFileSync(TOKENS_FILE, "utf-8");
const exampleTokens = JSON.parse(tokensJson);

// Create lowercase version of theme parameter names for case-insensitive matching
const THEME_PARAM_NAMES_LOWERCASE = THEME_PARAM_NAMES.map((paramName) =>
  paramName.toLowerCase()
);

// Transforms color token values by replacing theme references with the current mode
const transformColorTokens = (colorTokens) => {
  const transformColorValue = (colorValue) => {
    if (typeof colorValue !== "string") return colorValue;

    return colorValue.replace(THEME, MODE);
  };

  return Object.entries(colorTokens).reduce((acc, [key, color]) => {
    acc[key] = { ...color, value: transformColorValue(color.value) };

    return acc;
  }, {});
};

// Transforms all size tokens by fixing space references to spacing
// This resolves issues from Figma export related to our density switcher
const transformSizeTokens = (sizeTokens) => {
  const fixSpaceReferences = (value) => {
    if (typeof value !== "string") return value;

    return value.replace(".size.space}", ".size.spacing}");
  };

  return Object.entries(sizeTokens).reduce((acc, [key, token]) => {
    acc[key] = { ...token, value: fixSpaceReferences(token.value) };

    return acc;
  }, {});
};

// Converts a lowercase key to its properly cased theme parameter name
const getThemeParamName = (key) => {
  return THEME_PARAM_NAMES[THEME_PARAM_NAMES_LOWERCASE.indexOf(key)];
};

// Finds the border parameter name that matches the given key (for width tokens)
const getBorderParamName = (key) => {
  return THEME_BORDER_PARAM_NAMES.find(
    (paramName) => paramName.toLowerCase() + "width" === key.toLowerCase()
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

// Parses border value from width and color tokens and creates a border object
// Combines width, color, and style properties into a single border definition
const parseBorderValue = (borderName, allTokens, sd) => {
  const widthKey = borderName.toLowerCase() + "width";
  const colorKey = borderName.toLowerCase() + "color";

  const widthToken = allTokens[widthKey];
  const colorToken = allTokens[colorKey];

  if (!widthToken || !colorToken) return null;

  const width = usesReferences(widthToken.value)
    ? resolveReferences(widthToken.value, sd.tokens, { warnImmediately: false })
    : widthToken.value;

  const color = usesReferences(colorToken.value)
    ? resolveReferences(colorToken.value, sd.tokens, { warnImmediately: false })
    : colorToken.value;

  return {
    width,
    color,
    style: "solid",
  };
};

// Helper function to capitalize the first letter of a string
const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Formats a JavaScript object with unquoted keys for standard JS object syntax
// Recursively handles nested objects and proper value formatting
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

// Initialize Style Dictionary with the imported tokens
const sd = new StyleDictionary({
  tokens: exampleTokens,
});

await sd.hasInitialized;

// Convert token data to a structured object format
const convertedTokensData = convertTokenData(sd.tokens, { output: "object" });

// Extract size and color tokens for the selected theme and apply transformations
// Size tokens are processed to fix space references, color tokens get mode replacement
const sizeTokens = transformSizeTokens(
  convertedTokensData["ag-theme"][THEME].size
);
const colorTokens = transformColorTokens(
  convertedTokensData["ag-theme"][THEME].color
);

// Combine size and color tokens into a single object
const allThemeTokens = { ...sizeTokens, ...colorTokens };

// Build the final theme object by filtering and resolving valid theme parameters
// Process each token to create AG-Grid theme parameters and handle borders specially
const unsortedAgGridTheme = Object.entries(allThemeTokens).reduce(
  (themeParams, [key, token]) => {
    // Handle regular theme parameters by resolving token references and mapping to proper names
    if (isThemeParamName(key)) {
      themeParams[getThemeParamName(key)] = usesReferences(token.value)
        ? resolveReferences(token.value, sd.tokens, { warnImmediately: false })
        : token.value;
    }

    // Handle border parameters by combining width and color tokens into border objects
    // Only process width tokens to avoid duplicating border definitions
    if (isBorderWidthParam(key)) {
      const borderParamName = getBorderParamName(key);
      const borderValue = parseBorderValue(borderParamName, allThemeTokens, sd);

      if (borderValue) {
        themeParams[borderParamName] = borderValue;
      }
    }

    return themeParams;
  },
  {}
);

// Sort the theme object alphabetically by key for consistent output
const agGridTheme = Object.keys(unsortedAgGridTheme)
  .sort()
  .reduce((sortedTheme, key) => {
    sortedTheme[key] = unsortedAgGridTheme[key];
    return sortedTheme;
  }, {});

// Generate the theme name for the export variable (e.g., quartzLight)
const themeName = `${THEME}${capitalizeFirst(MODE)}`;

// Generate the output file path with format: [themeName]-ag-grid-theme.js
const filepath = `./themes/${themeName}-ag-grid-theme.js`;

// Generate the JavaScript file content with proper export syntax
const fileContent = `export const ${themeName}Theme = ${formatJSObject(agGridTheme)};
`;

// Write the formatted theme object to a JavaScript file
writeFileSync(filepath, fileContent, "utf8");

console.log(`✅  Theme conversion completed! File saved as: ${filepath}`);
