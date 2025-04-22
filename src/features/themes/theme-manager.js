// theme-manager.js - Gestionnaire de thèmes

export class ThemeManager {
  constructor() {
    this.themeListeners = [];
    this.customThemes = this.loadCustomThemes();
    this.currentTheme = localStorage.getItem("theme") || "light";
    this.applyTheme(this.currentTheme);
  }

  /**
   * Initialise le gestionnaire de thèmes
   */
  init() {
    // Détecter le mode sombre du système
    this.isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Écouter les changements de préférence système
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        this.isDarkMode = e.matches;
        this.applyTheme();
      });

    // Appliquer le thème initial
    this.applyTheme();
  }

  /**
   * Applique le thème actuel
   */
  applyTheme(themeName) {
    const root = document.documentElement;
    const theme =
      themeName === "light" || themeName === "dark"
        ? this.getDefaultTheme(themeName)
        : this.customThemes[themeName];

    // Supprimer les anciennes classes
    root.classList.remove("theme-light", "theme-dark");

    // Ajouter la nouvelle classe
    root.classList.add(`theme-${themeName}`);

    // Mettre à jour les variables CSS
    this.updateCSSVariables(theme);

    // Notifier les écouteurs
    this.notifyListeners();
  }

  /**
   * Met à jour les variables CSS selon le thème
   * @param {Object} theme - Données du thème
   */
  updateCSSVariables(theme) {
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }

  /**
   * Récupère les données du thème
   * @param {string} themeName - Nom du thème
   * @returns {Object} Données du thème
   */
  getThemeData(themeName) {
    const themes = {
      light: {
        "bg-primary": "#FFFFFF",
        "bg-secondary": "#F8F9FA",
        "text-primary": "#2C3E50",
        "text-secondary": "#6C757D",
        "accent-primary": "#3498DB",
        "accent-secondary": "#2980B9",
        "border-color": "#E9ECEF",
        "shadow-color": "rgba(0, 0, 0, 0.1)",
        "error-color": "#E74C3C",
        "success-color": "#2ECC71",
        "warning-color": "#F1C40F",
        "info-color": "#3498DB",
      },
      dark: {
        "bg-primary": "#1A1A1A",
        "bg-secondary": "#2D2D2D",
        "text-primary": "#FFFFFF",
        "text-secondary": "#B3B3B3",
        "accent-primary": "#3498DB",
        "accent-secondary": "#2980B9",
        "border-color": "#404040",
        "shadow-color": "rgba(0, 0, 0, 0.3)",
        "error-color": "#E74C3C",
        "success-color": "#2ECC71",
        "warning-color": "#F1C40F",
        "info-color": "#3498DB",
      },
    };

    return themes[themeName] || themes.light;
  }

  /**
   * Récupère le thème actuel
   * @returns {string} Nom du thème actuel
   */
  getCurrentTheme() {
    return this.currentTheme;
  }

  /**
   * Récupère tous les thèmes personnalisés
   * @returns {Object} Liste des thèmes personnalisés
   */
  getCustomThemes() {
    return this.customThemes;
  }

  /**
   * Change le thème actuel
   * @param {string} themeName - Nom du thème
   */
  changeTheme(themeName) {
    if (
      themeName === "light" ||
      themeName === "dark" ||
      this.customThemes[themeName]
    ) {
      this.currentTheme = themeName;
      localStorage.setItem("theme", themeName);
      this.applyTheme(themeName);
      this.notifyListeners();
    }
  }

  /**
   * Ajoute un thème personnalisé
   * @param {string} name - Nom du thème
   * @param {Object} theme - Données du thème
   */
  addCustomTheme(name, theme) {
    this.customThemes[name] = theme;
    this.saveCustomThemes();
    this.notifyListeners();
  }

  /**
   * Supprime un thème personnalisé
   * @param {string} name - Nom du thème
   */
  removeCustomTheme(name) {
    if (this.customThemes[name]) {
      delete this.customThemes[name];
      this.saveCustomThemes();
      if (this.currentTheme === name) {
        this.changeTheme("light");
      }
      this.notifyListeners();
    }
  }

  /**
   * Bascule entre le mode clair et sombre
   */
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
  }

  /**
   * Ajoute un écouteur de changements de thème
   * @param {Function} listener - Fonction de callback
   */
  addThemeListener(listener) {
    this.themeListeners.push(listener);
  }

  /**
   * Supprime un écouteur de changements de thème
   * @param {Function} listener - Fonction de callback
   */
  removeThemeListener(listener) {
    this.themeListeners = this.themeListeners.filter((l) => l !== listener);
  }

  /**
   * Notifie tous les écouteurs d'un changement de thème
   */
  notifyListeners() {
    this.themeListeners.forEach((listener) => listener());
  }

  /**
   * Vérifie si le mode sombre est activé
   * @returns {boolean} True si le mode sombre est activé
   */
  isDarkModeEnabled() {
    return this.isDarkMode;
  }

  /**
   * Récupère tous les thèmes disponibles
   * @returns {string[]} Liste des noms de thèmes
   */
  getAvailableThemes() {
    return ["light", "dark", ...Object.keys(this.customThemes)];
  }

  getDefaultTheme(themeName) {
    return themeName === "light"
      ? {
          "bg-primary": "#ffffff",
          "bg-secondary": "#f3f4f6",
          "text-primary": "#1f2937",
          "text-secondary": "#4b5563",
          "accent-primary": "#3b82f6",
          "accent-secondary": "#60a5fa",
          "border-color": "#e5e7eb",
          "shadow-color": "rgba(0, 0, 0, 0.1)",
        }
      : {
          "bg-primary": "#1f2937",
          "bg-secondary": "#111827",
          "text-primary": "#f9fafb",
          "text-secondary": "#d1d5db",
          "accent-primary": "#60a5fa",
          "accent-secondary": "#3b82f6",
          "border-color": "#374151",
          "shadow-color": "rgba(0, 0, 0, 0.3)",
        };
  }

  loadCustomThemes() {
    const savedThemes = localStorage.getItem("customThemes");
    return savedThemes ? JSON.parse(savedThemes) : {};
  }

  saveCustomThemes() {
    localStorage.setItem("customThemes", JSON.stringify(this.customThemes));
  }
}

export const themeManager = new ThemeManager();
