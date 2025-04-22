// advanced-editor.js - Fonctionnalités avancées pour l'éditeur Monaco

class AdvancedEditor {
  constructor() {
    this.editor = null;
    this.language = "javascript";
    this.theme = "vs-dark";
    this.suggestions = [];
    this.diagnostics = [];
    this.formatters = new Map();
    this.snippets = new Map();
    this.history = [];
    this.historyIndex = -1;
  }

  /**
   * Initialise l'éditeur avancé
   * @param {Object} editor - Instance de l'éditeur Monaco
   */
  init(editor) {
    this.editor = editor;
    this.setupAutoCompletion();
    this.setupLinting();
    this.setupFormatting();
    this.setupHistory();
    this.setupSnippets();
    this.setupThemes();
    this.setupKeyboardShortcuts();
  }

  /**
   * Configure l'auto-complétion
   */
  setupAutoCompletion() {
    if (!this.editor) return;

    // Configuration de base pour l'auto-complétion
    this.editor.updateOptions({
      suggestOnTriggerCharacters: true,
      quickSuggestions: {
        other: true,
        comments: true,
        strings: true,
      },
      acceptSuggestionOnEnter: "on",
      tabCompletion: "on",
      wordBasedSuggestions: "matchingDocuments",
      parameterHints: {
        enabled: true,
      },
    });

    // Enregistrer le fournisseur de suggestions personnalisé
    monaco.languages.registerCompletionItemProvider(this.language, {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        return {
          suggestions: this.suggestions.map((suggestion) => ({
            ...suggestion,
            range,
          })),
        };
      },
    });
  }

  /**
   * Configure le linting
   */
  setupLinting() {
    if (!this.editor) return;

    // Configuration de base pour le linting
    this.editor.updateOptions({
      minimap: {
        enabled: true,
      },
      scrollBeyondLastLine: false,
      renderWhitespace: "selection",
      renderControlCharacters: true,
      renderIndentGuides: true,
      renderLineHighlight: "all",
    });

    // Enregistrer le fournisseur de diagnostics personnalisé
    monaco.languages.registerDiagnosticsProvider(this.language, {
      dispose: () => {},
      onDidChangeDiagnostics: () => {},
      getDiagnostics: () => this.diagnostics,
    });
  }

  /**
   * Configure le formatage
   */
  setupFormatting() {
    if (!this.editor) return;

    // Enregistrer les formateurs pour différents langages
    this.formatters.set("javascript", {
      format: (code) => {
        try {
          // Utiliser prettier ou un autre formateur
          return code;
        } catch (error) {
          console.error("Erreur de formatage:", error);
          return code;
        }
      },
    });

    this.formatters.set("html", {
      format: (code) => {
        try {
          // Utiliser un formateur HTML
          return code;
        } catch (error) {
          console.error("Erreur de formatage HTML:", error);
          return code;
        }
      },
    });

    this.formatters.set("css", {
      format: (code) => {
        try {
          // Utiliser un formateur CSS
          return code;
        } catch (error) {
          console.error("Erreur de formatage CSS:", error);
          return code;
        }
      },
    });
  }

  /**
   * Configure l'historique des modifications
   */
  setupHistory() {
    if (!this.editor) return;

    this.editor.onDidChangeModelContent(() => {
      const value = this.editor.getValue();

      // Ajouter à l'historique
      this.historyIndex++;
      this.history = this.history.slice(0, this.historyIndex);
      this.history.push(value);
    });
  }

  /**
   * Configure les snippets
   */
  setupSnippets() {
    // Snippets JavaScript
    this.snippets.set("javascript", [
      {
        label: "function",
        insertText: "function ${1:name}(${2:params}) {\n\t${3}\n}",
        documentation: "Créer une fonction",
      },
      {
        label: "if",
        insertText: "if (${1:condition}) {\n\t${2}\n}",
        documentation: "Créer une condition if",
      },
      {
        label: "for",
        insertText:
          "for (let ${1:i} = 0; ${1:i} < ${2:array}.length; ${1:i}++) {\n\t${3}\n}",
        documentation: "Créer une boucle for",
      },
    ]);

    // Snippets HTML
    this.snippets.set("html", [
      {
        label: "div",
        insertText: '<div class="${1:class}">\n\t${2}\n</div>',
        documentation: "Créer un div",
      },
      {
        label: "button",
        insertText: '<button class="${1:class}">${2:text}</button>',
        documentation: "Créer un bouton",
      },
    ]);

    // Snippets CSS
    this.snippets.set("css", [
      {
        label: "flex",
        insertText:
          "display: flex;\njustify-content: ${1:center};\nalign-items: ${2:center};",
        documentation: "Créer un conteneur flex",
      },
      {
        label: "grid",
        insertText:
          "display: grid;\ngrid-template-columns: ${1:repeat(3, 1fr)};\ngrid-gap: ${2:1rem};",
        documentation: "Créer un conteneur grid",
      },
    ]);
  }

  /**
   * Configure les thèmes
   */
  setupThemes() {
    // Thème sombre personnalisé
    monaco.editor.defineTheme("codeeditor-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6A9955" },
        { token: "keyword", foreground: "C586C0" },
        { token: "string", foreground: "CE9178" },
        { token: "number", foreground: "B5CEA8" },
        { token: "function", foreground: "DCDCAA" },
        { token: "variable", foreground: "9CDCFE" },
      ],
      colors: {
        "editor.background": "#1E1E1E",
        "editor.foreground": "#D4D4D4",
        "editor.lineHighlightBackground": "#2F3337",
        "editor.selectionBackground": "#264F78",
      },
    });

    // Thème clair personnalisé
    monaco.editor.defineTheme("codeeditor-light", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "comment", foreground: "008000" },
        { token: "keyword", foreground: "0000FF" },
        { token: "string", foreground: "A31515" },
        { token: "number", foreground: "098658" },
        { token: "function", foreground: "795E26" },
        { token: "variable", foreground: "001080" },
      ],
      colors: {
        "editor.background": "#FFFFFF",
        "editor.foreground": "#000000",
        "editor.lineHighlightBackground": "#F5F5F5",
        "editor.selectionBackground": "#ADD6FF",
      },
    });
  }

  /**
   * Configure les raccourcis clavier
   */
  setupKeyboardShortcuts() {
    if (!this.editor) return;

    // Annuler/Refaire
    this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyZ, () => {
      this.undo();
    });

    this.editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyZ,
      () => {
        this.redo();
      }
    );

    // Formater le code
    this.editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyF, () => {
      this.formatCode();
    });

    // Rechercher
    this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
      this.editor.getAction("actions.find").run();
    });

    // Remplacer
    this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyH, () => {
      this.editor.getAction("editor.action.startFindReplaceAction").run();
    });
  }

  /**
   * Change le langage de l'éditeur
   * @param {string} language - Langage à définir
   */
  setLanguage(language) {
    if (!this.editor) return;

    this.language = language;
    monaco.editor.setModelLanguage(this.editor.getModel(), language);

    // Mettre à jour les suggestions et snippets pour le nouveau langage
    this.updateSuggestions();
  }

  /**
   * Change le thème de l'éditeur
   * @param {string} theme - Thème à définir
   */
  setTheme(theme) {
    if (!this.editor) return;

    this.theme = theme;
    monaco.editor.setTheme(theme);
  }

  /**
   * Met à jour les suggestions pour le langage actuel
   */
  updateSuggestions() {
    // Suggestions JavaScript
    if (this.language === "javascript") {
      this.suggestions = [
        {
          label: "console.log",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "console.log(${1:message})",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "Afficher un message dans la console",
        },
        {
          label: "setTimeout",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "setTimeout(() => {\n\t${1}\n}, ${2:delay})",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "Exécuter une fonction après un délai",
        },
      ];
    }

    // Suggestions HTML
    else if (this.language === "html") {
      this.suggestions = [
        {
          label: "div",
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: '<div class="${1:class}">${2}</div>',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "Créer un élément div",
        },
      ];
    }

    // Suggestions CSS
    else if (this.language === "css") {
      this.suggestions = [
        {
          label: "color",
          kind: monaco.languages.CompletionItemKind.Property,
          insertText: "color: ${1:#000000};",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "Définir la couleur du texte",
        },
      ];
    }
  }

  /**
   * Formate le code actuel
   */
  formatCode() {
    if (!this.editor) return;

    const formatter = this.formatters.get(this.language);
    if (formatter) {
      const code = this.editor.getValue();
      const formattedCode = formatter.format(code);
      this.editor.setValue(formattedCode);
    }
  }

  /**
   * Annule la dernière modification
   */
  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.editor.setValue(this.history[this.historyIndex]);
    }
  }

  /**
   * Refait la dernière modification annulée
   */
  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.editor.setValue(this.history[this.historyIndex]);
    }
  }

  /**
   * Ajoute un diagnostic (erreur, avertissement, etc.)
   * @param {Object} diagnostic - Diagnostic à ajouter
   */
  addDiagnostic(diagnostic) {
    this.diagnostics.push(diagnostic);
    monaco.languages.emitDiagnostics({
      uri: this.editor.getModel().uri,
      diagnostics: this.diagnostics,
    });
  }

  /**
   * Efface tous les diagnostics
   */
  clearDiagnostics() {
    this.diagnostics = [];
    monaco.languages.emitDiagnostics({
      uri: this.editor.getModel().uri,
      diagnostics: [],
    });
  }

  /**
   * Ajoute un snippet personnalisé
   * @param {string} language - Langage du snippet
   * @param {Object} snippet - Snippet à ajouter
   */
  addSnippet(language, snippet) {
    if (!this.snippets.has(language)) {
      this.snippets.set(language, []);
    }

    this.snippets.get(language).push(snippet);
  }
}

export const advancedEditor = new AdvancedEditor();
