# AG Grid Figma Design System Tokens to Legacy CSS Theme

An example project using [Style Dictionary](https://amzn.github.io/style-dictionary/#/) to transform design tokens `.json` from the [AG Grid Figma design system](https://www.figma.com/community/file/1360600846643230092) into [AG Grid Legacy Themes](https://www.ag-grid.com/javascript-data-grid/theming-migration/#continue-with-legacy-themes). Legacy themes output using this method are designed to extend the AG Grid Quartz theme.

**Please note**: This project is provided as an example to show how [Style Dictionary](https://amzn.github.io/style-dictionary/#/) can be used to transform design tokens `.json` into valid AG Grid legacy themes. We recommend that you either modify this project or create your own to match your own AG Grid Figma assets and development workflow.

## Exporting Design Tokens from Figma

Before you can create an AG Grid CSS theme, first you'll need to export your design tokens from Figma.

1. In the Resources panel go to the Plugins tab. 
2. Search for the [Design Tokens](https://www.figma.com/community/plugin/888356646278934516/design-tokens) Figma plugin.
3. In the [Design Tokens](https://www.figma.com/community/plugin/888356646278934516/design-tokens) plugin settings enable the options "**Add mode to design token name (if 2 or more modes)**" and "**Add mode to design token value**".
4. Click run for the [Design Tokens](https://www.figma.com/community/plugin/888356646278934516/design-tokens) and select the 'Export Design Tokens File' option. 
5. Deselect all ‘include types...’ except for "Figma Variables"
6. Click the 'Save & Export' button and save the json to the `./tokens/` directory.


## Transforming Figma JSON Output to an AG Grid CSS theme 

Install dependencies

```sh
$ npm install
```

Run `tokensToCss.js` and specify your tokens .json file to generate your AG Grid CSS themes.

```sh
$ node tokensToCss.js PATH_TO_MY_TOKENS_JSON_FILE.tokens.json
```


Your new AG Grid CSS themes will be saved to `./css/`. You should see console output similar to... 

```
✔︎ ./css/new-ag-grid-themes.css saved!
```

You can now extend the default AG Grid Quartz theme with your custom extension. Shown below is a simple example of extending the Quartz theme. 

```html
<html lang="en">
  <head>
    <!-- Includes all JS & CSS for the JavaScript Data Grid -->
    <script src="https://cdn.jsdelivr.net/npm/ag-grid-community/dist/ag-grid-community.min.js"></script>
    
    <!-- Load your custom theme extension CSS, would include the .my-custom-extension class -->
    <link rel="stylesheet" href="my-custom-extension.css">
  </head>
  <body>
    <!-- Your grid container, including  quartz and .my-custom-extension classes -->
    <div id="myGrid" class="ag-theme-quartz my-custom-extension"></div>

    <script>
      // Grid Options: Contains all of the data grid configurations
      const gridOptions = {};

      // Your Javascript code to create the data grid
      const myGridElement = document.querySelector('#myGrid');

      agGrid.createGrid(myGridElement, gridOptions);
    </script>
  </body>
</html>
```

See our [Legacy themes documentation](https://www.ag-grid.com/javascript-data-grid/theming-migration/#continue-with-legacy-themes) for more information. 

## Licence
This example project is under the MIT license. See `LICENSE.txt` for more information. 