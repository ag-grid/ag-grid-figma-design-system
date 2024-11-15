const fs = require("fs");
const StyleDictionary = require("style-dictionary");
const allProps = require("./data/all-props.json");

// Specify path for Figma "Variables Import Export" plugin json output
let tokenPath = process.argv[2];

if (!tokenPath) {
  console.error(
    `No tokens .json file specified.\nSpecify your tokens .json file with...\n\n$ node tokensToCss.js PATH_TO_MY_TOKENS_JSON_FILE.json`
  );
  process.exit();
}

// Ignore these mode keys from output CSS
const MODE_KEY_EXCLUSIONS = [
  "mode",
  "charts",
  "ag-charts-logo-light",
  "ag-charts-logo-dark",
];

// Read and parse json input
const tokenInput = JSON.parse(fs.readFileSync(tokenPath, "utf-8"));

// CSS output filename
const outputFile = "./css/new-ag-grid-themes.css";

function getModeThemeNames(tokens, mode) {
  return Object.keys(tokens["ag-mode"][mode]).filter(
    (themeName) => !MODE_KEY_EXCLUSIONS.includes(themeName)
  );
}

function getReferencePath(value) {
  if (!value || typeof value !== "string") {
    return false;
  }

  const [, match] = value.match(/^\{(.*)\}/) || [];
  return match;
}

function updateReferenceModeValue({ propertyObj, mode }) {
  const refPath = getReferencePath(propertyObj.value);
  if (refPath) {
    const path = refPath.split(".");
    if (path[0] === "ag-mode") {
      const newPath = [path[0], mode, ...path.slice(2)];
      propertyObj.value = `{${newPath.join(".")}}`;
    }
  }
}

function updateThemeReferences({ propertyObj, mode }) {
  Object.entries(propertyObj).forEach(([, innerPropertyObj]) => {
    const isNested = innerPropertyObj.value === undefined;

    if (isNested) {
      updateThemeReferences({ propertyObj: innerPropertyObj, mode });
    } else {
      updateReferenceModeValue({ propertyObj: innerPropertyObj, mode });
    }
  });
}

function getProperty({ path, tokens }) {
  return path.reduce((acc, key) => {
    if (acc && acc.hasOwnProperty(key)) {
      return acc[key];
    }

    return undefined;
  }, tokens);
}

function updateModeReferences({ propertyObj, themeName, mode, tokens }) {
  Object.entries(propertyObj).forEach(([, innerPropertyObj]) => {
    const isNested = innerPropertyObj.value === undefined;

    if (isNested) {
      if (typeof innerPropertyObj == "object") {
        updateModeReferences({
          propertyObj: innerPropertyObj,
          themeName,
          mode,
          tokens,
        });
      }
    } else {
      const refPath = getReferencePath(innerPropertyObj.value);
      if (refPath) {
        const path = refPath.split(".");
        if (path[0] === "ag-theme") {
          const searchPath = [path[0], themeName, ...path.slice(2)];
          const prop = getProperty({ path: searchPath, tokens });
          if (prop) {
            // Update source mode value
            updateReferenceModeValue({ propertyObj: prop, mode });

            // Update theme value that references mode
            innerPropertyObj.value = prop.value;
          } else {
            console.error("Not found", {
              searchPath,
              path,
              refPath,
            });
          }
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
  // Update theme color references
  // Eg, In `ag-theme.material.color.ag-active-color.value`
  // Convert `ag-mode.material.material.ag-active-color` to `ag-mode.[mode].material.ag-active-color`
  Object.entries(tokens["ag-theme"]).forEach(([, themeObj]) => {
    updateThemeReferences({ propertyObj: themeObj.color, mode });
  });

  // Update ag-mode theme references
  // Eg, In `ag-mode.light.alpine.ag-side-button-panel-background-color.value`
  // Has value `ag-theme.light.color.ag-background-color`
  // Look for `ag-theme.alpine.color.ag-background-color`
  // Has value `{ag-mode.alpine.alpine.ag-background-color}`
  // Return `ag-mode.light.alpine.ag-background-color`
  Object.entries(tokens["ag-mode"][mode]).forEach(
    ([themeName, propertyObj]) => {
      updateModeReferences({ propertyObj, themeName, mode, tokens });
    }
  );

  // Delete other mode, so all references are valid
  const otherModes = Object.keys(tokens["ag-mode"]).filter((m) => m !== mode);
  for (const otherMode of otherModes) {
    delete tokens["ag-mode"][otherMode];
  }

  // Delete charts
  delete tokens["ag-chart"];
}

function getTokensCss(tokens) {
  let cssOutput = "";

  Object.keys(tokens)
    .filter((key) => allProps.includes(key))
    .forEach((key) => {
      const { type, value } = tokens[key];
      const cssValue = type === "dimension" ? `${value}px` : value;

      cssOutput += `  --${key}: ${cssValue};\n`;
    });

  return cssOutput;
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
      const selector = `.ag-theme-${themeName}-${mode} {\n`;

      cssOutput += selector;

      cssOutput += getTokensCss(tokenExport["ag-theme"][themeName]);
      cssOutput += getTokensCss(tokenExport["ag-theme"][themeName].size);
      cssOutput += getTokensCss(tokenExport["ag-theme"][themeName].space);

      const themeTokens = tokenExport["ag-mode"][mode][themeName];
      Object.keys(themeTokens)
        .filter((key) => allProps.includes(key))
        .forEach((key) => {
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
