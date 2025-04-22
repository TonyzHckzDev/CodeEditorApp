// snippets.js - Gestion des snippets de code

class SnippetManager {
  constructor() {
    this.snippets = new Map();
    this.categories = new Set();
    this.tags = new Set();
  }

  /**
   * Initialise le gestionnaire de snippets
   */
  init() {
    this.loadSnippets();
    this.setupEventListeners();
  }

  /**
   * Charge les snippets depuis le stockage local
   */
  loadSnippets() {
    const savedSnippets = localStorage.getItem("snippets");
    if (savedSnippets) {
      const parsed = JSON.parse(savedSnippets);
      this.snippets = new Map(Object.entries(parsed));
      this.updateCategoriesAndTags();
    }
  }

  /**
   * Configure les écouteurs d'événements
   */
  setupEventListeners() {
    // TODO: Implémenter les écouteurs d'événements pour la gestion des snippets
  }

  /**
   * Met à jour les catégories et tags
   */
  updateCategoriesAndTags() {
    this.categories.clear();
    this.tags.clear();

    this.snippets.forEach((snippet) => {
      if (snippet.category) this.categories.add(snippet.category);
      if (snippet.tags) snippet.tags.forEach((tag) => this.tags.add(tag));
    });
  }

  /**
   * Ajoute un nouveau snippet
   * @param {Object} snippet - Données du snippet
   * @returns {string} ID du snippet
   */
  addSnippet(snippet) {
    const id = Math.random().toString(36).substring(7);
    const newSnippet = {
      id,
      title: snippet.title,
      code: snippet.code,
      language: snippet.language,
      category: snippet.category,
      tags: snippet.tags || [],
      description: snippet.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.snippets.set(id, newSnippet);
    this.updateCategoriesAndTags();
    this.saveSnippets();
    return id;
  }

  /**
   * Met à jour un snippet existant
   * @param {string} id - ID du snippet
   * @param {Object} updates - Modifications à apporter
   */
  updateSnippet(id, updates) {
    const snippet = this.snippets.get(id);
    if (!snippet) return;

    const updatedSnippet = {
      ...snippet,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.snippets.set(id, updatedSnippet);
    this.updateCategoriesAndTags();
    this.saveSnippets();
  }

  /**
   * Supprime un snippet
   * @param {string} id - ID du snippet
   */
  deleteSnippet(id) {
    this.snippets.delete(id);
    this.updateCategoriesAndTags();
    this.saveSnippets();
  }

  /**
   * Sauvegarde les snippets dans le stockage local
   */
  saveSnippets() {
    localStorage.setItem(
      "snippets",
      JSON.stringify(Object.fromEntries(this.snippets))
    );
  }

  /**
   * Recherche des snippets
   * @param {Object} criteria - Critères de recherche
   * @returns {Array} Snippets correspondants
   */
  searchSnippets(criteria) {
    return Array.from(this.snippets.values()).filter((snippet) => {
      if (criteria.category && snippet.category !== criteria.category)
        return false;
      if (criteria.language && snippet.language !== criteria.language)
        return false;
      if (
        criteria.tags &&
        !criteria.tags.every((tag) => snippet.tags.includes(tag))
      )
        return false;
      if (criteria.query) {
        const query = criteria.query.toLowerCase();
        return (
          snippet.title.toLowerCase().includes(query) ||
          snippet.description.toLowerCase().includes(query) ||
          snippet.code.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }

  /**
   * Récupère un snippet par son ID
   * @param {string} id - ID du snippet
   * @returns {Object} Snippet
   */
  getSnippet(id) {
    return this.snippets.get(id);
  }

  /**
   * Récupère tous les snippets
   * @returns {Array} Liste des snippets
   */
  getAllSnippets() {
    return Array.from(this.snippets.values());
  }

  /**
   * Récupère les catégories
   * @returns {Array} Liste des catégories
   */
  getCategories() {
    return Array.from(this.categories);
  }

  /**
   * Récupère les tags
   * @returns {Array} Liste des tags
   */
  getTags() {
    return Array.from(this.tags);
  }

  /**
   * Exporte les snippets
   * @returns {string} Données JSON
   */
  exportSnippets() {
    return JSON.stringify(Object.fromEntries(this.snippets), null, 2);
  }

  /**
   * Importe des snippets
   * @param {string} data - Données JSON
   */
  importSnippets(data) {
    try {
      const imported = JSON.parse(data);
      this.snippets = new Map(Object.entries(imported));
      this.updateCategoriesAndTags();
      this.saveSnippets();
      return true;
    } catch (error) {
      console.error("Erreur lors de l'import des snippets:", error);
      return false;
    }
  }
}

export const snippetManager = new SnippetManager();
