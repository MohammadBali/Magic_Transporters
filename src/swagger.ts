// src/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express'
import { Express } from 'express';
import path from "path";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Worker Missions API',
            version: '1.0.0',
            description: 'API documentation for the Worker Missions management system',
        },
        servers: [
            {
                url: 'http://localhost:3000', // Replace with your server URL
                description: 'Local server'
            },
        ],
    },
    apis: ['./src/routers/*.ts'],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
