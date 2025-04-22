// settings.js - gestionnaire des paramètres utilisateurs

// Clé de stockage local const SETTINGS_KEY = 'codeEditorAppSettings';

// Paramètres par défaut const defaultSettings = { theme: 'light',         // 'light' ou 'dark' autosave: false,        // true: sauvegarde auto toutes les X secondes saveInterval: 30000     // intervalle de sauvegarde automatique en ms };

/**

Charge les paramètres depuis localStorage ou retourne les valeurs par défaut */ function loadSettings() { try { const stored = localStorage.getItem(SETTINGS_KEY); return stored ? JSON.parse(stored) : { ...defaultSettings }; } catch (e) { console.error('Erreur lecture des paramètres:', e); return { ...defaultSettings }; } }


/**

Sauvegarde les paramètres dans localStorage */ function saveSettings(settings) { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (e) { console.error('Erreur sauvegarde des paramètres:', e); } }


/**

Applique les paramètres à l'application (thème, autosave) */ function applySettings(settings) { // Thème document.documentElement.classList.toggle('dark', settings.theme === 'dark'); if (window.editor) { const monacoTheme = settings.theme === 'dark' ? 'vs-dark' : 'vs-light'; monaco.editor.setTheme(monacoTheme); }


// Autosave if (window._autosaveInterval) clearInterval(window._autosaveInterval); if (settings.autosave) { window._autosaveInterval = setInterval(() => { const snippets = JSON.parse(localStorage.getItem('snippets') || '[]'); snippets.push({ id: Date.now(), language: document.getElementById('language-select').value, content: window.editor.getValue() }); localStorage.setItem('snippets', JSON.stringify(snippets)); }, settings.saveInterval); } }

// Initialisation à la charge de la page Paramètres document.addEventListener('DOMContentLoaded', () => { const themeToggle = document.getElementById('toggle-theme'); const autosaveToggle = document.getElementById('toggle-autosave'); const intervalInput = document.getElementById('input-save-interval');

// Récupérer et appliquer const settings = loadSettings(); themeToggle.checked = settings.theme === 'dark'; autosaveToggle.checked = settings.autosave; intervalInput.value = Math.floor(settings.saveInterval / 1000); applySettings(settings);

// Événements themeToggle.addEventListener('change', (e) => { settings.theme = e.target.checked ? 'dark' : 'light'; saveSettings(settings); applySettings(settings); });

autosaveToggle.addEventListener('change', (e) => { settings.autosave = e.target.checked; saveSettings(settings); applySettings(settings); });

intervalInput.addEventListener('input', (e) => { const val = parseInt(e.target.value, 10); if (!isNaN(val) && val > 0) { settings.saveInterval = val * 1000; saveSettings(settings); applySettings(settings); } }); });