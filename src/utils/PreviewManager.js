class PreviewManager {
  constructor() {
    this.previewFrame = null;
    this.currentFileType = null;
    this.initialize();
  }

  initialize() {
    // Créer l'iframe de prévisualisation
    this.previewFrame = document.createElement("iframe");
    this.previewFrame.id = "preview-frame";
    this.previewFrame.sandbox = "allow-same-origin allow-scripts";
    this.previewFrame.style.width = "100%";
    this.previewFrame.style.height = "100%";
    this.previewFrame.style.border = "none";
  }

  setFileType(fileType) {
    this.currentFileType = fileType.toLowerCase();
  }

  async updatePreview(content) {
    try {
      switch (this.currentFileType) {
        case "html":
          this.updateHtmlPreview(content);
          break;
        case "css":
          this.updateCssPreview(content);
          break;
        case "markdown":
        case "md":
          await this.updateMarkdownPreview(content);
          break;
        default:
          throw new Error(
            "Type de fichier non pris en charge pour la prévisualisation"
          );
      }
    } catch (error) {
      this.showError(error.message);
    }
  }

  updateHtmlPreview(content) {
    const frameDoc = this.previewFrame.contentDocument;
    frameDoc.open();
    frameDoc.write(content);
    frameDoc.close();
  }

  updateCssPreview(content) {
    const frameDoc = this.previewFrame.contentDocument;
    let styleTag = frameDoc.getElementById("preview-style");

    if (!styleTag) {
      styleTag = frameDoc.createElement("style");
      styleTag.id = "preview-style";
      frameDoc.head.appendChild(styleTag);
    }

    styleTag.textContent = content;
  }

  async updateMarkdownPreview(content) {
    try {
      const response = await fetch("/api/preview/markdown", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la conversion du Markdown");
      }

      const { html } = await response.json();
      this.updateHtmlPreview(html);
    } catch (error) {
      throw new Error(
        "Erreur lors de la prévisualisation du Markdown: " + error.message
      );
    }
  }

  showError(message) {
    const errorHtml = `
      <div style="padding: 20px; color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px;">
        <h3>Erreur de prévisualisation</h3>
        <p>${message}</p>
      </div>
    `;
    this.updateHtmlPreview(errorHtml);
  }

  attachTo(container) {
    container.appendChild(this.previewFrame);
  }

  detach() {
    if (this.previewFrame && this.previewFrame.parentNode) {
      this.previewFrame.parentNode.removeChild(this.previewFrame);
    }
  }
}

export default PreviewManager;
