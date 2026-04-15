import { readFileSync, writeFileSync } from "fs";
import { parseArgs } from "util";
import {
  THEME_PARAM_NAMES,
  THEME_BORDER_PARAM_NAMES,
} from "./data/paramNames.js";

// --- CLI ---

const { values: args } = parseArgs({
  args: process.argv.slice(2),
  options: {
    tokens: {
      type: "string",
      default: "./tokens/example-v2-tokens.json",
    },
  },
});

// --- Load tokens ---

const tokensJson = JSON.parse(readFileSync(args.tokens, "utf-8"));

// --- Extract mode name ---

const modeName = tokensJson.$extensions?.["com.figma.modeName"];
if (!modeName) {
  throw new Error(
    'No "com.figma.modeName" found in $extensions. Is this a valid v2 token file?'
  );
}

// "Quartz Light" → "quartzLight"
const varName = modeName
  .split(/\s+/)
  .map((word, i) =>
    i === 0
      ? word.toLowerCase()
      : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  )
  .join("");

console.log(`Processing: ${modeName} → ${varName}Theme`);

// --- Build flat token map ---

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

const flatTokens = {};

for (const [category, categoryObj] of Object.entries(tokensJson)) {
  if (category === "$extensions") continue;
  if (!categoryObj || typeof categoryObj !== "object") continue;
  if (categoryObj.$type) continue; // skip top-level tokens like "Color"

  for (const [tokenName, tokenObj] of Object.entries(categoryObj)) {
    if (!tokenObj || typeof tokenObj !== "object" || !tokenObj.$type) continue;

    // For duplicates across categories: non-charts wins
    if (category === "charts" && flatTokens[tokenName]) continue;

    flatTokens[tokenName] = {
      $type: tokenObj.$type,
      $value: tokenObj.$value,
      category,
    };
  }
}

// --- Reference resolution ---

function resolveValue(value, depth = 0) {
  if (depth > 10) {
    console.warn("Warning: circular reference detected, stopping resolution");
    return value;
  }
  if (typeof value === "string" && value.startsWith("{") && value.endsWith("}")) {
    const refPath = value.slice(1, -1); // "foundations.foregroundColor"
    const tokenName = refPath.split(".").pop(); // "foregroundColor"
    const referenced = flatTokens[tokenName];
    if (!referenced) {
      console.warn(`Warning: unresolved reference ${value}`);
      return value;
    }
    return resolveValue(referenced.$value, depth + 1);
  }
  return value;
}

// --- Color conversion ---

function colorToHex(colorValue) {
  if (typeof colorValue === "string") return colorValue;
  const { hex, alpha } = colorValue;
  const hexLower = hex.toLowerCase();
  if (alpha >= 1) return hexLower;
  if (alpha <= 0) return hexLower + "00";
  const alphaHex = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0");
  return hexLower + alphaHex;
}

// --- Convert a token value for output ---

function convertValue(tokenName, type, rawValue) {
  const resolved = resolveValue(rawValue);

  // Shadow params
  if (SHADOW_PARAMS.has(tokenName)) {
    if (typeof resolved === "string") return resolved;
    if (typeof resolved === "number" && resolved === 0) return "none";
    return "none";
  }

  // Color
  if (type === "color" && typeof resolved === "object" && resolved !== null && resolved.hex) {
    return colorToHex(resolved);
  }

  // String
  if (type === "string") {
    if (tokenName === "browserColorScheme") return resolved.toLowerCase();
    return resolved;
  }

  // Number
  if (type === "number") return resolved;

  return resolved;
}

// --- Build param lookup maps ---

const paramNamesLower = new Map(
  THEME_PARAM_NAMES.map((n) => [n.toLowerCase(), n])
);
const borderNamesLower = new Map(
  THEME_BORDER_PARAM_NAMES.map((n) => [n.toLowerCase(), n])
);

// --- Build theme object ---

const unsortedTheme = {};

// Pass 1: Regular params (not border param names themselves)
for (const [tokenName, token] of Object.entries(flatTokens)) {
  const paramName = paramNamesLower.get(tokenName.toLowerCase());
  if (paramName && !borderNamesLower.has(tokenName.toLowerCase())) {
    unsortedTheme[paramName] = convertValue(paramName, token.$type, token.$value);
  }
}

// Pass 2: Border params — combine {name}Color + {name}Width into objects
for (const borderName of THEME_BORDER_PARAM_NAMES) {
  const widthToken = flatTokens[borderName + "Width"];
  const colorToken = flatTokens[borderName + "Color"];

  if (widthToken && colorToken) {
    const width = resolveValue(widthToken.$value);
    const colorResolved = resolveValue(colorToken.$value);
    const color =
      typeof colorResolved === "object" && colorResolved !== null
        ? colorToHex(colorResolved)
        : colorResolved;
    unsortedTheme[borderName] = { width, color, style: "solid" };
  }
}

// Sort alphabetically
const theme = Object.keys(unsortedTheme)
  .sort()
  .reduce((acc, key) => {
    acc[key] = unsortedTheme[key];
    return acc;
  }, {});

// --- Format JS output ---

function formatJSObject(obj, indent = 2) {
  const spaces = " ".repeat(indent);
  const entries = Object.entries(obj);
  if (entries.length === 0) return "{}";

  const formattedEntries = entries.map(([key, value]) => {
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
}

// --- Write output ---

const outputPath = `./themes/${varName}-ag-grid-theme.js`;
const content = `export const ${varName}Theme = ${formatJSObject(theme)};\n`;

writeFileSync(outputPath, content, "utf-8");

const paramCount = Object.keys(theme).length;
console.log(`Wrote ${paramCount} params to ${outputPath}`);
