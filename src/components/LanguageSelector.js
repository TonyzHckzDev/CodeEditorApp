export class LanguageSelector {
  constructor(selectElement, editor) {
    this.select = selectElement;
    this.editor = editor;
    this.languages = editor.getSupportedLanguages();
    this.initialize();
  }

  initialize() {
    // Remplir le sélecteur avec les langages disponibles
    this.languages.forEach(lang => {
      const option = document.createElement('option');
      option.value = lang.id;
      option.textContent = lang.name;
      this.select.appendChild(option);
    });

    // Écouter les changements de langage
    this.select.addEventListener('change', e => {
      const selectedLanguage = e.target.value;
      this.editor.setLanguage(selectedLanguage);
      this.updateFileExtension(selectedLanguage);
    });

    // Écouter les changements de langage depuis l'éditeur
    this.editor.editor.onDidChangeModelLanguage(e => {
      const currentLanguage = e.newLanguage;
      if (this.select.value !== currentLanguage) {
        this.select.value = currentLanguage;
        this.updateFileExtension(currentLanguage);
      }
    });
  }

  updateFileExtension(languageId) {
    const extension = this.editor.getCurrentFileExtension();
    // Mettre à jour l'extension dans l'interface si nécessaire
    const extensionElement = document.getElementById('file-extension');
    if (extensionElement) {
      extensionElement.textContent = `.${extension}`;
    }
  }

  getCurrentLanguage() {
    return this.select.value;
  }

  setLanguage(languageId) {
    if (this.editor.languageManager.isLanguageSupported(languageId)) {
      this.select.value = languageId;
      this.editor.setLanguage(languageId);
      this.updateFileExtension(languageId);
    }
  }
}
