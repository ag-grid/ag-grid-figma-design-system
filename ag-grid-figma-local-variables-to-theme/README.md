# AG Grid & AG Studio Figma Local Variables to Theme

An example project that transforms design tokens `.json` exported from the [AG Grid Figma design system](https://www.figma.com/community/file/1360600846643230092) or the [AG Studio Figma design system](https://www.figma.com/community/file/1680264822642310216/ag-studio-design-system) into [AG Grid Theming API](https://www.ag-grid.com/javascript-data-grid/theming-api/) or [AG Studio theme API](https://www.ag-grid.com/studio/react/studio-theme/) theme objects, using the W3C Design Token Community Group (DTCG) format. Each exported JSON file represents a single theme/mode combination (e.g. "Quartz Light", "Alpine Dark").

**Please note**: This project is provided as an example to show how design tokens `.json` can be transformed into valid AG Grid and AG Studio theme objects. We recommend that you either modify this project or create your own to match your own Figma assets and development workflow.

## Prerequisites

- Node.js (v18 or higher)
- npm
- AG Grid v32 or higher, or AG Studio v2 or higher (for using the generated themes)

## Exporting Design Tokens from Figma

The example project expects a tokens `.json` file for a single local variables "mode".

Each design system is a separate Figma file, so start by opening the one for the product you are theming:

- **AG Grid themes**: open the [AG Grid Figma Design System](https://www.figma.com/community/file/1360600846643230092) file and select the "AG Theme" collection in the local variables panel.
- **AG Studio themes**: open the [AG Studio Figma Design System](https://www.figma.com/community/file/1680264822642310216/ag-studio-design-system) file and select the "AG Studio" collection in the local variables panel.

Then, for either product:

- Right-click on the header of the "mode" you wish to export.
- Click "Export mode" and save the tokens `.json` file to your computer.

### Command Line Arguments

The script accepts the following optional command line arguments:

- `--tokens`: Path to the design tokens JSON file (default: `./tokens/quartz-light-example-tokens.json`)
- `--product`: Which theme API to target, either `ag-grid` or `ag-studio` (default: `ag-grid`)

The theme name and mode are automatically derived from the file's `$extensions["com.figma.modeName"]` field.

### Example

```sh
# Generate an AG Grid theme from a specific tokens file
node ag-tokens-to-themes.js --tokens ./tokens/quartz-light-example-tokens.json

# Generate an AG Studio theme
node ag-tokens-to-themes.js --tokens ./tokens/studio-dark-tokens.json --product ag-studio
```

## Output

The script generates a JavaScript file in the `/themes/` directory. Each file exports a theme object that can be directly used with the AG Grid Theming API or the AG Studio theme API.

Not every token in the AG Studio Figma collection maps to a theme parameter in the version of AG Studio this project targets (see `data/agStudioParamNames.js`). Unmatched tokens are skipped and listed on the console when converting.

Example output file: `/themes/quartzLight-ag-grid-theme.js`

```javascript
export const quartzLightTheme = {
  accentColor: "#f32136",
  backgroundColor: "#ffffff",
  borderRadius: 4,
  // ... more theme parameters
};
```

Example AG Studio output file: `/themes/dark-ag-studio-theme.js`

```javascript
export const darkTheme = {
  accentColor: "#2196f3",
  backgroundColor: "#1f2836",
  gridRowBorder: true,
  // ... more theme parameters
};
```

## Using the Generated Themes

To use the generated themes in your AG Grid application, refer to the [AG Grid Theming API documentation](https://www.ag-grid.com/javascript-data-grid/theming-api/), and for AG Studio the [AG Studio theming documentation](https://www.ag-grid.com/studio/react/theming/).

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

### Example AG Studio usage:

```jsx
import { AgStudio } from "ag-studio-react";
import { studioTheme } from "ag-studio";

// Exported theme content
export const darkTheme = {
  //...
};

const myTheme = studioTheme.withParams(darkTheme);

<AgStudio theme={myTheme} />;
```
