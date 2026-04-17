# AG Grid Figma Design System Local Variables to Theme

An example project that transforms design tokens `.json` exported from the [AG Grid Figma design system](https://www.figma.com/community/file/1360600846643230092) into [AG Grid Theming API](https://www.ag-grid.com/javascript-data-grid/theming-api/) theme objects, using the W3C Design Token Community Group (DTCG) format. Each exported JSON file represents a single theme/mode combination (e.g. "Quartz Light", "Alpine Dark").

**Please note**: This project is provided as an example to show how design tokens `.json` can be transformed into valid AG Grid theme objects. We recommend that you either modify this project or create your own to match your own AG Grid Figma assets and development workflow.

## Prerequisites

- Node.js (v18 or higher)
- npm
- AG Grid v32 or higher (for using the generated themes)

## Exporting Design Tokens from Figma

The example project expects a tokens `.json` file for a single local variables "mode".

- Open the local variables panel within the AG Grid Figma Design System file.
- Select the "AG Theme" collection.
- Right-click on the header of the "mode" you wish to export.
- Click "Export mode" and save the tokens `.json` file to your computer.

### Command Line Arguments

The script accepts the following optional command line argument:

- `--tokens`: Path to the design tokens JSON file (default: `./tokens/quartz-light-example-tokens.json`)

The theme name and mode are automatically derived from the file's `$extensions["com.figma.modeName"]` field.

### Example

```sh
# Generate a theme from a specific tokens file
node tokens-to-ag-grid-theme.js --tokens ./tokens/quartz-light-example-tokens.json
```

## Output

The script generates a JavaScript file in the `/themes/` directory. Each file exports a theme object that can be directly used with the AG Grid Theming API.

Example output file: `/themes/quartzLight-ag-grid-theme.js`

```javascript
export const quartzLightTheme = {
  accentColor: "#f32136",
  backgroundColor: "#ffffff",
  borderRadius: 4,
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
export const quartzLightTheme = {
  //...
};

const myTheme = themeQuartz.withParams(quartzLightTheme);

const gridOptions = {
  theme: myTheme,
  //...
};

createGrid(document.querySelector("#myGrid"), gridOptions);
```
