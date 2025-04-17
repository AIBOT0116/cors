import express from 'express';
import cors from 'cors';
import { createServer } from 'http';

const app = express();

// Use CORS middleware (customize origin if needed)
app.use(cors());

// Sample route
app.get('/', (req, res) => {
  res.json({ message: 'CORS-enabled server on Vercel!' });
});

// For Vercel serverless handler
export default function handler(req, res) {
  return app(req, res);
}
