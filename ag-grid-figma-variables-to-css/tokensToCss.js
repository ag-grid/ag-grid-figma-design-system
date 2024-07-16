const fs = require("fs");
const StyleDictionary = require("style-dictionary");
const allProps = require("./data/all-props.json");


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

// Clone the tokens to be able to compare
const trimmedTokens = structuredClone(tokenInput);

// Remove unnecessary collections so we don't trigger reference errors 
delete trimmedTokens.densities;
delete trimmedTokens.admin;
delete trimmedTokens.charts;
if (trimmedTokens.themes.mode) {
  delete trimmedTokens.themes.mode.comp;
}

// Get rid of weird specific problems
delete trimmedTokens.themes.alpine.comp['ag-side-button-panel-background-color'];
delete trimmedTokens.mode.light.theme.alpine.comp['ag-side-button-panel-background-color'];
delete trimmedTokens.mode.light.theme.quartz.comp['ag-border-grid-container'];
delete trimmedTokens.mode.light.theme.quartz.comp['ag-side-button-panel-background-color'];
delete trimmedTokens.mode.light.theme.material.comp['ag-side-button-selected-background-color'];
delete trimmedTokens.mode.light.theme.material.comp['ag-toggle']['active-background'];
delete trimmedTokens.mode.light.theme.material.comp['ag-control']['active-background'];
delete trimmedTokens.mode.light.theme.material.comp['ag-border-grid-container'];
delete trimmedTokens.mode.light.theme.material.comp['ag-side-button-panel-background-color'];
delete trimmedTokens.mode.dark.theme.alpine.comp['ag-border-grid-container'];
delete trimmedTokens.mode.dark.theme.quartz.comp['ag-border-grid-container'];
delete trimmedTokens.mode.dark.theme.quartz.comp['ag-side-button-panel-background-color'];
delete trimmedTokens.mode.dark.theme.material.comp['ag-side-button-panel-background-color'];
delete trimmedTokens.themes.material.comp['ag-side-button-selected-background-color'];
delete trimmedTokens.themes.material.comp['ag-border-grid-container'];
delete trimmedTokens.themes.material.comp['ag-side-button-panel-background-color'];
delete trimmedTokens.themes.quartz.comp['ag-border-grid-container'];
delete trimmedTokens.themes.quartz.comp['ag-side-button-panel-background-color'];

// Extract theme names from json
const themeNames = Object.keys(trimmedTokens.themes).filter((themeName) => themeName !== 'mode');

// Remove any grouped properties 
for (const themeName of themeNames) {
  const comp = trimmedTokens.themes[themeName].comp;

  for (const key in comp) {
    if (comp[key].type === undefined) {
      delete comp[key]
    }
  }
}

// CSS output filename
const outputFile = "./css/new-ag-grid-themes.css";

// Transform and save an AG grid theme css file for each Figma variable collection
const outputTheme = (themeTokens) => {
  let cssOutput = "";

  // const themeNames = Object.keys(themeTokens.themes);

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

outputTheme(trimmedTokens);
