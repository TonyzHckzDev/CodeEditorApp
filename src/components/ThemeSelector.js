import { ThemeManager } from "../features/themes/theme-manager.js";

export class ThemeSelector {
  constructor(container) {
    this.container = container;
    this.themeManager = new ThemeManager();
    this.init();
  }

  init() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    const themeSelector = document.createElement("div");
    themeSelector.className = "theme-selector";

    const select = document.createElement("select");
    select.className = "theme-select";
    select.id = "theme-select";

    // Options de thème par défaut
    const defaultThemes = [
      { value: "light", label: "☀️ Clair" },
      { value: "dark", label: "🌙 Sombre" },
    ];

    defaultThemes.forEach((theme) => {
      const option = document.createElement("option");
      option.value = theme.value;
      option.textContent = theme.label;
      select.appendChild(option);
    });

    // Ajouter les thèmes personnalisés s'ils existent
    const customThemes = this.themeManager.getCustomThemes();
    Object.keys(customThemes).forEach((themeName) => {
      const option = document.createElement("option");
      option.value = themeName;
      option.textContent = themeName;
      select.appendChild(option);
    });

    // Définir la valeur actuelle
    select.value = this.themeManager.getCurrentTheme();

    themeSelector.appendChild(select);
    this.container.appendChild(themeSelector);
  }

  setupEventListeners() {
    const select = this.container.querySelector("#theme-select");
    select.addEventListener("change", (e) => {
      const newTheme = e.target.value;
      this.themeManager.changeTheme(newTheme);
    });

    // Écouter les changements de thème pour mettre à jour le sélecteur
    this.themeManager.addThemeListener(() => {
      select.value = this.themeManager.getCurrentTheme();
    });
  }
}
