const logger = require('./logger');

// Classes d'erreur personnalisées
class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404, 'NOT_FOUND');
  }
}

class SecurityError extends AppError {
  constructor(message) {
    super(message, 403, 'SECURITY_ERROR');
  }
}

// Gestionnaire d'erreurs pour les promesses non gérées
const handleUncaughtErrors = server => {
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Promesse rejetée non gérée:', reason);
    gracefulShutdown(server, 1);
  });

  process.on('uncaughtException', err => {
    logger.error('Exception non gérée:', err);
    gracefulShutdown(server, 1);
  });

  process.on('SIGTERM', () => {
    logger.info('Signal SIGTERM reçu');
    gracefulShutdown(server, 0);
  });
};

// Fonction d'arrêt gracieux
const gracefulShutdown = (server, code) => {
  logger.info('Arrêt gracieux du serveur...');
  server.close(() => {
    logger.info('Serveur arrêté');
    process.exit(code);
  });

  // Force l'arrêt après 10 secondes
  setTimeout(() => {
    logger.error('Arrêt forcé du serveur après timeout');
    process.exit(code);
  }, 10000);
};

// Middleware de gestion des erreurs
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log l'erreur
  logger.logError(err, req);

  // Réponse en mode développement
  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // Réponse en production
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Erreur non opérationnelle : ne pas divulguer les détails
  return res.status(500).json({
    status: 'error',
    message: 'Une erreur est survenue',
  });
};

// Middleware pour les routes non trouvées
const notFoundHandler = (req, res, next) => {
  next(new NotFoundError(`Route ${req.originalUrl} non trouvée`));
};

module.exports = {
  AppError,
  ValidationError,
  NotFoundError,
  SecurityError,
  errorHandler,
  notFoundHandler,
  handleUncaughtErrors,
};
