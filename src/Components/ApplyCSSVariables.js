const ApplyCSSVariables = (config) => {
    document.documentElement.style.setProperty("--primary-color", config.primary_color || "#1976d2");
    document.documentElement.style.setProperty("--secondary-color", config.secondary_color || "#9c27b0");
    document.documentElement.style.setProperty("--accent-color", config.accent_color || "#ff4081");
    document.documentElement.style.setProperty("--font-family", config.font_family || '"Poppins", sans-serif');
    document.documentElement.style.setProperty("--background-color", config.background_color || "#f8f9fa");
    document.documentElement.style.setProperty("--text-color", config.text_color || "#000000");
  };