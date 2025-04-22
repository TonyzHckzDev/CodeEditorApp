export class ProjectManager {
  constructor() {
    this.projects = new Map();
    this.currentProject = null;
    this.loadProjects();
  }

  // Créer un nouveau projet
  createProject(name, path, config = {}) {
    const project = {
      id: Date.now().toString(),
      name,
      path,
      config: {
        type: config.type || "web", // web, node, python, etc.
        buildCommand: config.buildCommand || "",
        runCommand: config.runCommand || "",
        livePreview: config.livePreview || false,
        ...config,
      },
      created: Date.now(),
      lastOpened: Date.now(),
    };

    this.projects.set(project.id, project);
    this.saveProjects();
    return project;
  }

  // Ouvrir un projet
  async openProject(id) {
    const project = this.projects.get(id);
    if (!project) throw new Error("Projet non trouvé");

    try {
      // Charger la configuration du projet
      const configFile = `${project.path}/.editorconfig`;
      const response = await fetch("/api/project/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path: configFile }),
      });

      if (response.ok) {
        const config = await response.json();
        project.config = { ...project.config, ...config };
      }

      project.lastOpened = Date.now();
      this.currentProject = project;
      this.saveProjects();

      return project;
    } catch (error) {
      console.error("Erreur d'ouverture du projet:", error);
      throw error;
    }
  }

  // Fermer le projet actuel
  closeProject() {
    this.currentProject = null;
  }

  // Sauvegarder la configuration du projet
  async saveProjectConfig(id, config) {
    const project = this.projects.get(id);
    if (!project) throw new Error("Projet non trouvé");

    try {
      const configFile = `${project.path}/.editorconfig`;
      const response = await fetch("/api/project/saveConfig", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: configFile,
          config,
        }),
      });

      if (!response.ok)
        throw new Error("Erreur de sauvegarde de la configuration");

      project.config = { ...project.config, ...config };
      this.saveProjects();
      return true;
    } catch (error) {
      console.error("Erreur de sauvegarde de la configuration:", error);
      throw error;
    }
  }

  // Exécuter la commande de build
  async buildProject(id) {
    const project = this.projects.get(id);
    if (!project) throw new Error("Projet non trouvé");
    if (!project.config.buildCommand)
      throw new Error("Aucune commande de build définie");

    try {
      const response = await fetch("/api/project/build", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: project.path,
          command: project.config.buildCommand,
        }),
      });

      if (!response.ok) throw new Error("Erreur de build");

      return await response.text();
    } catch (error) {
      console.error("Erreur de build:", error);
      throw error;
    }
  }

  // Exécuter la commande de run
  async runProject(id) {
    const project = this.projects.get(id);
    if (!project) throw new Error("Projet non trouvé");
    if (!project.config.runCommand)
      throw new Error("Aucune commande d'exécution définie");

    try {
      const response = await fetch("/api/project/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: project.path,
          command: project.config.runCommand,
        }),
      });

      if (!response.ok) throw new Error("Erreur d'exécution");

      return await response.text();
    } catch (error) {
      console.error("Erreur d'exécution:", error);
      throw error;
    }
  }

  // Obtenir les dépendances du projet
  async getDependencies(id) {
    const project = this.projects.get(id);
    if (!project) throw new Error("Projet non trouvé");

    try {
      const response = await fetch("/api/project/dependencies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path: project.path }),
      });

      if (!response.ok)
        throw new Error("Erreur de récupération des dépendances");

      return await response.json();
    } catch (error) {
      console.error("Erreur de récupération des dépendances:", error);
      throw error;
    }
  }

  // Sauvegarder les projets dans le localStorage
  saveProjects() {
    try {
      const projects = Array.from(this.projects.entries());
      localStorage.setItem("projects", JSON.stringify(projects));
    } catch (error) {
      console.error("Erreur de sauvegarde des projets:", error);
    }
  }

  // Charger les projets depuis le localStorage
  loadProjects() {
    try {
      const saved = localStorage.getItem("projects");
      if (saved) {
        this.projects = new Map(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Erreur de chargement des projets:", error);
    }
  }
}
