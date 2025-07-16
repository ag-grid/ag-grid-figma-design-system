import { readFileSync } from "fs";
import { parseArgs } from "util";

import StyleDictionary from "style-dictionary";
import {
  convertTokenData,
  resolveReferences,
  usesReferences,
} from "style-dictionary/utils";

import { THEME_PARAM_NAMES } from "./data/paramNames.js";

// Parse command line arguments
const { cliArgs } = parseArgs({
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
    code: {
      type: "string",
      default: "light",
    },
  },
});

// Configuration for theme generation
const TOKENS_FILE = cliArgs.tokens || "./tokens/example-tokens-14-07-25.json";
const THEME = cliArgs.theme || "quartz";
const MODE = cliArgs.mode || "light";
const AG_THEME_PREFIX = "ag-theme";

// Load Figma design tokens from JSON file
const tokensJson = readFileSync(TOKENS_FILE, "utf-8");
const exampleTokens = JSON.parse(tokensJson);

// Create lowercase version of theme parameter names for case-insensitive matching
const THEME_PARAM_NAMES_LOWERCASE = THEME_PARAM_NAMES.map((paramName) =>
  paramName.toLowerCase()
);

// Initialize Style Dictionary with the imported tokens
const sd = new StyleDictionary({
  tokens: exampleTokens,
});

await sd.hasInitialized;

// Convert token data to a structured object format
const convertedTokensData = convertTokenData(sd.tokens, { output: "object" });

// Transforms color cliArgs by replacing theme references with the current mode
const transformColorValue = (colorValue) => {
  if (typeof colorValue !== "string") return colorValue;

  return colorValue.replace(THEME, MODE);
};

// Transforms all color tokens in the provided object
const transformColorTokens = (colorTokens) => {
  return Object.entries(colorTokens).reduce((acc, [key, color]) => {
    acc[key] = { ...color, value: transformColorValue(color.value) };

    return acc;
  }, {});
};

// Extract size and color tokens for the selected theme
const sizeTokens = convertedTokensData[AG_THEME_PREFIX][THEME].size;
const colorTokens = transformColorTokens(
  convertedTokensData[AG_THEME_PREFIX][THEME].color
);

// Combine size and color tokens into a single object
const allThemeTokens = { ...sizeTokens, ...colorTokens };

// Checks if a given key is a valid AG-Grid theme parameter name
const isThemeParamName = (key) => {
  return THEME_PARAM_NAMES_LOWERCASE.includes(key);
};

// Converts a lowercase key to its properly cased theme parameter name
const getThemeParamName = (key) => {
  return THEME_PARAM_NAMES[THEME_PARAM_NAMES_LOWERCASE.indexOf(key)];
};

// Build the final theme object by filtering and resolving valid theme parameters
const agGridTheme = Object.entries(allThemeTokens).reduce(
  (themeParams, [key, token]) => {
    if (!isThemeParamName(key)) return themeParams;

    themeParams[getThemeParamName(key)] = usesReferences(token.value)
      ? resolveReferences(token.value, sd.tokens, { warnImmediately: false })
      : token.value;

    return themeParams;
  },
  {}
);

console.log(agGridTheme);
