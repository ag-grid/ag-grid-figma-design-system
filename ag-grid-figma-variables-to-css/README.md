# AG Grid Figma Design System Tokens to CSS Theme

Export design tokens from the AG Grid Figma Design System, and transform them into AG Grid CSS themes. 


## Exporting Design Tokens from Figma

Before you can create an AG Grid CSS theme, first you'll need to export your design tokens from Figma.

1. In the Resources panel go to the Plugins tab. 
2. Search for the [Variables Import Export plugin](https://www.figma.com/community/plugin/1254848311152928301).
3. Click run for the [Variables Import Export plugin](https://www.figma.com/community/plugin/1254848311152928301) and select the 'Export variables' option. 
4. Click the 'Export variables' button and save the json to the `./tokens/` directory.


## Transforming Figma JSON Output to an AG Grid CSS theme 

Install dependencies

```sh
$ npm install
```

Run `tokensToCss.js` and specifiy your tokens .json file to generate your AG Grid CSS themes.

```sh
$ node tokensToCss.js PATH_TO_MY_TOKENS_JSON_FILE.json
```


Your new AG Grid CSS themes will be saved to `./css/`. You should see console output similar to... 

```
css
✔︎ css/ag-theme-alpine-dark.css

css
✔︎ css/ag-theme-alpine.css

css
✔︎ css/ag-theme-MY-CUSTOM-THEME.css
```


You can now apply your theme to your AG Grid app. See our [Themes documentation](https://ag-grid.com/javascript-data-grid/themes/) for more information. 
