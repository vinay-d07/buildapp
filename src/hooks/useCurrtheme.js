const { useTheme } = require("next-themes");

export const useCurrtheme = () => {
    const { systemTheme, theme } = useTheme()
    if (theme === "light" || theme === "dark") {
        return theme
    }
    return systemTheme
}