import { readFileSync } from "fs";
import { parseArgs } from "util";
import { pathToFileURL } from "url";
import { resolve } from "path";
import { themeQuartz } from "ag-grid-community";
import {
  THEME_PARAM_NAMES,
  THEME_BORDER_PARAM_NAMES,
} from "./data/paramNames.js";

// --- CLI ---

const { positionals } = parseArgs({
  args: process.argv.slice(2),
  allowPositionals: true,
});

const themePath = positionals[0] || "./themes/quartzLight-ag-grid-theme.js";

console.log(`Validating: ${themePath}\n`);

// --- Import the generated theme ---

const absolutePath = resolve(themePath);
const mod = await import(pathToFileURL(absolutePath).href);

const exportNames = Object.keys(mod);
if (exportNames.length === 0) {
  console.error("FAIL: No exports found in theme file");
  process.exit(1);
}

const themeObj = mod[exportNames[0]];
console.log(`Export: ${exportNames[0]} (${Object.keys(themeObj).length} params)\n`);

// --- Build lookup sets ---

const allParamNames = new Set([
  ...THEME_PARAM_NAMES.map((n) => n.toLowerCase()),
  ...THEME_BORDER_PARAM_NAMES.map((n) => n.toLowerCase()),
]);

const borderNames = new Set(
  THEME_BORDER_PARAM_NAMES.map((n) => n.toLowerCase())
);

const SHADOW_PARAMS = new Set([
  "cardShadow",
  "cellEditingShadow",
  "dialogShadow",
  "dragAndDropImageShadow",
  "dropdownShadow",
  "focusShadow",
  "inputFocusShadow",
  "menuShadow",
  "popupShadow",
]);

const STRING_PARAMS = new Set([
  "browserColorScheme",
  "fontFamily",
  "cellFontFamily",
  "headerFontFamily",
  "rangeSelectionBorderStyle",
]);

// --- Validation ---

const errors = [];
const warnings = [];

// Check 1: All keys are valid AG Grid params
for (const key of Object.keys(themeObj)) {
  if (!allParamNames.has(key.toLowerCase())) {
    errors.push(`Unknown param: "${key}" is not a valid AG Grid theme param`);
  }
}

// Check 2: Type validation
for (const [key, value] of Object.entries(themeObj)) {
  const keyLower = key.toLowerCase();

  if (borderNames.has(keyLower)) {
    // Border params should be objects with { width, color, style }
    if (typeof value !== "object" || value === null) {
      errors.push(`Border "${key}": expected object, got ${typeof value}`);
    } else {
      if (!("width" in value))
        errors.push(`Border "${key}": missing "width" property`);
      if (!("color" in value))
        errors.push(`Border "${key}": missing "color" property`);
      if (!("style" in value))
        errors.push(`Border "${key}": missing "style" property`);
      if (typeof value.color === "string" && !value.color.startsWith("#")) {
        warnings.push(
          `Border "${key}": color "${value.color}" doesn't look like a hex color`
        );
      }
    }
  } else if (SHADOW_PARAMS.has(key)) {
    if (typeof value !== "string") {
      errors.push(`Shadow "${key}": expected string, got ${typeof value} (${value})`);
    }
  } else if (STRING_PARAMS.has(key)) {
    if (typeof value !== "string") {
      errors.push(`String param "${key}": expected string, got ${typeof value}`);
    }
  } else if (typeof value === "string") {
    // Color params — should be hex strings
    if (
      !value.startsWith("#") &&
      !value.startsWith("rgb") &&
      value !== "none" &&
      value !== "transparent"
    ) {
      warnings.push(`"${key}": string value "${value}" doesn't look like a color`);
    }
  }
}

// Check 3: Try applying to AG Grid's themeQuartz
let agGridResult = "PASS";
try {
  themeQuartz.withParams(themeObj);
} catch (err) {
  agGridResult = `FAIL: ${err.message}`;
  errors.push(`AG Grid themeQuartz.withParams() failed: ${err.message}`);
}

// --- Report ---

console.log("=== Validation Report ===\n");
console.log(`Total params:      ${Object.keys(themeObj).length}`);
console.log(`AG Grid accepted:  ${agGridResult}`);
console.log(`Errors:            ${errors.length}`);
console.log(`Warnings:          ${warnings.length}`);

if (errors.length > 0) {
  console.log("\n--- Errors ---");
  errors.forEach((e) => console.log(`  ERROR: ${e}`));
}

if (warnings.length > 0) {
  console.log("\n--- Warnings ---");
  warnings.forEach((w) => console.log(`  WARN: ${w}`));
}

if (errors.length === 0) {
  console.log("\nResult: PASS");
} else {
  console.log("\nResult: FAIL");
  process.exit(1);
}
