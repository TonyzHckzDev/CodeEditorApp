# CodeEditor Mini-App Telegram

Une mini-application Telegram permettant d'éditer, d'exécuter et de partager des snippets de code multi-langages.

## Fonctionnalités

- Éditeur de code intégré avec Monaco Editor
- Support de plusieurs langages : HTML, CSS, JavaScript, Python, Java
- Aperçu en direct pour HTML/CSS/JS
- Exécution de code Python et Java côté serveur
- Interface responsive adaptée aux mobiles
- Thème clair/sombre
- Intégration avec l'API Telegram WebApp

## Installation

1. Clonez le dépôt :

```bash
git clone https://github.com/votre-username/CodeEditorApp.git
cd CodeEditorApp
```

2. Installez les dépendances :

```bash
npm install
```

3. Démarrez le serveur de développement :

```bash
npm run dev
```

4. Dans un autre terminal, lancez le serveur HTTP pour les fichiers statiques :

```bash
http-server public -p 8080
```

5. Accédez à l'application :

- Sur votre ordinateur : http://localhost:8080
- Sur votre appareil mobile (même réseau WiFi) : http://[votre-ip]:8080

## Structure du projet

```
CodeEditorApp/
├── public/              # Fichiers statiques
│   ├── index.html      # Page principale
│   ├── src/            # JavaScript client
│   └── styles/         # CSS compilé
├── src/                # Code source
│   ├── server.js       # Serveur Express
│   └── utils/          # Utilitaires
├── functions/          # Fonctions serverless
├── package.json        # Dépendances
├── tailwind.config.js  # Configuration Tailwind
└── postcss.config.js   # Configuration PostCSS
```

## Développement

- `npm run dev` : Démarre le serveur Express
- `npm run build` : Compile le CSS Tailwind
- `npm test` : Lance les tests

## Intégration Telegram

1. Créez un bot via [@BotFather](https://t.me/BotFather)
2. Configurez la WebApp dans les paramètres du bot
3. Déployez l'application sur un serveur HTTPS
4. Mettez à jour l'URL de la WebApp dans les paramètres du bot

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## Licence

MIT
