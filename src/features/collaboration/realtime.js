// realtime.js - Gestion de la collaboration en temps réel

class RealtimeCollaboration {
  constructor() {
    this.editor = null;
    this.collaborators = new Map();
    this.roomId = null;
    this.userId = null;
  }

  /**
   * Initialise la collaboration en temps réel
   * @param {Object} editor - Instance de l'éditeur Monaco
   */
  init(editor) {
    this.editor = editor;
    this.setupWebSocket();
    this.setupEditorListeners();
  }

  /**
   * Configure la connexion WebSocket
   */
  setupWebSocket() {
    // TODO: Implémenter la connexion WebSocket avec un serveur de collaboration
    this.ws = new WebSocket("wss://votre-serveur-collaboration.com");

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleCollaborationMessage(data);
    };
  }

  /**
   * Configure les écouteurs d'événements de l'éditeur
   */
  setupEditorListeners() {
    if (!this.editor) return;

    this.editor.onDidChangeModelContent((event) => {
      const changes = event.changes.map((change) => ({
        range: change.range,
        text: change.text,
        userId: this.userId,
      }));

      this.broadcastChanges(changes);
    });
  }

  /**
   * Crée une nouvelle salle de collaboration
   * @returns {string} ID de la salle
   */
  createRoom() {
    this.roomId = Math.random().toString(36).substring(7);
    this.ws.send(
      JSON.stringify({
        type: "create_room",
        roomId: this.roomId,
      })
    );
    return this.roomId;
  }

  /**
   * Rejoint une salle de collaboration existante
   * @param {string} roomId - ID de la salle
   */
  joinRoom(roomId) {
    this.roomId = roomId;
    this.ws.send(
      JSON.stringify({
        type: "join_room",
        roomId: this.roomId,
        userId: this.userId,
      })
    );
  }

  /**
   * Envoie les modifications aux collaborateurs
   * @param {Array} changes - Liste des modifications
   */
  broadcastChanges(changes) {
    if (!this.roomId) return;

    this.ws.send(
      JSON.stringify({
        type: "changes",
        roomId: this.roomId,
        changes: changes,
      })
    );
  }

  /**
   * Gère les messages de collaboration reçus
   * @param {Object} data - Données reçues
   */
  handleCollaborationMessage(data) {
    switch (data.type) {
      case "changes":
        this.applyChanges(data.changes);
        break;
      case "user_joined":
        this.addCollaborator(data.userId, data.username);
        break;
      case "user_left":
        this.removeCollaborator(data.userId);
        break;
    }
  }

  /**
   * Applique les modifications reçues
   * @param {Array} changes - Liste des modifications
   */
  applyChanges(changes) {
    if (!this.editor) return;

    const model = this.editor.getModel();
    if (!model) return;

    this.editor.pushEditOperations(
      [],
      changes.map((change) => ({
        range: change.range,
        text: change.text,
      })),
      () => null
    );
  }

  /**
   * Ajoute un collaborateur
   * @param {string} userId - ID de l'utilisateur
   * @param {string} username - Nom d'utilisateur
   */
  addCollaborator(userId, username) {
    this.collaborators.set(userId, {
      username,
      cursor: this.editor.addDecorations([], []),
    });
  }

  /**
   * Supprime un collaborateur
   * @param {string} userId - ID de l'utilisateur
   */
  removeCollaborator(userId) {
    const collaborator = this.collaborators.get(userId);
    if (collaborator) {
      this.editor.removeDecorations(collaborator.cursor);
      this.collaborators.delete(userId);
    }
  }

  /**
   * Génère un lien de partage
   * @returns {string} Lien de partage
   */
  generateShareLink() {
    return `${window.location.origin}/share/${this.roomId}`;
  }
}

export const realtimeCollaboration = new RealtimeCollaboration();
