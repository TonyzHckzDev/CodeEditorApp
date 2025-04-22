export class ContextMenu {
  constructor() {
    this.menu = null;
    this.items = [];
    this.visible = false;

    // Fermer le menu au clic en dehors
    document.addEventListener("click", () => this.hide());
  }

  // Ajouter un élément au menu
  addItem(label, icon, action) {
    this.items.push({ label, icon, action });
  }

  // Afficher le menu
  show(x, y, items = this.items) {
    this.hide();

    this.menu = document.createElement("div");
    this.menu.className = "context-menu";
    this.menu.style.left = `${x}px`;
    this.menu.style.top = `${y}px`;

    items.forEach((item) => {
      const menuItem = document.createElement("div");
      menuItem.className = "context-menu-item";

      if (item.icon) {
        const icon = document.createElement("i");
        icon.className = `fas fa-${item.icon}`;
        menuItem.appendChild(icon);
      }

      const label = document.createElement("span");
      label.textContent = item.label;
      menuItem.appendChild(label);

      menuItem.addEventListener("click", (e) => {
        e.stopPropagation();
        item.action();
        this.hide();
      });

      this.menu.appendChild(menuItem);
    });

    document.body.appendChild(this.menu);
    this.visible = true;

    // Ajuster la position si le menu dépasse de l'écran
    const rect = this.menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (rect.right > viewportWidth) {
      this.menu.style.left = `${x - rect.width}px`;
    }
    if (rect.bottom > viewportHeight) {
      this.menu.style.top = `${y - rect.height}px`;
    }
  }

  // Cacher le menu
  hide() {
    if (this.menu && this.visible) {
      document.body.removeChild(this.menu);
      this.menu = null;
      this.visible = false;
    }
  }

  // Menu contextuel pour les fichiers
  showFileMenu(x, y, file) {
    const items = [
      {
        label: "Renommer",
        icon: "pencil",
        action: () => this.onRename?.(file),
      },
      {
        label: "Supprimer",
        icon: "trash",
        action: () => this.onDelete?.(file),
      },
      {
        label: "Copier",
        icon: "copy",
        action: () => this.onCopy?.(file),
      },
      {
        label: "Couper",
        icon: "cut",
        action: () => this.onCut?.(file),
      },
    ];

    this.show(x, y, items);
  }

  // Menu contextuel pour le dossier
  showFolderMenu(x, y, path) {
    const items = [
      {
        label: "Nouveau fichier",
        icon: "file",
        action: () => this.onNewFile?.(path),
      },
      {
        label: "Nouveau dossier",
        icon: "folder-plus",
        action: () => this.onNewFolder?.(path),
      },
      {
        label: "Coller",
        icon: "paste",
        action: () => this.onPaste?.(path),
      },
    ];

    this.show(x, y, items);
  }

  // Menu contextuel pour l'éditeur
  showEditorMenu(x, y, editor) {
    const items = [
      {
        label: "Copier",
        icon: "copy",
        action: () =>
          editor.getAction("editor.action.clipboardCopyAction").run(),
      },
      {
        label: "Couper",
        icon: "cut",
        action: () =>
          editor.getAction("editor.action.clipboardCutAction").run(),
      },
      {
        label: "Coller",
        icon: "paste",
        action: () =>
          editor.getAction("editor.action.clipboardPasteAction").run(),
      },
      {
        label: "Sélectionner tout",
        icon: "object-group",
        action: () => editor.getAction("editor.action.selectAll").run(),
      },
      {
        label: "Rechercher",
        icon: "search",
        action: () => editor.getAction("actions.find").run(),
      },
      {
        label: "Remplacer",
        icon: "exchange-alt",
        action: () =>
          editor.getAction("editor.action.startFindReplaceAction").run(),
      },
    ];

    this.show(x, y, items);
  }

  // Définir les callbacks
  setCallbacks({
    onRename,
    onDelete,
    onCopy,
    onCut,
    onNewFile,
    onNewFolder,
    onPaste,
  }) {
    this.onRename = onRename;
    this.onDelete = onDelete;
    this.onCopy = onCopy;
    this.onCut = onCut;
    this.onNewFile = onNewFile;
    this.onNewFolder = onNewFolder;
    this.onPaste = onPaste;
  }
}
