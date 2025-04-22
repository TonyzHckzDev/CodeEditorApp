export class FileManager {
  constructor() {
    this.currentFile = null;
    this.files = new Map();
    this.openFiles = [];
    this.currentDirectory = "/";
  }

  // Créer un nouveau fichier
  async createFile(name, content = "") {
    try {
      const file = {
        name,
        content,
        path: `${this.currentDirectory}${name}`,
        language: this.detectLanguage(name),
        lastModified: Date.now(),
      };

      this.files.set(file.path, file);
      this.openFiles.push(file);
      this.currentFile = file;

      return file;
    } catch (error) {
      console.error("Erreur lors de la création du fichier:", error);
      throw error;
    }
  }

  // Ouvrir un fichier
  async openFile(path) {
    try {
      const file = this.files.get(path);
      if (!file) throw new Error("Fichier non trouvé");

      if (!this.openFiles.includes(file)) {
        this.openFiles.push(file);
      }

      this.currentFile = file;
      return file;
    } catch (error) {
      console.error("Erreur lors de l'ouverture du fichier:", error);
      throw error;
    }
  }

  // Sauvegarder un fichier
  async saveFile(path, content) {
    try {
      const file = this.files.get(path);
      if (!file) throw new Error("Fichier non trouvé");

      file.content = content;
      file.lastModified = Date.now();

      // Sauvegarder dans le localStorage
      this.saveToStorage();

      return file;
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du fichier:", error);
      throw error;
    }
  }

  // Fermer un fichier
  closeFile(path) {
    const index = this.openFiles.findIndex((f) => f.path === path);
    if (index !== -1) {
      this.openFiles.splice(index, 1);
      if (this.currentFile?.path === path) {
        this.currentFile = this.openFiles[this.openFiles.length - 1] || null;
      }
    }
  }

  // Détecter le langage en fonction de l'extension
  detectLanguage(filename) {
    const ext = filename.split(".").pop().toLowerCase();
    const languageMap = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      html: "html",
      css: "css",
      json: "json",
      md: "markdown",
      py: "python",
      java: "java",
      c: "c",
      cpp: "cpp",
      php: "php",
      rb: "ruby",
      go: "go",
      rs: "rust",
      swift: "swift",
      kt: "kotlin",
    };
    return languageMap[ext] || "plaintext";
  }

  // Sauvegarder l'état dans le localStorage
  saveToStorage() {
    const state = {
      files: Array.from(this.files.entries()),
      openFiles: this.openFiles.map((f) => f.path),
      currentFile: this.currentFile?.path,
      currentDirectory: this.currentDirectory,
    };
    localStorage.setItem("fileManager", JSON.stringify(state));
  }

  // Charger l'état depuis le localStorage
  loadFromStorage() {
    try {
      const state = JSON.parse(localStorage.getItem("fileManager"));
      if (state) {
        this.files = new Map(state.files);
        this.currentDirectory = state.currentDirectory;

        // Restaurer les fichiers ouverts
        this.openFiles = state.openFiles
          .map((path) => this.files.get(path))
          .filter(Boolean);

        // Restaurer le fichier courant
        this.currentFile = state.currentFile
          ? this.files.get(state.currentFile)
          : null;
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'état:", error);
    }
  }
}
