import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HFM API Documentation',
      version: '1.0.0',
      description:
        "API REST pour Madagasikara Hoan'ny Malagasy (HFM) - Documentation complète des endpoints",
      contact: {
        name: 'HFM Team',
        email: 'contact@madagasikarahoanymalagasy.org',
        url: 'https://HFM.mg',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://api.HFM.mg',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Entrez le token JWT reçu lors de la connexion',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Une erreur est survenue',
            },
            stack: {
              type: 'string',
              description: 'Stack trace (uniquement en développement)',
            },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Erreur de validation',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    example: 'email',
                  },
                  message: {
                    type: 'string',
                    example: 'Email invalide',
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        Unauthorized: {
          description: 'Non autorisé - Token manquant ou invalide',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Non autorisé, token invalide',
              },
            },
          },
        },
        NotFound: {
          description: 'Ressource non trouvée',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Ressource non trouvée',
              },
            },
          },
        },
        BadRequest: {
          description: 'Requête invalide',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError',
              },
            },
          },
        },
        ServerError: {
          description: 'Erreur interne du serveur',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Erreur interne du serveur',
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Health',
        description: "Endpoints de vérification de l'état du serveur",
      },
      {
        name: 'Users',
        description: "Gestion de l'authentification et des utilisateurs",
      },
      {
        name: 'Members',
        description: "Gestion des membres de l'association",
      },
      {
        name: 'Applications',
        description: "Gestion des candidatures d'adhésion",
      },
    ],
    security: [],
  },
  apis: ['./src/routes/*.js', './src/models/*.js'],
};

export default swaggerJsdoc(options);
