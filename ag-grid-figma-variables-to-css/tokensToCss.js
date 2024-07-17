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

// CSS output filename
const outputFile = "./css/new-ag-grid-themes.css";

function getModeThemeNames(tokens, mode) {
  return Object.keys(tokens.mode[mode].theme).filter(
    (themeName) => themeName !== "mode"
  );
}

function getReferencePath(value) {
  if (!value || typeof value !== "string") {
    return false;
  }

  const [, match] = value.match(/^\{(.*)\}/) || [];
  return match;
}

function updateThemeComp({ comp, mode }) {
  Object.entries(comp).forEach(([, propertyObj]) => {
    const isNested = propertyObj.value === undefined;

    if (isNested) {
      updateThemeComp({ comp: propertyObj, mode });
    } else {
      const refPath = getReferencePath(propertyObj.value);
      if (refPath) {
        const path = refPath.split(".");
        if (path[0] === "mode") {
          const newPath = [path[0], mode, ...path.slice(2)];
          propertyObj.value = `{${newPath.join(".")}}`;
        }
      }
    }
  });
}

function updateModeComp({ comp, themeName }) {
  Object.entries(comp).forEach(([, propertyObj]) => {
    const isNested = propertyObj.value === undefined;

    if (isNested) {
      updateModeComp({ comp: propertyObj, themeName });
    } else {
      const refPath = getReferencePath(propertyObj.value);
      if (refPath) {
        const path = refPath.split(".");
        if (path[0] === "themes") {
          const newPath = [path[0], themeName, ...path.slice(2)];
          propertyObj.value = `{${newPath.join(".")}}`;
        }
      }
    }
  });
}

/**
 * Update token references for StyleDictionary
 *
 * NOTE: Modifies `tokens`
 */
function updateTokenReferences({ tokens, mode }) {
  // Update theme comp references
  // Eg, In `themes.material.comp.ag-active-color.value`
  // Convert `mode.material.theme.material.comp.ag-active-color` to `mode.light.theme.material.comp.ag-active-color`
  Object.entries(tokens.themes).forEach(([, themeObj]) => {
    updateThemeComp({ comp: themeObj.comp, mode });
  });

  // Update mode theme comp references
  // Eg, In `mode.light.theme.material.comp.ag-toggle.active-background.value`
  // Convert `themes.light.comp.ag-checkbox-checked-color` -> `themes.material.comp.ag-checkbox-checked-color`
  Object.entries(tokens.mode[mode].theme).forEach(([themeName, themeObj]) => {
    updateModeComp({ comp: themeObj.comp, themeName });
  });

  // Delete other mode, so all references are valid
  const otherModes = Object.keys(tokens.mode).filter((m) => m !== mode);
  for (const otherMode of otherModes) {
    delete tokens.mode[otherMode];
  }
}

// Transform and save an AG grid theme css file for each Figma variable collection
const outputTheme = (tokenContents) => {
  let cssOutput = "";

  ["light", "dark"].forEach((mode) => {
    // Clone the tokens to be able to compare
    const tokens = structuredClone(tokenContents);
    const themeNames = getModeThemeNames(tokens, mode);
    updateTokenReferences({ tokens, mode });

    // Style dictionary css variables config
    const dictionaryConfig = {
      tokens,
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

    themeNames.forEach((themeName) => {
      const themeTokens = tokenExport.mode[mode].theme[themeName].comp;

      const selector = `.ag-theme-${themeName}-${mode} {\n`;

      cssOutput += selector;

      Object.keys(themeTokens).forEach((key) => {
        if (!allProps.includes(key)) return;

        const value = themeTokens[key].value;

        cssOutput += `  --${key}: ${value};\n`;
      });

      cssOutput += `}\n\n`;
    });
  });

  fs.writeFileSync(outputFile, cssOutput);

  console.log(`✔︎ ${outputFile} saved!`);
};

outputTheme(tokenInput);
