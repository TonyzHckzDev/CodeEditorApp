export class RemoteManager {
  constructor() {
    this.connections = new Map();
    this.currentConnection = null;
    this.loadConnections();
  }

  // Ajouter une nouvelle connexion
  addConnection(name, config) {
    const connection = {
      id: Date.now().toString(),
      name,
      type: config.type, // 'ftp' ou 'sftp'
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password, // À encoder en production
      path: config.path || "/",
      created: Date.now(),
    };

    this.connections.set(connection.id, connection);
    this.saveConnections();
    return connection;
  }

  // Se connecter à un serveur distant
  async connect(connectionId) {
    const connection = this.connections.get(connectionId);
    if (!connection) throw new Error("Connexion non trouvée");

    try {
      // Utiliser l'API Fetch pour communiquer avec le serveur
      const response = await fetch("/api/remote/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(connection),
      });

      if (!response.ok) throw new Error("Erreur de connexion");

      this.currentConnection = connection;
      return true;
    } catch (error) {
      console.error("Erreur de connexion:", error);
      throw error;
    }
  }

  // Lister les fichiers distants
  async listFiles(path = "/") {
    if (!this.currentConnection) throw new Error("Non connecté");

    try {
      const response = await fetch("/api/remote/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          connection: this.currentConnection,
          path,
        }),
      });

      if (!response.ok) throw new Error("Erreur de listage");

      return await response.json();
    } catch (error) {
      console.error("Erreur de listage:", error);
      throw error;
    }
  }

  // Télécharger un fichier
  async downloadFile(remotePath) {
    if (!this.currentConnection) throw new Error("Non connecté");

    try {
      const response = await fetch("/api/remote/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          connection: this.currentConnection,
          path: remotePath,
        }),
      });

      if (!response.ok) throw new Error("Erreur de téléchargement");

      return await response.text();
    } catch (error) {
      console.error("Erreur de téléchargement:", error);
      throw error;
    }
  }

  // Uploader un fichier
  async uploadFile(remotePath, content) {
    if (!this.currentConnection) throw new Error("Non connecté");

    try {
      const response = await fetch("/api/remote/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          connection: this.currentConnection,
          path: remotePath,
          content,
        }),
      });

      if (!response.ok) throw new Error("Erreur d'upload");

      return true;
    } catch (error) {
      console.error("Erreur d'upload:", error);
      throw error;
    }
  }

  // Supprimer un fichier distant
  async deleteFile(remotePath) {
    if (!this.currentConnection) throw new Error("Non connecté");

    try {
      const response = await fetch("/api/remote/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          connection: this.currentConnection,
          path: remotePath,
        }),
      });

      if (!response.ok) throw new Error("Erreur de suppression");

      return true;
    } catch (error) {
      console.error("Erreur de suppression:", error);
      throw error;
    }
  }

  // Sauvegarder les connexions dans le localStorage
  saveConnections() {
    try {
      const connections = Array.from(this.connections.entries());
      localStorage.setItem("remoteConnections", JSON.stringify(connections));
    } catch (error) {
      console.error("Erreur de sauvegarde des connexions:", error);
    }
  }

  // Charger les connexions depuis le localStorage
  loadConnections() {
    try {
      const saved = localStorage.getItem("remoteConnections");
      if (saved) {
        this.connections = new Map(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Erreur de chargement des connexions:", error);
    }
  }
}
