import { ThemeManager } from "./theme-manager.js";

export class ThemeSelector {
  constructor(container) {
    this.container = container;
    this.themeManager = new ThemeManager();
    this.render();
    this.setupEventListeners();
  }

  render() {
    const currentTheme = this.themeManager.getCurrentTheme();
    const customThemes = this.themeManager.getCustomThemes();

    this.container.innerHTML = `
      <div class="theme-selector p-4 rounded-lg">
        <label for="theme-select" class="block text-sm font-medium mb-2">Thème</label>
        <select id="theme-select" class="w-full p-2 rounded-md">
          <option value="light" ${
            currentTheme === "light" ? "selected" : ""
          }>Clair</option>
          <option value="dark" ${
            currentTheme === "dark" ? "selected" : ""
          }>Sombre</option>
          ${Object.keys(customThemes)
            .map(
              (themeName) => `
            <option value="${themeName}" ${
                currentTheme === themeName ? "selected" : ""
              }>
              ${themeName}
            </option>
          `
            )
            .join("")}
        </select>
      </div>
    `;
  }

  setupEventListeners() {
    const select = this.container.querySelector("#theme-select");
    select.addEventListener("change", (e) => {
      const selectedTheme = e.target.value;
      this.themeManager.changeTheme(selectedTheme);
    });

    // Écouter les changements de thème pour mettre à jour le sélecteur
    this.themeManager.addThemeListener(() => {
      this.render();
    });
  }
}
