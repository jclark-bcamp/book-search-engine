// Implement the Apollo Server and apply it to the Express server as middleware.

import express from 'express';
import path from 'path';
import { ApolloServer } from '@apollo/server'; 
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './services/auth.js';
import bodyParser from 'body-parser';
import db from './config/connection.js';
import { EventEmitter } from 'events';
import { fileURLToPath } from 'url';

const app = express();

// Set up a static directory for the client
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../../client/dist')));

// Create a new Apollo server and pass in the schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Function to start the Apollo server
const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(
    '/graphql',
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const authHeader = req.headers.authorization;
        const user = authHeader ? authenticateToken(authHeader) : null;
        return { user };
      },
    })
  );

  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  });
  (db as unknown as EventEmitter).on('error', console.error.bind(console, 'MongoDB connection error:'));

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();