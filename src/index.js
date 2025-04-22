// CodeEditor Mini-App Telegram - Script principal
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { ThemeSelector } from "./components/ThemeSelector.js";
import { ContextMenu } from "./features/contextMenu.js";
import { FileManager } from "./features/fileManager.js";
import { SearchManager } from "./features/searchManager.js";
import { SnippetManager } from "./features/snippetManager.js";
import { TabManager } from "./features/tabManager.js";
import { ThemeManager } from "./features/themes/theme-manager.js";

// Initialisation du gestionnaire de thèmes
const themeManager = new ThemeManager();

// Configuration de marked pour la sécurité
marked.setOptions({
  headerIds: false,
  mangle: false,
});

// Fonction de prévisualisation Markdown
function previewMarkdown(code) {
  const rawHtml = marked(code);
  const sanitizedHtml = sanitizeHtml(rawHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "title"],
    },
  });
  return sanitizedHtml;
}

// Initialisation du sélecteur de thèmes
const themeContainer = document.createElement("div");
document.body.insertBefore(themeContainer, document.body.firstChild);
const themeSelector = new ThemeSelector(themeContainer);

// Initialisation des gestionnaires
const fileManager = new FileManager();
const tabManager = new TabManager(
  document.getElementById("editor-container"),
  (path) => openFile(path),
  (path) => closeFile(path)
);
const contextMenu = new ContextMenu();
let searchManager = null;
const snippetManager = new SnippetManager();

let editor = null;

// Fonction pour obtenir l'adresse IP locale
async function getLocalIP() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'IP:", error);
    return "localhost";
  }
}

// Initialisation de l'application
async function initApp() {
  const localIP = await getLocalIP();
  const API_URL = `http://${localIP}:3001`;

  // Initialisation de Monaco Editor
  require.config({
    paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/min/vs" },
  });
  require(["vs/editor/editor.main"], function () {
    // Création de l'éditeur
    editor = monaco.editor.create(document.getElementById("editor-container"), {
      value: "",
      language: "javascript",
      theme: "vs-dark",
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 14,
      lineNumbers: "on",
      roundedSelection: false,
      scrollBeyondLastLine: false,
      readOnly: false,
      cursorStyle: "line",
      tabSize: 2,
      wordWrap: "on",
      quickSuggestions: true,
      snippetSuggestions: "inline",
      scrollbar: {
        useShadows: false,
        verticalHasArrows: true,
        horizontalHasArrows: true,
        vertical: "visible",
        horizontal: "visible",
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10,
      },
    });

    // Initialiser le gestionnaire de recherche
    searchManager = new SearchManager(editor);
    searchManager.initialize();

    // Charger l'état précédent
    fileManager.loadFromStorage();
    restoreEditorState();

    // Événements de l'éditeur
    editor.onDidChangeModelContent(() => {
      if (fileManager.currentFile) {
        tabManager.markUnsaved(fileManager.currentFile.path);
      }
    });

    // Gestion des changements de langage
    const languageSelect = document.getElementById("language-select");
    languageSelect.addEventListener("change", function () {
      const language = this.value;
      monaco.editor.setModelLanguage(editor.getModel(), language);

      // Activer/désactiver la prévisualisation Markdown
      if (language === "markdown") {
        const previewContainer = document.createElement("div");
        previewContainer.id = "markdown-preview";
        previewContainer.className = "markdown-preview";
        document
          .getElementById("editor-container")
          .parentNode.appendChild(previewContainer);

        // Mettre à jour la prévisualisation en temps réel
        editor.onDidChangeModelContent(() => {
          const code = editor.getValue();
          previewContainer.innerHTML = previewMarkdown(code);
        });

        // Prévisualisation initiale
        previewContainer.innerHTML = previewMarkdown(editor.getValue());
      } else {
        const previewContainer = document.getElementById("markdown-preview");
        if (previewContainer) {
          previewContainer.remove();
        }
      }
    });

    // Gestion du bouton d'exécution
    const runButton = document.getElementById("btn-run");
    runButton.addEventListener("click", async function () {
      const code = editor.getValue();
      const language = languageSelect.value;

      // Afficher un indicateur de chargement
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

        // Afficher le résultat
        if (result.error) {
          alert(`Erreur: ${result.error}`);
        } else {
          alert(`Résultat: ${result.output}`);
        }
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        // Réactiver le bouton
        runButton.disabled = false;
        runButton.textContent = "Exécuter";
      }
    });

    // Gestion de la navigation
    const pages = ["home", "editor", "snippets", "settings"];
    const buttons = pages.map((page) => document.getElementById(`btn-${page}`));

    // Afficher la page d'accueil par défaut
    document.getElementById("page-home").classList.remove("hidden");
    buttons[0].classList.add("active");

    buttons.forEach((button, index) => {
      button.addEventListener("click", () => {
        // Masquer toutes les pages
        pages.forEach((page) =>
          document.getElementById(`page-${page}`).classList.add("hidden")
        );
        // Afficher la page sélectionnée
        document
          .getElementById(`page-${pages[index]}`)
          .classList.remove("hidden");
        // Mettre à jour les boutons actifs
        buttons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
      });
    });

    // Gestion du thème sombre
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

      // Configurer le bouton retour
      webapp.BackButton.onClick(() => {
        // Retour à la page précédente
        const currentPage = pages.find(
          (page) =>
            !document
              .getElementById(`page-${page}`)
              .classList.contains("hidden")
        );
        const currentIndex = pages.indexOf(currentPage);
        if (currentIndex > 0) {
          buttons[currentIndex - 1].click();
        }
      });
    }

    // Ajouter les commandes personnalisées
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

    // Ajouter le support des snippets
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyS,
      () => {
        snippetManager.createFromSelection(editor);
      }
    );
  });
}

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

// Restaurer l'état de l'éditeur
function restoreEditorState() {
  fileManager.openFiles.forEach((file) => {
    tabManager.createTab(file);
  });

  if (fileManager.currentFile) {
    openFile(fileManager.currentFile.path);
  }
}

// Raccourcis clavier
document.addEventListener("keydown", async (e) => {
  // Ctrl/Cmd + S pour sauvegarder
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault();
    await saveFile();
  }

  // Ctrl/Cmd + N pour nouveau fichier
  if ((e.ctrlKey || e.metaKey) && e.key === "n") {
    e.preventDefault();
    const name = prompt("Nom du fichier:");
    if (name) {
      await createFile(name);
    }
  }
});

// Événements de la barre d'outils
document.querySelectorAll(".toolbar-button").forEach((button) => {
  button.addEventListener("click", async (e) => {
    const action = button.getAttribute("data-action");
    switch (action) {
      case "new":
        const name = prompt("Nom du fichier:");
        if (name) await createFile(name);
        break;
      case "save":
        await saveFile();
        break;
      case "undo":
        editor?.trigger("keyboard", "undo");
        break;
      case "redo":
        editor?.trigger("keyboard", "redo");
        break;
      case "search":
        searchManager?.openSearch();
        break;
      case "replace":
        searchManager?.openReplace();
        break;
      case "snippet":
        const snippets = snippetManager.getAllSnippets();
        if (snippets.length > 0) {
          const snippet = snippets[0]; // À remplacer par une UI de sélection
          snippetManager.insertSnippet(editor, snippet.id);
        }
        break;
    }
  });
});

// Démarrer l'application
initApp();
