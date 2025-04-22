export class ThemeManager {
  constructor() {
    this.themes = {
      light: {
        name: 'Clair',
        editor: 'vs-light',
        ui: 'light',
      },
      dark: {
        name: 'Sombre',
        editor: 'vs-dark',
        ui: 'dark',
      },
      highContrast: {
        name: 'Contraste élevé',
        editor: 'hc-black',
        ui: 'high-contrast',
      },
    };
    this.currentTheme = 'dark';
  }

  initialize() {
    // Restaurer le thème sauvegardé
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && this.themes[savedTheme]) {
      this.setTheme(savedTheme);
    }

    // Écouter les changements de préférence système
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', e => {
      if (!localStorage.getItem('theme')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  setTheme(themeName) {
    if (!this.themes[themeName]) {
      console.warn(`Thème "${themeName}" non trouvé`);
      return;
    }

    this.currentTheme = themeName;
    const theme = this.themes[themeName];

    // Mettre à jour l'éditeur
    if (window.monaco) {
      monaco.editor.setTheme(theme.editor);
    }

    // Mettre à jour l'interface
    document.documentElement.classList.remove('light', 'dark', 'high-contrast');
    document.documentElement.classList.add(theme.ui);

    // Sauvegarder la préférence
    localStorage.setItem('theme', themeName);

    // Émettre l'événement de changement
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: theme }));
  }

  getCurrentTheme() {
    return this.themes[this.currentTheme];
  }

  getAvailableThemes() {
    return Object.entries(this.themes).map(([key, theme]) => ({
      id: key,
      ...theme,
    }));
  }
}
