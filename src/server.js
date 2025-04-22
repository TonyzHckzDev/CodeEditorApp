const path = require('path');

const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const cors = require('cors');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
const { marked } = require('marked');
const sanitizeHtml = require('sanitize-html');

const { errorHandler, notFoundHandler, handleUncaughtErrors } = require('./utils/errorHandler');
const logger = require('./utils/logger');
const runcodeRouter = require('./utils/runcode');
const { validate, schemas } = require('./utils/validators');

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

// Initialisation de Sentry
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE) || 1.0,
  });

  // Middleware de Sentry
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
}

// Configuration de base
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://cdn.jsdelivr.net'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://api.ipify.org'],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

app.use(hpp());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../public')));

// Logging des requêtes
app.use(logger.logRequest);

// Configuration du rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par fenêtre
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP ${req.ip}`);
    res.status(429).json({
      status: 'error',
      message: 'Trop de requêtes, veuillez réessayer plus tard',
    });
  },
});
app.use('/api/', limiter);

// Configuration de marked pour une sortie sécurisée
marked.setOptions({
  headerIds: false,
  mangle: false,
  breaks: true,
  gfm: true,
});

// Routes pour l'exécution de code
app.use('/api/execute', runcodeRouter);

// Endpoint unifié pour la conversion Markdown
app.post('/api/preview/markdown', validate(schemas.markdown.preview), async (req, res, next) => {
  try {
    const { content, sanitize } = req.validatedData;

    // Convertir le Markdown en HTML
    const rawHtml = marked(content);

    // Nettoyer le HTML si demandé
    const html = sanitize
      ? sanitizeHtml(rawHtml, {
          allowedTags: [
            ...sanitizeHtml.defaults.allowedTags,
            'img',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
          ],
          allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ['src', 'alt', 'title'],
            a: ['href', 'target', 'rel'],
            code: ['class'],
          },
          allowedSchemes: ['http', 'https', 'mailto'],
        })
      : rawHtml;

    res.json({ html });
  } catch (error) {
    next(error);
  }
});

// Route de test
app.get('/test', (req, res) => {
  res.json({ message: 'Le serveur fonctionne correctement!' });
});

// Gestion des routes non trouvées
app.use(notFoundHandler);

// Gestion des erreurs globale
if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}
app.use(errorHandler);

// Démarrage du serveur
const server = app.listen(port, host, () => {
  logger.info(`Serveur démarré sur http://${host}:${port}`);
  logger.info(
    `Accessible depuis votre téléphone sur http://${
      host === '0.0.0.0' ? '10.0.0.12' : host
    }:${port}`
  );
});

// Configuration de la gestion des erreurs non capturées
handleUncaughtErrors(server);
