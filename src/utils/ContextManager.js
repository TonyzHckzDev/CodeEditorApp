export class ContextManager {
  constructor() {
    this.contextMenu = null;
    this.init();
  }

  init() {
    document.addEventListener("contextmenu", this.handleContextMenu.bind(this));
    document.addEventListener("click", this.hideContextMenu.bind(this));
  }

  createContextMenu() {
    if (!this.contextMenu) {
      this.contextMenu = document.createElement("div");
      this.contextMenu.className = "context-menu hidden";
      document.body.appendChild(this.contextMenu);
    }
    return this.contextMenu;
  }

  handleContextMenu(event) {
    event.preventDefault();
    const menu = this.createContextMenu();

    // Position du menu
    const x = event.clientX;
    const y = event.clientY;

    // Ajuster la position si le menu dépasse la fenêtre
    const menuWidth = 200; // Largeur par défaut
    const menuHeight = 150; // Hauteur par défaut

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const adjustedX = x + menuWidth > windowWidth ? windowWidth - menuWidth : x;
    const adjustedY =
      y + menuHeight > windowHeight ? windowHeight - menuHeight : y;

    menu.style.left = `${adjustedX}px`;
    menu.style.top = `${adjustedY}px`;

    // Afficher le menu
    menu.classList.remove("hidden");
  }

  hideContextMenu() {
    if (this.contextMenu) {
      this.contextMenu.classList.add("hidden");
    }
  }

  addMenuItem(label, callback) {
    const menu = this.createContextMenu();
    const item = document.createElement("div");
    item.className = "context-menu-item";
    item.textContent = label;
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      callback();
      this.hideContextMenu();
    });
    menu.appendChild(item);
  }

  clearMenuItems() {
    if (this.contextMenu) {
      this.contextMenu.innerHTML = "";
    }
  }
}
