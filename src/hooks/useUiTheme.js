// Hook para el tema de la interfaz (uiTheme)
window.useUiTheme = function() {
    const [uiTheme, setUiTheme] = React.useState(() => {
        try { return localStorage.getItem(MULLER_THEME_KEY) || 'dark'; } catch (e) { return 'dark'; }
    });
    return { uiTheme, setUiTheme };
};
