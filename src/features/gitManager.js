export class GitManager {
  constructor() {
    this.currentRepo = null;
    this.status = null;
  }

  // Initialiser un dépôt Git
  async initRepo(path) {
    try {
      const response = await fetch("/api/git/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path }),
      });

      if (!response.ok) throw new Error("Erreur d'initialisation Git");

      this.currentRepo = path;
      return true;
    } catch (error) {
      console.error("Erreur d'initialisation Git:", error);
      throw error;
    }
  }

  // Obtenir le statut Git
  async getStatus() {
    if (!this.currentRepo) throw new Error("Aucun dépôt Git");

    try {
      const response = await fetch("/api/git/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path: this.currentRepo }),
      });

      if (!response.ok) throw new Error("Erreur de statut Git");

      this.status = await response.json();
      return this.status;
    } catch (error) {
      console.error("Erreur de statut Git:", error);
      throw error;
    }
  }

  // Ajouter des fichiers
  async add(files) {
    if (!this.currentRepo) throw new Error("Aucun dépôt Git");

    try {
      const response = await fetch("/api/git/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: this.currentRepo,
          files,
        }),
      });

      if (!response.ok) throw new Error("Erreur d'ajout Git");

      return true;
    } catch (error) {
      console.error("Erreur d'ajout Git:", error);
      throw error;
    }
  }

  // Créer un commit
  async commit(message) {
    if (!this.currentRepo) throw new Error("Aucun dépôt Git");

    try {
      const response = await fetch("/api/git/commit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: this.currentRepo,
          message,
        }),
      });

      if (!response.ok) throw new Error("Erreur de commit Git");

      return true;
    } catch (error) {
      console.error("Erreur de commit Git:", error);
      throw error;
    }
  }

  // Push vers le dépôt distant
  async push(remote = "origin", branch = "main") {
    if (!this.currentRepo) throw new Error("Aucun dépôt Git");

    try {
      const response = await fetch("/api/git/push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: this.currentRepo,
          remote,
          branch,
        }),
      });

      if (!response.ok) throw new Error("Erreur de push Git");

      return true;
    } catch (error) {
      console.error("Erreur de push Git:", error);
      throw error;
    }
  }

  // Pull depuis le dépôt distant
  async pull(remote = "origin", branch = "main") {
    if (!this.currentRepo) throw new Error("Aucun dépôt Git");

    try {
      const response = await fetch("/api/git/pull", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: this.currentRepo,
          remote,
          branch,
        }),
      });

      if (!response.ok) throw new Error("Erreur de pull Git");

      return true;
    } catch (error) {
      console.error("Erreur de pull Git:", error);
      throw error;
    }
  }

  // Obtenir l'historique des commits
  async getLog() {
    if (!this.currentRepo) throw new Error("Aucun dépôt Git");

    try {
      const response = await fetch("/api/git/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path: this.currentRepo }),
      });

      if (!response.ok) throw new Error("Erreur de log Git");

      return await response.json();
    } catch (error) {
      console.error("Erreur de log Git:", error);
      throw error;
    }
  }

  // Créer une nouvelle branche
  async createBranch(name) {
    if (!this.currentRepo) throw new Error("Aucun dépôt Git");

    try {
      const response = await fetch("/api/git/branch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: this.currentRepo,
          name,
        }),
      });

      if (!response.ok) throw new Error("Erreur de création de branche");

      return true;
    } catch (error) {
      console.error("Erreur de création de branche:", error);
      throw error;
    }
  }

  // Changer de branche
  async checkout(branch) {
    if (!this.currentRepo) throw new Error("Aucun dépôt Git");

    try {
      const response = await fetch("/api/git/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: this.currentRepo,
          branch,
        }),
      });

      if (!response.ok) throw new Error("Erreur de checkout");

      return true;
    } catch (error) {
      console.error("Erreur de checkout:", error);
      throw error;
    }
  }
}
