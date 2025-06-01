import { createContext, useState, useMemo, useEffect } from "react";
import { createTheme } from "@mui/material/styles";
import Gyankoonj_fav from "./Images/GKicon.png";

// color design tokens export
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        grey: { 100: "#e0e0e0", 200: "#c2c2c2", 300: "#a3a3a3", 400: "#858585", 500: "#666666", 600: "#525252", 700: "#3d3d3d", 800: "#292929", 900: "#141414" },
        primary: { 100: "#d0d1d5", 200: "#a1a4ab", 300: "#727681", 400: "#1F2A40", 500: "#141b2d", 600: "#101624", 700: "#0c101b", 800: "#080b12", 900: "#040509" },
        greenAccent: { 100: "#dbf5ee", 200: "#b7ebde", 300: "#94e2cd", 400: "#70d8bd", 500: "#4cceac", 600: "#3da58a", 700: "#2e7c67", 800: "#1e5245", 900: "#0f2922" },
        redAccent: { 100: "#f8dcdb", 200: "#f1b9b7", 300: "#e99592", 400: "#e2726e", 500: "#db4f4a", 600: "#af3f3b", 700: "#832f2c", 800: "#58201e", 900: "#2c100f" },
        blueAccent: { 100: "#e1e2fe", 200: "#c3c6fd", 300: "#a4a9fc", 400: "#868dfb", 500: "#6870fa", 600: "#535ac8", 700: "#3e4396", 800: "#2a2d64", 900: "#151632" },
      }
    : {
        grey: { 100: "#141414", 200: "#292929", 300: "#3d3d3d", 400: "#525252", 500: "#666666", 600: "#858585", 700: "#a3a3a3", 800: "#c2c2c2", 900: "#e0e0e0" },
        primary: { 100: "#040509", 200: "#080b12", 300: "#0c101b", 400: "#f2f0f0", 500: "#141b2d", 600: "#1F2A40", 700: "#727681", 800: "#a1a4ab", 900: "#d0d1d5" },
        greenAccent: { 100: "#0f2922", 200: "#1e5245", 300: "#2e7c67", 400: "#3da58a", 500: "#4cceac", 600: "#70d8bd", 700: "#94e2cd", 800: "#b7ebde", 900: "#dbf5ee" },
        redAccent: { 100: "#2c100f", 200: "#58201e", 300: "#832f2c", 400: "#af3f3b", 500: "#db4f4a", 600: "#e2726e", 700: "#e99592", 800: "#f1b9b7", 900: "#f8dcdb" },
        blueAccent: { 100: "#151632", 200: "#2a2d64", 300: "#3e4396", 400: "#535ac8", 500: "#6870fa", 600: "#868dfb", 700: "#a4a9fc", 800: "#c3c6fd", 900: "#e1e2fe" },
      }),
});


// MUI Theme Settings with School Config
export const themeSettings = (mode, schoolConfig = {}) => {
  const colors = tokens(mode);

  const primary_color = schoolConfig.primary_color || (mode === "dark" ? colors.primary[500] : colors.primary[100]);
  const secondary_color = schoolConfig.secondary_color || colors.greenAccent[500];
  const accent_color = schoolConfig.accent_color || colors.blueAccent[500];
  const font_family = schoolConfig.font_family || '"Poppins", sans-serif';

  return {
    palette: {
      mode: mode,
      primary: { main: primary_color },
      secondary: { main: secondary_color },
      accent: { main: accent_color },
      neutral: {
        dark: colors.grey[700],
        main: colors.grey[500],
        light: colors.grey[100],
      },
      background: {
        default: mode === "dark" ? colors.primary[500] : "#fcfcfc",
      },
    },
    typography: {
      fontFamily: [font_family, "sans-serif"].join(","),
      fontSize: 12,
      h1: { font_family, fontSize: 40 },
      h2: { font_family, fontSize: 32 },
      h3: { font_family, fontSize: 24 },
      h4: { font_family, fontSize: 20 },
      h5: { font_family, fontSize: 16 },
      h6: { font_family, fontSize: 14 },
    },
  };
};

// 🌓 Context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

// useMode hook (loads config from localStorage)
export const useMode = () => {
  const [mode, setMode] = useState("light");
  const [schoolConfig, setSchoolConfig] = useState({});

  useEffect(() => {
    const configStr = localStorage.getItem("school_config");
    if (configStr) {
      try {
        const parsedConfig = JSON.parse(configStr);
        setSchoolConfig(parsedConfig);
        updateFavicon(parsedConfig.favicon_url || Gyankoonj_fav);
  
        // Dynamically update CSS variables
        document.documentElement.style.setProperty("--primary-color", parsedConfig.primary_color || "#1976d2");
        document.documentElement.style.setProperty("--secondary-color", parsedConfig.secondary_color || "#9c27b0");
        document.documentElement.style.setProperty("--accent-color", parsedConfig.accent_color || "#ff4081");
        document.documentElement.style.setProperty("--font-family", parsedConfig.font_family || '"Poppins", sans-serif');
        document.documentElement.style.setProperty("--background-color", parsedConfig.background_color || "#f8f9fa");
        document.documentElement.style.setProperty("--text-color", parsedConfig.text_color || "#000000");
      } catch (err) {
        console.warn("Invalid school config in localStorage");
      }
    }
    else{
      updateFavicon(Gyankoonj_fav);
    }
  }, []);

  const updateFavicon = (url) => {
    // Remove existing favicon(s)
    const existingIcons = document.querySelectorAll("link[rel*='icon']");
    existingIcons.forEach(icon => icon.parentNode.removeChild(icon));
  
    // Create new favicon link
    const link = document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = url;
  
    // Append to head
    document.head.appendChild(link);
  };
  
  

  const colorMode = useMemo(() => ({
    toggleColorMode: () =>
      setMode((prev) => (prev === "light" ? "dark" : "light")),
  }), []);

  const theme = useMemo(() => createTheme(themeSettings(mode, schoolConfig)), [mode, schoolConfig]);
  return [theme, colorMode];
};