import express from 'express';
import bodyParser from 'body-parser';
import next from 'next';
import router from './app/routes/commonroutes.js';
import cors from 'cors';  // Add this import

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const PORT = process.env.PORT || 3002;

  // Add CORS middleware
  server.use(cors({
    origin: 'http://localhost:3000',  // Allow requests from your React app
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-api-key']
  }));

  server.use(bodyParser.json());

  server.use('/api', router);

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});