export class FileManager {
  constructor() {
    this.files = new Map();
    this.currentFile = null;
  }

  createFile(name, content = "") {
    const file = {
      name,
      content,
      language: this.detectLanguage(name),
      lastModified: Date.now(),
    };
    this.files.set(name, file);
    return file;
  }

  openFile(name) {
    const file = this.files.get(name);
    if (file) {
      this.currentFile = file;
      return file;
    }
    return null;
  }

  saveFile(name, content) {
    const file = this.files.get(name);
    if (file) {
      file.content = content;
      file.lastModified = Date.now();
      return true;
    }
    return false;
  }

  detectLanguage(filename) {
    const ext = filename.split(".").pop().toLowerCase();
    const languageMap = {
      js: "javascript",
      ts: "typescript",
      py: "python",
      html: "html",
      css: "css",
      json: "json",
      md: "markdown",
    };
    return languageMap[ext] || "plaintext";
  }

  getCurrentFile() {
    return this.currentFile;
  }

  getAllFiles() {
    return Array.from(this.files.values());
  }

  deleteFile(name) {
    if (this.currentFile?.name === name) {
      this.currentFile = null;
    }
    return this.files.delete(name);
  }
}
