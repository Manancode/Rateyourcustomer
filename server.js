
import express from 'express';
import bodyParser from 'body-parser';
import next from 'next';
import router from './app/routes/commonroutes.js';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const PORT = process.env.PORT || 3001;

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
