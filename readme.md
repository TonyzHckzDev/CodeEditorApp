# CodeEditor Mini-App Telegram

Une mini-application Telegram moderne permettant d'éditer, d'exécuter et de partager des snippets de code multi-langages avec une interface utilisateur intuitive et des fonctionnalités avancées.

## 🌟 Fonctionnalités

### Éditeur de Code

- Éditeur Monaco intégré avec coloration syntaxique
- Support de multiples langages : HTML, CSS, JavaScript, Python, Java
- Numérotation des lignes et mise en évidence de la syntaxe
- Recherche et remplacement de texte
- Menu contextuel avec actions courantes (copier, couper, coller, etc.)

### Fonctionnalités Avancées

- Aperçu en direct pour HTML/CSS/JS
- Exécution sécurisée de code Python et Java côté serveur
- Gestion des fichiers et des snippets
- Thème clair/sombre avec transitions fluides
- Interface responsive adaptée aux mobiles et tablettes
- Intégration native avec l'API Telegram WebApp

## 🚀 Installation

### Prérequis

- Node.js (v14 ou supérieur)
- npm (v6 ou supérieur)
- Un bot Telegram (créé via [@BotFather](https://t.me/BotFather))

### Étapes d'Installation

1. Clonez le dépôt :

```bash
git clone https://github.com/TonyzHckzDev/CodeEditorApp.git
cd CodeEditorApp
```

2. Installez les dépendances :

```bash
npm install
```

3. Configurez les variables d'environnement :

```bash
cp .env.example .env
# Modifiez les variables dans .env selon votre configuration
```

4. Démarrez le serveur de développement :

```bash
npm run dev
```

5. Dans un autre terminal, lancez le serveur HTTP pour les fichiers statiques :

```bash
http-server public -p 8080
```

6. Accédez à l'application :

- Local : http://localhost:8080
- Réseau local : http://[votre-ip]:8080

## 📁 Structure du Projet

```
CodeEditorApp/
├── public/                 # Fichiers statiques
│   ├── index.html         # Page principale
│   ├── src/               # JavaScript client
│   └── styles/            # CSS compilé
├── src/                   # Code source
│   ├── server.js          # Serveur Express
│   ├── components/        # Composants React
│   ├── features/          # Fonctionnalités
│   ├── utils/             # Utilitaires
│   └── test/              # Tests
├── functions/             # Fonctions serverless
├── package.json           # Dépendances
├── tailwind.config.js     # Configuration Tailwind
└── postcss.config.js      # Configuration PostCSS
```

## 🛠️ Développement

### Commandes Disponibles

- `npm run dev` : Démarre le serveur Express en mode développement
- `npm run build` : Compile le CSS Tailwind et optimise les assets
- `npm run test` : Lance les tests unitaires et d'intégration
- `npm run lint` : Vérifie le code avec ESLint
- `npm run format` : Formate le code avec Prettier

### Configuration de l'Éditeur

- Support de la coloration syntaxique pour plus de 20 langages
- Thèmes personnalisables (clair/sombre)
- Raccourcis clavier configurables
- Auto-complétion intelligente

## 🔒 Sécurité

- Exécution de code dans un environnement isolé
- Validation des entrées utilisateur
- Protection contre les attaques XSS
- Limitation des ressources système
- Journalisation des actions sensibles

## 🤖 Intégration Telegram

1. Créez un bot via [@BotFather](https://t.me/BotFather)
2. Configurez la WebApp dans les paramètres du bot :
   - URL : https://votre-domaine.com
   - Description : Éditeur de code multi-langages
3. Déployez l'application sur un serveur HTTPS
4. Mettez à jour l'URL de la WebApp dans les paramètres du bot

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

### Guide de Contribution

- Suivez les conventions de code existantes
- Ajoutez des tests pour les nouvelles fonctionnalités
- Mettez à jour la documentation si nécessaire
- Utilisez des messages de commit descriptifs

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [TailwindCSS](https://tailwindcss.com)
- [Telegram WebApp API](https://core.telegram.org/bots/webapps)

## 📞 Support

Pour toute question ou problème :

- Ouvrez une issue sur GitHub
- Contactez-nous via Telegram : [@votre_bot](https://t.me/votre_bot)
- Consultez la [documentation](https://votre-domaine.com/docs)
