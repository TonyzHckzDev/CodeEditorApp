export class SnippetManager {
  constructor() {
    this.snippets = new Map();
    this.loadSnippets();
  }

  // Ajouter un nouveau snippet
  addSnippet(name, content, language) {
    const snippet = {
      id: Date.now().toString(),
      name,
      content,
      language,
      created: Date.now(),
      lastModified: Date.now(),
    };

    this.snippets.set(snippet.id, snippet);
    this.saveSnippets();
    return snippet;
  }

  // Obtenir un snippet
  getSnippet(id) {
    return this.snippets.get(id);
  }

  // Mettre à jour un snippet
  updateSnippet(id, updates) {
    const snippet = this.snippets.get(id);
    if (snippet) {
      Object.assign(snippet, updates, { lastModified: Date.now() });
      this.saveSnippets();
      return snippet;
    }
    return null;
  }

  // Supprimer un snippet
  deleteSnippet(id) {
    const result = this.snippets.delete(id);
    if (result) {
      this.saveSnippets();
    }
    return result;
  }

  // Obtenir tous les snippets
  getAllSnippets() {
    return Array.from(this.snippets.values());
  }

  // Obtenir les snippets par langage
  getSnippetsByLanguage(language) {
    return this.getAllSnippets().filter((s) => s.language === language);
  }

  // Rechercher des snippets
  searchSnippets(query) {
    query = query.toLowerCase();
    return this.getAllSnippets().filter(
      (snippet) =>
        snippet.name.toLowerCase().includes(query) ||
        snippet.content.toLowerCase().includes(query)
    );
  }

  // Sauvegarder les snippets dans le localStorage
  saveSnippets() {
    try {
      localStorage.setItem(
        "snippets",
        JSON.stringify(Array.from(this.snippets.entries()))
      );
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des snippets:", error);
    }
  }

  // Charger les snippets depuis le localStorage
  loadSnippets() {
    try {
      const saved = localStorage.getItem("snippets");
      if (saved) {
        this.snippets = new Map(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Erreur lors du chargement des snippets:", error);
    }
  }

  // Exporter les snippets
  exportSnippets() {
    return JSON.stringify(Array.from(this.snippets.values()), null, 2);
  }

  // Importer des snippets
  importSnippets(jsonString) {
    try {
      const imported = JSON.parse(jsonString);
      imported.forEach((snippet) => {
        if (this.validateSnippet(snippet)) {
          this.snippets.set(snippet.id, snippet);
        }
      });
      this.saveSnippets();
      return true;
    } catch (error) {
      console.error("Erreur lors de l'importation des snippets:", error);
      return false;
    }
  }

  // Valider un snippet
  validateSnippet(snippet) {
    return (
      snippet &&
      typeof snippet.id === "string" &&
      typeof snippet.name === "string" &&
      typeof snippet.content === "string" &&
      typeof snippet.language === "string"
    );
  }

  // Créer un snippet à partir de la sélection
  createFromSelection(editor) {
    const selection = editor.getSelection();
    if (selection) {
      const content = editor.getModel().getValueInRange(selection);
      const name = prompt("Nom du snippet:");
      if (name) {
        const language = editor.getModel().getLanguageId();
        return this.addSnippet(name, content, language);
      }
    }
    return null;
  }

  // Insérer un snippet dans l'éditeur
  insertSnippet(editor, snippetId) {
    const snippet = this.getSnippet(snippetId);
    if (snippet) {
      const position = editor.getPosition();
      editor.executeEdits("snippet", [
        {
          range: {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          },
          text: snippet.content,
        },
      ]);
    }
  }
}
