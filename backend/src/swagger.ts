import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Caderneta Escola & Família',
      version: '1.0.0',
      description: 'Documentação da API do projeto Caderneta Escola & Família',
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: 'Servidor Local (MVP)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Use o token retornado pelo Supabase no login.'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  // Caminhos onde o Swagger deve procurar por anotações de documentação nas rotas
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
  
  // Endpoint para expor o JSON do Swagger
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}
