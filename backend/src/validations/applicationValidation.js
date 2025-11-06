import Joi from 'joi';

/**
 * Validation schema for membership application
 */
export const membershipApplicationValidation = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'Le prénom est requis',
    'string.min': 'Le prénom doit contenir au moins 2 caractères',
  }),

  lastName: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'Le nom est requis',
  }),

  dateOfBirth: Joi.date().max('now').required().messages({
    'date.max': 'La date de naissance ne peut pas être dans le futur',
    'any.required': 'La date de naissance est requise',
  }),

  address: Joi.object({
    street: Joi.string().trim().allow('').optional(),
    city: Joi.string().trim().required().messages({
      'string.empty': 'La ville est requise',
    }),
    postalCode: Joi.string().trim().required().messages({
      'string.empty': 'Le code postal est requis',
    }),
    country: Joi.string().trim().default('France'),
    full: Joi.string().trim().allow('').optional(),
  }).required(),

  phone: Joi.string()
    .trim()
    .pattern(/^[0-9\s+\-().]+$/)
    .required()
    .messages({
      'string.empty': 'Le téléphone est requis',
      'string.pattern.base': "Le numéro de téléphone n'est pas valide",
    }),

  email: Joi.string().email().trim().lowercase().required().messages({
    'string.empty': "L'email est requis",
    'string.email': 'Veuillez fournir une adresse email valide',
  }),

  memberType: Joi.string().valid('regular', 'student', 'honorary', 'family').default('regular'),

  emergencyContact: Joi.object({
    name: Joi.string().trim().required().messages({
      'string.empty': "Le nom du contact d'urgence est requis",
    }),
    phone: Joi.string().trim().required().messages({
      'string.empty': "Le téléphone du contact d'urgence est requis",
    }),
    relationship: Joi.string().trim().required().messages({
      'string.empty': "La relation avec le contact d'urgence est requise",
    }),
  }).required(),

  occupation: Joi.string().trim().allow('').optional(),
  interests: Joi.string().trim().allow('').optional(),
});

/**
 * Validation schema for approving membership
 */
export const approveMembershipValidation = Joi.object({
  notes: Joi.string().trim().allow('').optional(),
});

/**
 * Validation schema for rejecting membership
 */
export const rejectMembershipValidation = Joi.object({
  rejectionReason: Joi.string().trim().required().messages({
    'string.empty': 'La raison du rejet est requise',
  }),
});

/**
 * Middleware to validate request body
 */
export const validate = (schema) => (req, res, next) => {
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
