const fs = require("fs");
const StyleDictionary = require("style-dictionary");

// Specify path for Figma "Variables Import Export" plugin json output
let tokenPath = process.argv[2];

if (!tokenPath) {
  console.error(
    `No tokens .json file specifified.\nSpecify your tokens .json file with...\n\n$ node tokensToCss.js PATH_TO_MY_TOKENS_JSON_FILE.json`
  );
  process.exit();
}

// Read and parse json input
const tokenInput = JSON.parse(fs.readFileSync(tokenPath, "utf-8"));

// Transform and save an AG grid theme css file for each Figma variable collection
const outputTheme = (themeTokens) => {
  // Format theme name from json
  const themeName = themeTokens.fileName
    .replace("Themes.", "")
    .replace(".tokens.json", "")
    .replace(" ", "-")
    .toLowerCase();

  const tokens = {};

  // Format themeTokens json for style dictionary
  // Detect numbers and add px suffix
  Object.keys(themeTokens.body).forEach((key) => {
    const value = themeTokens.body[key]["$value"];

    tokens[key] = { value: typeof value === "number" ? `${value}px` : value };
  });

  // Style dictionary css variables config
  const dictionaryConfig = {
    tokens,
    platforms: {
      css: {
        transformGroup: "css",
        buildPath: "css/",
        files: [
          {
            destination: `ag-theme-${themeName}.css`,
            format: "css/variables",
          },
        ],
        options: {
          outputReferences: true,
          selector: `.ag-theme-${themeName}`,
        },
      },
    },
  };

  StyleDictionary.extend(dictionaryConfig).buildAllPlatforms();
};

// Iterate over tokens json and create theme file for each mode in the Figma Themes variable collection
tokenInput.forEach((themeTokens) => {
  if (themeTokens.fileName.includes("Themes.")) {
    outputTheme(themeTokens);
  }
});
