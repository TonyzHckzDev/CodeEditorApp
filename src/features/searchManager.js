export class SearchManager {
  constructor(editor) {
    this.editor = editor;
    this.searchWidget = null;
    this.replaceWidget = null;
    this.findController = null;
  }

  // Initialiser la recherche
  initialize() {
    this.findController = this.editor.getContribution(
      "editor.contrib.findController"
    );
  }

  // Ouvrir la recherche
  openSearch() {
    this.findController?.start({
      forceRevealReplace: false,
      seedSearchStringFromSelection: true,
      shouldFocus: true,
      shouldAnimate: true,
    });
  }

  // Ouvrir la recherche avec remplacement
  openReplace() {
    this.findController?.start({
      forceRevealReplace: true,
      seedSearchStringFromSelection: true,
      shouldFocus: true,
      shouldAnimate: true,
    });
  }

  // Rechercher le suivant
  findNext() {
    this.findController?.moveToNextMatch();
  }

  // Rechercher le précédent
  findPrevious() {
    this.findController?.moveToPreviousMatch();
  }

  // Remplacer la sélection actuelle
  replace() {
    this.findController?.replace();
  }

  // Remplacer tout
  replaceAll() {
    this.findController?.replaceAll();
  }

  // Rechercher dans tous les fichiers
  async searchInFiles(query, files) {
    const results = new Map();

    for (const file of files) {
      const matches = [];
      const lines = file.content.split("\n");

      lines.forEach((line, index) => {
        if (line.toLowerCase().includes(query.toLowerCase())) {
          matches.push({
            line: index + 1,
            content: line,
            preview: this.getLinePreview(lines, index),
          });
        }
      });

      if (matches.length > 0) {
        results.set(file.path, matches);
      }
    }

    return results;
  }

  // Obtenir un aperçu du contexte autour d'une ligne
  getLinePreview(lines, lineIndex, context = 2) {
    const start = Math.max(0, lineIndex - context);
    const end = Math.min(lines.length, lineIndex + context + 1);
    return lines.slice(start, end);
  }

  // Aller à la ligne
  goToLine(lineNumber) {
    this.editor.revealLineInCenter(lineNumber);
    this.editor.setPosition({ lineNumber, column: 1 });
  }

  // Rechercher et remplacer avec expressions régulières
  async searchWithRegex(regex, replacement, content) {
    try {
      const re = new RegExp(regex, "g");
      return content.replace(re, replacement);
    } catch (error) {
      console.error("Erreur d'expression régulière:", error);
      throw error;
    }
  }
}
