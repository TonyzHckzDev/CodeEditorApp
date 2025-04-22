// telegram.js - Gestion de l'intégration avec l'API Telegram WebApp

// Assure que l'API Telegram WebApp est disponible
const tg = window.Telegram && window.Telegram.WebApp;

/**
 * Initialise la WebApp Telegram
 * @param {Object} options - Options de configuration
 * @param {string} [options.headerColor] - Couleur du header en hex sans #
 * @param {string} [options.theme='light'] - Thème (light ou dark)
 * @param {boolean} [options.showMainButton=false] - Afficher le bouton principal
 * @param {string} [options.mainButtonText='Envoyer'] - Texte du bouton principal
 * @param {Function} [options.onBack] - Callback pour le bouton retour
 */
export function initTelegram(options = {}) {
  if (!tg) {
    console.warn("Telegram WebApp API non disponible.");
    return;
  }

  // Expand l'interface
  tg.expand();

  // Définir la couleur du header (hex sans #)
  if (options.headerColor) {
    tg.setHeaderColor(options.headerColor);
  }

  // Appliquer le thème (light ou dark)
  const theme = options.theme || "light";
  tg.MainButton.setParams({
    text_color: theme === "dark" ? "#ffffff" : "#000000",
  });
  document.documentElement.classList.toggle("dark", theme === "dark");

  // Gérer le bouton retour de Telegram
  tg.BackButton.onClick(options.onBack || (() => tg.close()));

  // Afficher le bouton principal si nécessaire
  if (options.showMainButton) {
    tg.MainButton.show();
    tg.MainButton.setText(options.mainButtonText || "Envoyer");
  }
}

/**
 * Envoie des données JSON au bot Telegram
 * @param {Object} payload - Objet à envoyer
 */
export function sendDataToBot(payload) {
  if (!tg) return;
  try {
    tg.sendData(JSON.stringify(payload));
  } catch (e) {
    console.error("Impossible d'envoyer les données au bot:", e);
  }
}

/**
 * Récupère et retourne les données d'initialisation envoyées par Telegram
 * @returns {Object} initData (user, query_id, etc.)
 */
export function getInitData() {
  if (!tg) return null;

  // Données signées disponibles pour vérification côté serveur
  return {
    initData: tg.initData,
    initDataUnsafe: tg.initDataUnsafe,
    user: tg.initDataUnsafe.user,
    queryId: tg.initDataUnsafe.query_id,
  };
}

/**
 * Exemple de configuration complète
 */
export function configureTelegram() {
  const { user } = getInitData() || {};

  initTelegram({
    headerColor: "2C3E50", // Couleur custom du header Telegram
    theme: localStorage.getItem("theme") || "light",
    showMainButton: true,
    mainButtonText: "Envoyer",
    onBack: () => {
      // Comportement personnalisé pour le bouton retour
      console.log("Back pressed by", user?.username);
      tg.close();
    },
  });
}
