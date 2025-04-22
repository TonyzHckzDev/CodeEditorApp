export class TabManager {
  constructor(containerElement, onTabChange, onTabClose) {
    this.container = containerElement;
    this.tabsContainer = document.createElement("div");
    this.tabsContainer.className = "tabs-container";
    this.container.appendChild(this.tabsContainer);

    this.tabs = new Map();
    this.activeTab = null;
    this.onTabChange = onTabChange;
    this.onTabClose = onTabClose;
  }

  // Créer un nouvel onglet
  createTab(file) {
    if (this.tabs.has(file.path)) {
      this.activateTab(file.path);
      return;
    }

    const tab = document.createElement("div");
    tab.className = "tab";
    tab.dataset.path = file.path;

    const title = document.createElement("span");
    title.className = "tab-title";
    title.textContent = file.name;

    const closeBtn = document.createElement("button");
    closeBtn.className = "tab-close";
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.title = "Fermer";

    tab.appendChild(title);
    tab.appendChild(closeBtn);

    // Événements
    tab.addEventListener("click", () => this.activateTab(file.path));
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.closeTab(file.path);
    });

    this.tabsContainer.appendChild(tab);
    this.tabs.set(file.path, tab);
    this.activateTab(file.path);
  }

  // Activer un onglet
  activateTab(path) {
    if (this.activeTab) {
      this.tabs.get(this.activeTab).classList.remove("active");
    }

    const tab = this.tabs.get(path);
    if (tab) {
      tab.classList.add("active");
      this.activeTab = path;
      this.onTabChange?.(path);
    }
  }

  // Fermer un onglet
  closeTab(path) {
    const tab = this.tabs.get(path);
    if (tab) {
      tab.remove();
      this.tabs.delete(path);
      this.onTabClose?.(path);

      // Activer l'onglet suivant
      if (path === this.activeTab) {
        const remainingTabs = Array.from(this.tabs.keys());
        if (remainingTabs.length > 0) {
          this.activateTab(remainingTabs[remainingTabs.length - 1]);
        } else {
          this.activeTab = null;
        }
      }
    }
  }

  // Mettre à jour le titre d'un onglet
  updateTabTitle(path, newTitle) {
    const tab = this.tabs.get(path);
    if (tab) {
      const title = tab.querySelector(".tab-title");
      title.textContent = newTitle;
    }
  }

  // Indiquer qu'un fichier n'est pas sauvegardé
  markUnsaved(path) {
    const tab = this.tabs.get(path);
    if (tab) {
      const title = tab.querySelector(".tab-title");
      if (!title.textContent.endsWith("*")) {
        title.textContent += "*";
      }
    }
  }

  // Indiquer qu'un fichier est sauvegardé
  markSaved(path) {
    const tab = this.tabs.get(path);
    if (tab) {
      const title = tab.querySelector(".tab-title");
      title.textContent = title.textContent.replace("*", "");
    }
  }
}
