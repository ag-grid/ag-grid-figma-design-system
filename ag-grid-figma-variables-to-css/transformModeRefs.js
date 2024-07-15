module.exports = (tokensJson) => {
  const themesJson = tokensJson.themes;

  Object.keys(themesJson).forEach(themeKey => {
    const themeComp = themesJson[themeKey].comp;

    Object.keys(themeComp).forEach(tokenKey => {
      const token = themeComp[tokenKey];

      const isRef = typeof token.value === 'string' && token.value.includes('{');

      if (isRef) {
        token.value = token.value.replace(/material|alpine|quartz/, 'light');
      }
    });
  });

  tokensJson.themes = themesJson

  return tokensJson;
};