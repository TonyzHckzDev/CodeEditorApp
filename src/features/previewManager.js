export class PreviewManager {
  constructor() {
    this.previewFrame = null;
    this.currentFile = null;
    this.isLive = false;
    this.updateDelay = 1000; // Délai de mise à jour en ms
    this.updateTimeout = null;
  }

  // Initialiser le gestionnaire d'aperçu
  initialize(containerId) {
    const container = document.getElementById(containerId);
    if (!container) throw new Error("Conteneur d'aperçu non trouvé");

    this.previewFrame = document.createElement("iframe");
    this.previewFrame.className = "preview-frame";
    this.previewFrame.sandbox = "allow-same-origin allow-scripts allow-forms";
    container.appendChild(this.previewFrame);
  }

  // Mettre à jour l'aperçu avec le contenu
  async updatePreview(content, fileType) {
    if (!this.previewFrame) throw new Error("Aperçu non initialisé");

    try {
      switch (fileType) {
        case "html":
          this.updateHTML(content);
          break;
        case "markdown":
          await this.updateMarkdown(content);
          break;
        case "css":
          this.updateCSS(content);
          break;
        default:
          throw new Error("Type de fichier non supporté pour l'aperçu");
      }
    } catch (error) {
      console.error("Erreur de mise à jour de l'aperçu:", error);
      throw error;
    }
  }

  // Mettre à jour l'aperçu HTML
  updateHTML(content) {
    const doc = this.previewFrame.contentDocument;
    doc.open();
    doc.write(content);
    doc.close();
  }

  // Mettre à jour l'aperçu Markdown
  async updateMarkdown(content) {
    try {
      const response = await fetch("/api/preview/markdown", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error("Erreur de conversion Markdown");

      const html = await response.text();
      this.updateHTML(html);
    } catch (error) {
      console.error("Erreur de conversion Markdown:", error);
      throw error;
    }
  }

  // Mettre à jour l'aperçu CSS
  updateCSS(content) {
    const doc = this.previewFrame.contentDocument;
    let styleElement = doc.getElementById("preview-style");

    if (!styleElement) {
      styleElement = doc.createElement("style");
      styleElement.id = "preview-style";
      doc.head.appendChild(styleElement);
    }

    styleElement.textContent = content;
  }

  // Activer l'aperçu en direct
  enableLivePreview(file, onChange) {
    this.isLive = true;
    this.currentFile = file;

    if (onChange) {
      this.onChangeCallback = (content) => {
        if (this.updateTimeout) {
          clearTimeout(this.updateTimeout);
        }

        this.updateTimeout = setTimeout(() => {
          this.updatePreview(content, this.getFileType(file));
        }, this.updateDelay);
      };
    }
  }

  // Désactiver l'aperçu en direct
  disableLivePreview() {
    this.isLive = false;
    this.currentFile = null;
    this.onChangeCallback = null;
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
      this.updateTimeout = null;
    }
  }

  // Obtenir le type de fichier
  getFileType(filename) {
    const ext = filename.split(".").pop().toLowerCase();
    switch (ext) {
      case "html":
      case "htm":
        return "html";
      case "md":
      case "markdown":
        return "markdown";
      case "css":
        return "css";
      default:
        return null;
    }
  }

  // Définir le délai de mise à jour
  setUpdateDelay(delay) {
    this.updateDelay = delay;
  }

  // Nettoyer l'aperçu
  destroy() {
    this.disableLivePreview();
    if (this.previewFrame && this.previewFrame.parentNode) {
      this.previewFrame.parentNode.removeChild(this.previewFrame);
    }
    this.previewFrame = null;
  }
}
