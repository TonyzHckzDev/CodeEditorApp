// advanced-telegram.js - Intégration avancée avec Telegram

class AdvancedTelegram {
  constructor() {
    this.tg = window.Telegram?.WebApp;
    this.user = null;
    this.initData = null;
    this.callbacks = new Map();
    this.isInitialized = false;
  }

  /**
   * Initialise l'intégration Telegram
   * @returns {boolean} Succès de l'initialisation
   */
  init() {
    if (!this.tg) {
      console.error("Telegram WebApp non disponible");
      return false;
    }

    try {
      // Récupérer les données d'initialisation
      this.initData = this.tg.initData;
      this.user = this.tg.initDataUnsafe?.user;

      // Configurer l'interface
      this.setupInterface();

      // Configurer les callbacks
      this.setupCallbacks();

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error("Erreur lors de l'initialisation de Telegram:", error);
      return false;
    }
  }

  /**
   * Configure l'interface Telegram
   */
  setupInterface() {
    // Définir la couleur du header
    this.tg.setHeaderColor("#2C3E50");

    // Configurer le bouton principal
    this.tg.MainButton.setText("Envoyer");
    this.tg.MainButton.hide();

    // Configurer le bouton retour
    this.tg.BackButton.hide();

    // Configurer la barre de progression
    this.tg.setBackgroundColor("#FFFFFF");
    this.tg.setForegroundColor("#000000");

    // Configurer la hauteur de la fenêtre
    this.tg.expand();
  }

  /**
   * Configure les callbacks pour les événements Telegram
   */
  setupCallbacks() {
    // Callback pour le bouton principal
    this.tg.MainButton.onClick(() => {
      const callback = this.callbacks.get("mainButton");
      if (callback) callback();
    });

    // Callback pour le bouton retour
    this.tg.BackButton.onClick(() => {
      const callback = this.callbacks.get("backButton");
      if (callback) callback();
    });

    // Callback pour les changements de thème
    this.tg.onEvent("themeChanged", () => {
      const callback = this.callbacks.get("themeChanged");
      if (callback) callback(this.tg.colorScheme);
    });

    // Callback pour les changements de vue
    this.tg.onEvent("viewportChanged", () => {
      const callback = this.callbacks.get("viewportChanged");
      if (callback)
        callback(this.tg.viewportHeight, this.tg.viewportStableHeight);
    });
  }

  /**
   * Enregistre un callback pour un événement
   * @param {string} event - Nom de l'événement
   * @param {Function} callback - Fonction de callback
   */
  on(event, callback) {
    this.callbacks.set(event, callback);
  }

  /**
   * Affiche le bouton principal
   * @param {string} text - Texte du bouton
   * @param {boolean} show - Afficher ou cacher le bouton
   */
  setMainButton(text, show = true) {
    if (!this.isInitialized) return;

    this.tg.MainButton.setText(text);
    if (show) {
      this.tg.MainButton.show();
    } else {
      this.tg.MainButton.hide();
    }
  }

  /**
   * Affiche le bouton retour
   * @param {boolean} show - Afficher ou cacher le bouton
   */
  setBackButton(show = true) {
    if (!this.isInitialized) return;

    if (show) {
      this.tg.BackButton.show();
    } else {
      this.tg.BackButton.hide();
    }
  }

  /**
   * Affiche une popup
   * @param {Object} options - Options de la popup
   */
  showPopup(options) {
    if (!this.isInitialized) return;

    this.tg.showPopup(
      {
        title: options.title || "Information",
        message: options.message || "",
        buttons: options.buttons || [{ id: "ok", type: "ok" }],
      },
      (buttonId) => {
        if (options.callback) {
          options.callback(buttonId);
        }
      }
    );
  }

  /**
   * Affiche une alerte
   * @param {string} message - Message à afficher
   */
  showAlert(message) {
    if (!this.isInitialized) return;

    this.tg.showAlert(message);
  }

  /**
   * Affiche une confirmation
   * @param {string} message - Message à afficher
   * @param {Function} callback - Callback appelé avec le résultat
   */
  showConfirm(message, callback) {
    if (!this.isInitialized) return;

    this.tg.showConfirm(message, callback);
  }

  /**
   * Envoie des données au bot
   * @param {Object} data - Données à envoyer
   */
  sendData(data) {
    if (!this.isInitialized) return;

    try {
      this.tg.sendData(JSON.stringify(data));
    } catch (error) {
      console.error("Erreur lors de l'envoi des données:", error);
    }
  }

  /**
   * Ferme l'application
   */
  close() {
    if (!this.isInitialized) return;

    this.tg.close();
  }

  /**
   * Ouvre un lien
   * @param {string} url - URL à ouvrir
   */
  openLink(url) {
    if (!this.isInitialized) return;

    this.tg.openLink(url);
  }

  /**
   * Ouvre Telegram
   * @param {string} username - Nom d'utilisateur Telegram
   */
  openTelegram(username) {
    if (!this.isInitialized) return;

    this.tg.openTelegramLink(`https://t.me/${username}`);
  }

  /**
   * Récupère les informations de l'utilisateur
   * @returns {Object} Informations de l'utilisateur
   */
  getUser() {
    return this.user;
  }

  /**
   * Récupère les données d'initialisation
   * @returns {Object} Données d'initialisation
   */
  getInitData() {
    return this.initData;
  }

  /**
   * Vérifie si l'application est en mode sombre
   * @returns {boolean} True si en mode sombre
   */
  isDarkMode() {
    return this.tg.colorScheme === "dark";
  }

  /**
   * Récupère la hauteur de la fenêtre
   * @returns {number} Hauteur de la fenêtre
   */
  getViewportHeight() {
    return this.tg.viewportHeight;
  }

  /**
   * Récupère la hauteur stable de la fenêtre
   * @returns {number} Hauteur stable de la fenêtre
   */
  getViewportStableHeight() {
    return this.tg.viewportStableHeight;
  }

  /**
   * Définit la couleur du header
   * @param {string} color - Couleur en hexadécimal
   */
  setHeaderColor(color) {
    if (!this.isInitialized) return;

    this.tg.setHeaderColor(color);
  }

  /**
   * Définit la couleur de fond
   * @param {string} color - Couleur en hexadécimal
   */
  setBackgroundColor(color) {
    if (!this.isInitialized) return;

    this.tg.setBackgroundColor(color);
  }

  /**
   * Définit la couleur de premier plan
   * @param {string} color - Couleur en hexadécimal
   */
  setForegroundColor(color) {
    if (!this.isInitialized) return;

    this.tg.setForegroundColor(color);
  }

  /**
   * Définit la hauteur de la fenêtre
   * @param {boolean} expand - True pour agrandir, false pour réduire
   */
  setViewportHeight(expand) {
    if (!this.isInitialized) return;

    if (expand) {
      this.tg.expand();
    } else {
      this.tg.close();
    }
  }
}

export const advancedTelegram = new AdvancedTelegram();
