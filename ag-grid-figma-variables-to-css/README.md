# AG Grid Figma Design System Tokens to CSS Theme

Export design tokens from the AG Grid Figma Design System, and transform them into AG Grid CSS theme extension. These custom theme extensions are designed to work with our default `Quartz` theme. 


## Exporting Design Tokens from Figma

Before you can create an AG Grid CSS theme, first you'll need to export your design tokens from Figma.

1. In the Resources panel go to the Plugins tab. 
2. Search for the [Design Tokens](https://www.figma.com/community/plugin/888356646278934516/design-tokens).
3. Click run for the [Design Tokens](https://www.figma.com/community/plugin/888356646278934516/design-tokens) and select the 'Export Design Tokens File' option. 
4. Deselect all ‘include types...’ except for "Figma Variables"
5. Click the 'Save & Export' button and save the json to the `./tokens/` directory.


## Transforming Figma JSON Output to an AG Grid CSS theme 

Install dependencies

```sh
$ npm install
```

Run `tokensToCss.js` and specifiy your tokens .json file to generate your AG Grid CSS themes.

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

See our [Themes documentation](https://ag-grid.com/javascript-data-grid/themes/) for more information. 
