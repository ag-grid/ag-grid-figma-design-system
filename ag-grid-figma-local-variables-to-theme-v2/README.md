# AG Grid Figma Local Variables to Theme (v2)

Converts Figma design tokens exported in the W3C Design Token Community Group (DTCG) format into AG Grid Theming API objects.

This is the v2 version, designed for the newer Figma export format where each JSON file represents a single theme/mode combination (e.g., "Quartz Light", "Alpine Dark").

## Prerequisites

- Node.js v18+
- npm or yarn
- AG Grid v32+

## Installation

```bash
npm install
```

## Exporting Tokens from Figma

1. Open your AG Grid Figma design system file
2. Go to **Resources** > **Plugins** tab
3. Search for the **"Variables Import Export"** plugin
4. Export variables in **DTCG format**
5. Save the JSON file to the `./tokens/` directory

Each export produces one file per theme/mode (e.g., `quartz-light.json`, `alpine-dark.json`).

## Usage

```bash
node tokens-to-ag-grid-theme.js --tokens ./tokens/example-v2-tokens.json
```

### Arguments

| Argument   | Description                     | Default                              |
| ---------- | ------------------------------- | ------------------------------------ |
| `--tokens` | Path to the design tokens JSON  | `./tokens/example-v2-tokens.json`    |

The theme name and mode are automatically extracted from the file's `$extensions["com.figma.modeName"]` field.

### Output

The script generates a JavaScript file in the `./themes/` directory:

```
./themes/quartzLight-ag-grid-theme.js
```

```javascript
export const quartzLightTheme = {
  accentColor: "#f32136",
  backgroundColor: "#ffffff",
  borderRadius: 4,
  // ... more theme parameters
};
```

## Validating Output

A validation script is included that tests the generated theme against AG Grid:

```bash
node validate-theme.js ./themes/quartzLight-ag-grid-theme.js
```

This checks that:
- All keys are valid AG Grid theme parameters
- Value types are correct (colors, numbers, border objects, shadows)
- AG Grid's `themeQuartz.withParams()` accepts the theme without errors

Requires `ag-grid-community` (installed as a devDependency).

## Using the Generated Theme

```javascript
import { themeQuartz } from "ag-grid-community";
import { quartzLightTheme } from "./themes/quartzLight-ag-grid-theme.js";

const myTheme = themeQuartz.withParams(quartzLightTheme);
```

## Differences from v1

| Aspect           | v1                                        | v2 (this project)                    |
| ---------------- | ----------------------------------------- | ------------------------------------ |
| Export format    | `org.lukasoppermann` Design Tokens plugin | W3C DTCG format (`com.figma.*`)      |
| Input structure  | Single file with all themes/modes         | One file per theme/mode              |
| CLI args         | `--tokens`, `--theme`, `--mode`           | `--tokens` only                      |
| Dependencies     | Style Dictionary v5                       | None (raw Node.js)                   |
| References       | Complex cross-collection                  | Simple `{category.tokenName}`        |
