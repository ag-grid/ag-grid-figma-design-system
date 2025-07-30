# AG Grid Figma Design System Tokens to AG Grid Theme

An example project using [Style Dictionary](http://styledictionary.com/) to transform design tokens `.json` from the [AG Grid Figma design system](https://www.figma.com/community/file/1360600846643230092) into [AG Grid Theming API](https://www.ag-grid.com/javascript-data-grid/theming-api/) theme objects.

**Please note**: This project is provided as an example to show how [Style Dictionary](http://styledictionary.com/) can be used to transform design tokens `.json` into valid AG Grid theme objects. We recommend that you either modify this project or create your own to match your own AG Grid Figma assets and development workflow.

## Prerequisites

- Node.js (v14 or higher)
- npm
- AG Grid v32 or higher (for using the generated themes)

## Installation

Install the project dependencies:

```sh
npm install
```

## Exporting Design Tokens from Figma

Before you can create an AG Grid theme, first you'll need to export your design tokens from Figma.

1. In the Resources panel go to the Plugins tab.
2. Search for the [Design Tokens](https://www.figma.com/community/plugin/888356646278934516/design-tokens) Figma plugin.
3. In the [Design Tokens](https://www.figma.com/community/plugin/888356646278934516/design-tokens) plugin settings enable the options "**Add mode to design token name (if 2 or more modes)**" and "**Add mode to design token value**".
4. Click run for the [Design Tokens](https://www.figma.com/community/plugin/888356646278934516/design-tokens) and select the 'Export Design Tokens File' option.
5. Deselect all 'include types...' except for "Figma Variables"
6. Click the 'Save & Export' button and save the json to the `./tokens/` directory.

### Command Line Arguments

The script accepts the following optional command line arguments:

- `--tokens`: Path to the design tokens JSON file (default: `./tokens/example-tokens-14-07-25.json`)
- `--theme`: The theme name to extract from the tokens (default: `quartz`)
- `--mode`: The color mode to use (default: `light`)

### Example

```sh
# Generate a custom theme with specific tokens
node tokens-to-ag-grid-theme.js --tokens ./tokens/custom-tokens.json --theme material --mode light
```

## Output

The script generates JavaScript files in the `/themes/` directory. Each file exports a theme object that can be directly used with the AG Grid Theming API.

Example output file: `/themes/myExportedDarkTheme-ag-grid-theme.js`

```javascript
export const myExportedDarkTheme = {
  accentColor: "#2196f3ff",
  backgroundColor: "#ffffffff",
  borderColor: "#181d1f26",
  // ... more theme parameters
};
```

## Using the Generated Themes

To use the generated themes in your AG Grid application, refer to the [AG Grid Theming API documentation](https://www.ag-grid.com/javascript-data-grid/theming-api/).

### Example usage:

```javascript
import {
  AllCommunityModule,
  ModuleRegistry,
  createGrid,
  themeQuartz,
} from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

// Exported theme content
export const myExportedDarkTheme = {
  //...
};

const myTheme = themeQuartz.withParams(myExportedDarkTheme);

const gridOptions = {
  theme: myTheme,
  //...
};

createGrid(document.querySelector("#myGrid"), gridOptions);
```
