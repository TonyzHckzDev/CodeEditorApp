const Joi = require('joi');

// Constantes de validation
const LIMITS = {
  CODE_MAX_LENGTH: 50000,
  MARKDOWN_MAX_LENGTH: 50000,
  FILE_NAME_MAX_LENGTH: 255,
  FILE_PATH_MAX_LENGTH: 1000,
};

// Schémas de base
const baseSchemas = {
  id: Joi.string()
    .max(100)
    .pattern(/^[a-zA-Z0-9-_]+$/),
  fileName: Joi.string()
    .max(LIMITS.FILE_NAME_MAX_LENGTH)
    .pattern(/^[a-zA-Z0-9-_. ]+$/),
  filePath: Joi.string()
    .max(LIMITS.FILE_PATH_MAX_LENGTH)
    .pattern(/^[a-zA-Z0-9-_./]+$/),
};

// Schémas de validation pour le code
const codeSchemas = {
  execute: Joi.object({
    code: Joi.string().required().max(LIMITS.CODE_MAX_LENGTH),
    language: Joi.string().required().valid('python', 'javascript', 'java'),
    timeout: Joi.number().min(1000).max(10000).default(5000),
  }),

  save: Joi.object({
    code: Joi.string().required().max(LIMITS.CODE_MAX_LENGTH),
    fileName: baseSchemas.fileName.required(),
    path: baseSchemas.filePath.optional(),
  }),
};

// Schémas de validation pour le markdown
const markdownSchemas = {
  preview: Joi.object({
    content: Joi.string().required().max(LIMITS.MARKDOWN_MAX_LENGTH),
    sanitize: Joi.boolean().default(true),
  }),

  save: Joi.object({
    content: Joi.string().required().max(LIMITS.MARKDOWN_MAX_LENGTH),
    fileName: baseSchemas.fileName.required(),
    path: baseSchemas.filePath.optional(),
  }),
};

// Fonction de validation générique
const validate = schema => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      error: 'Validation échouée',
      details: error.details.map(err => ({
        message: err.message,
        path: err.path,
      })),
    });
  }

  req.validatedData = value;
  next();
};

module.exports = {
  LIMITS,
  validate,
  schemas: {
    code: codeSchemas,
    markdown: markdownSchemas,
    base: baseSchemas,
  },
};
