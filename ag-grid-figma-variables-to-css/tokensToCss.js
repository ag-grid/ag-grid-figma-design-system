const fs = require("fs");
const StyleDictionary = require("style-dictionary");
const allProps = require("./data/all-props.json");
const transformModeRefs = require("./transformModeRefs");


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

// Fix issues with plugin output
const transformedTokens = transformModeRefs(tokenInput);

console.log(transformedTokens.themes.material.comp['ag-active-color'].value);

// CSS output filename
const outputFile = "./css/new-ag-grid-themes.css";

// Transform and save an AG grid theme css file for each Figma variable collection
const outputTheme = (themeTokens) => {
  let cssOutput = "";

  const themeNames = Object.keys(themeTokens.themes);

  // Style dictionary css variables config
  const dictionaryConfig = {
    tokens: themeTokens,
    platforms: {
      css: {
        transformGroup: "css",
        options: {
          outputReferences: true,
        },
      },
    },
  };

  const tokenExport =
    StyleDictionary.extend(dictionaryConfig).exportPlatform("css");

  ["light", "dark"].forEach((mode) => {
    themeNames.forEach((themeName) => {
      const tokens = tokenExport.mode[mode].theme[themeName].comp;

      const selector = `.ag-theme-${themeName}-${mode} {\n`;

      cssOutput += selector;

      Object.keys(tokens).forEach((key) => {
        if (!allProps.includes(key)) return;

        const value = tokens[key].value;

        cssOutput += `  --${key}: ${value};\n`;
      });

      cssOutput += `}\n\n`;
    });
  });

  fs.writeFileSync(outputFile, cssOutput);

  console.log(`✔︎ ${outputFile} saved!`);
};

outputTheme(transformedTokens);
