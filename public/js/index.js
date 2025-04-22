// Importations
import { marked } from "marked";
import * as monaco from "monaco-editor";
import sanitizeHtml from "sanitize-html";
import { ContextMenu } from "../utils/ContextMenu";
import { FileManager } from "../utils/FileManager";
import { SearchManager } from "../utils/SearchManager";
import { SnippetManager } from "../utils/SnippetManager";
import { TabManager } from "../utils/TabManager";
import { ThemeManager } from "../utils/ThemeManager";

// Configuration de marked pour la sécurité
marked.setOptions({
  headerIds: false,
  mangle: false,
});

// Configuration de l'API
const API_URL = process.env.API_URL || "http://localhost:3000";

// Initialisation des gestionnaires
const themeManager = new ThemeManager();
const fileManager = new FileManager();
const tabManager = new TabManager();
const searchManager = new SearchManager();
const snippetManager = new SnippetManager();
const contextMenu = new ContextMenu();

// Fonction pour prévisualiser le Markdown
function previewMarkdown(code) {
  const html = marked(code);
  return sanitizeHtml(html, {
    allowedTags: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "a",
      "ul",
      "ol",
      "li",
      "code",
      "pre",
      "strong",
      "em",
      "blockquote",
    ],
    allowedAttributes: {
      a: ["href", "target"],
    },
  });
}

// Initialisation de l'éditeur
let editor;

window.addEventListener("load", async () => {
  // Initialisation de Monaco Editor
  editor = monaco.editor.create(document.getElementById("editor"), {
    value: "",
    language: "javascript",
    theme: "vs-light",
    automaticLayout: true,
    minimap: {
      enabled: true,
    },
    scrollBeyondLastLine: false,
    fontSize: 14,
    lineNumbers: "on",
    renderLineHighlight: "all",
    roundedSelection: false,
    selectOnLineNumbers: true,
    wordWrap: "on",
  });

  // Gestion de l'exécution du code
  const runButton = document.getElementById("run-button");
  runButton.addEventListener("click", async () => {
    const code = editor.getValue();
    const language = fileManager.currentFile?.language || "javascript";

    runButton.disabled = true;
    runButton.textContent = "Exécution...";

    try {
      const response = await fetch(`${API_URL}/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, language }),
      });

      const result = await response.json();

      if (result.error) {
        alert(`Erreur: ${result.error}`);
      } else {
        alert(`Résultat: ${result.output}`);
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      runButton.disabled = false;
      runButton.textContent = "Exécuter";
    }
  });

  // Gestion du thème
  const toggleTheme = document.getElementById("toggle-theme");
  toggleTheme.addEventListener("change", function () {
    const isDark = this.checked;
    themeManager.changeTheme(isDark ? "dark" : "light");
    monaco.editor.setTheme(isDark ? "vs-dark" : "vs-light");
  });

  // Initialisation de Telegram WebApp
  if (window.Telegram && window.Telegram.WebApp) {
    const webapp = window.Telegram.WebApp;
    webapp.ready();

    webapp.MainButton.setText("Envoyer au Bot");
    webapp.MainButton.onClick(() => {
      if (fileManager.currentFile) {
        const code = editor.getValue();
        webapp.sendData(
          JSON.stringify({
            filename: fileManager.currentFile.name,
            code,
            language: fileManager.currentFile.language,
          })
        );
      }
    });
  }

  // Commandes de l'éditeur
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
    searchManager.openSearch();
  });

  editor.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF,
    () => {
      searchManager.openReplace();
    }
  );

  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyG, () => {
    const line = prompt("Aller à la ligne:");
    if (line) {
      searchManager.goToLine(parseInt(line));
    }
  });

  editor.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyS,
    () => {
      snippetManager.createFromSelection(editor);
    }
  );
});

// Gestionnaire de fichiers
async function createFile(name, content = "") {
  try {
    const file = await fileManager.createFile(name, content);
    tabManager.createTab(file);
    openFile(file.path);
  } catch (error) {
    console.error("Erreur lors de la création du fichier:", error);
  }
}

async function openFile(path) {
  try {
    const file = await fileManager.openFile(path);
    editor.setValue(file.content);
    monaco.editor.setModelLanguage(editor.getModel(), file.language);
    tabManager.markSaved(path);
  } catch (error) {
    console.error("Erreur lors de l'ouverture du fichier:", error);
  }
}

async function saveFile() {
  if (!fileManager.currentFile) return;

  try {
    const content = editor.getValue();
    await fileManager.saveFile(fileManager.currentFile.path, content);
    tabManager.markSaved(fileManager.currentFile.path);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde:", error);
  }
}

function closeFile(path) {
  fileManager.closeFile(path);
  if (!fileManager.currentFile) {
    editor.setValue("");
  }
}

// Configuration du menu contextuel
contextMenu.setCallbacks({
  onRename: async (file) => {
    const newName = prompt("Nouveau nom:", file.name);
    if (newName && newName !== file.name) {
      try {
        await fileManager.renameFile(file.path, newName);
        tabManager.updateTabTitle(file.path, newName);
      } catch (error) {
        console.error("Erreur lors du renommage:", error);
      }
    }
  },
  onDelete: async (file) => {
    if (confirm(`Supprimer ${file.name} ?`)) {
      try {
        await fileManager.deleteFile(file.path);
        tabManager.closeTab(file.path);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  },
  onNewFile: async (path) => {
    const name = prompt("Nom du fichier:");
    if (name) {
      await createFile(name);
    }
  },
  onNewFolder: async (path) => {
    const name = prompt("Nom du dossier:");
    if (name) {
      try {
        await fileManager.createFolder(path + name);
      } catch (error) {
        console.error("Erreur lors de la création du dossier:", error);
      }
    }
  },
});
