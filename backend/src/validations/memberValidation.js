import Joi from 'joi';

/**
 * Validation schema for creating a member
 */
export const createMemberValidation = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Le prénom est requis',
      'string.min': 'Le prénom doit contenir au moins 2 caractères',
      'string.max': 'Le prénom ne peut pas dépasser 50 caractères',
    }),

  lastName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Le nom est requis',
      'string.min': 'Le nom doit contenir au moins 2 caractères',
      'string.max': 'Le nom ne peut pas dépasser 50 caractères',
    }),

  dateOfBirth: Joi.date()
    .max('now')
    .required()
    .messages({
      'date.base': 'La date de naissance doit être une date valide',
      'date.max': 'La date de naissance ne peut pas être dans le futur',
      'any.required': 'La date de naissance est requise',
    }),

  address: Joi.object({
    street: Joi.string().trim().allow('').optional(),
    city: Joi.string().trim().allow('').optional(),
    postalCode: Joi.string().trim().allow('').optional(),
    country: Joi.string().trim().allow('').optional(),
    full: Joi.string().trim().allow('').optional(),
  }).optional(),

  phone: Joi.string()
    .trim()
    .pattern(/^[0-9\s\+\-\(\)\.]+$/)
    .allow('')
    .optional()
    .messages({
      'string.pattern.base': 'Le numéro de téléphone n\'est pas valide',
    }),

  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .allow('')
    .optional()
    .messages({
      'string.email': 'Veuillez fournir une adresse email valide',
    }),

  membershipDate: Joi.date()
    .optional()
    .messages({
      'date.base': 'La date d\'adhésion doit être une date valide',
    }),

  status: Joi.string()
    .valid('active', 'inactive', 'pending')
    .optional()
    .messages({
      'any.only': 'Le statut doit être: active, inactive ou pending',
    }),

  notes: Joi.string().trim().allow('').optional(),
});

/**
 * Validation schema for updating a member
 */
export const updateMemberValidation = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).optional(),
  lastName: Joi.string().trim().min(2).max(50).optional(),
  dateOfBirth: Joi.date().max('now').optional(),
  address: Joi.object({
    street: Joi.string().trim().allow('').optional(),
    city: Joi.string().trim().allow('').optional(),
    postalCode: Joi.string().trim().allow('').optional(),
    country: Joi.string().trim().allow('').optional(),
    full: Joi.string().trim().allow('').optional(),
  }).optional(),
  phone: Joi.string()
    .trim()
    .pattern(/^[0-9\s\+\-\(\)\.]+$/)
    .allow('')
    .optional(),
  email: Joi.string().email().trim().lowercase().allow('').optional(),
  membershipDate: Joi.date().optional(),
  status: Joi.string().valid('active', 'inactive', 'pending').optional(),
  notes: Joi.string().trim().allow('').optional(),
}).min(1); // At least one field must be provided

/**
 * Middleware to validate request body against a schema
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors,
      });
    }

    req.body = value;
    next();
  };
};
