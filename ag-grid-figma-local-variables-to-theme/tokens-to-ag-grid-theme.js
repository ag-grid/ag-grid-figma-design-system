import StyleDictionary from "style-dictionary";
import {
  convertTokenData,
  resolveReferences,
  usesReferences,
} from "style-dictionary/utils";
import { THEME_PARAM_NAMES } from "./data/paramNames.js";

import exampleTokens from "./tokens/example-tokens-14-07-25.json" with { type: "json" };

const THEME = "quartz";
const MODE = "light";

const THEME_PARAM_NAMES_LOWERCASE = THEME_PARAM_NAMES.map((paramName) =>
  paramName.toLowerCase()
);

const sd = new StyleDictionary({
  tokens: exampleTokens,
});

await sd.hasInitialized;

const themeTokensData = convertTokenData(sd.tokens, { output: "object" });

// For color token references replace first occurrence of THEME with MODE
// This fixes complexity in our tokens output caused by Figma theme switcher
const transformColorValue = (colorValue) => {
  if (typeof colorValue !== "string") return colorValue;

  return colorValue.replace(THEME, MODE);
};

const transformColorTokens = (colorTokens) => {
  return Object.entries(colorTokens).reduce((acc, [key, color]) => {
    acc[key] = { ...color, value: transformColorValue(color.value) };

    return acc;
  }, {});
};

const themeSizeTokensObj = themeTokensData["ag-theme"][THEME].size;
const themeColorTokensObj = transformColorTokens(
  themeTokensData["ag-theme"][THEME].color
);

const themeTokensObj = { ...themeSizeTokensObj, ...themeColorTokensObj };

const isThemeParamName = (key) => {
  return THEME_PARAM_NAMES_LOWERCASE.includes(key);
};

const getThemeParamName = (key) => {
  return THEME_PARAM_NAMES[THEME_PARAM_NAMES_LOWERCASE.indexOf(key)];
};

const theme = Object.entries(themeTokensObj).reduce((acc, [key, token]) => {
  if (!isThemeParamName(key)) return acc;

  acc[getThemeParamName(key)] = usesReferences(token.value)
    ? resolveReferences(token.value, sd.tokens, { warnImmediately: false })
    : token.value;

  return acc;
}, {});

console.log(theme);
