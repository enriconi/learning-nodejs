import { createServer } from 'node:http';
import { Router } from './router.mjs';

const router = new Router();

router.get('/', (req, res) => {
  res.end('GET - Home');
});

router.get('/products', (req, res) => {
  res.end('GET - Products');
});

router.post('/product', (req, res) => {
  res.end('POST - Product');
});

const server = createServer(async (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  const url = new URL(req.url || '/', 'http://localhost');
  const handler = router.find(req.method, url.pathname);

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = Buffer.concat(chunks).toString('utf-8');
  console.log(JSON.parse(body));

  if (handler) {
    res.statusCode = 200;
    handler(req, res);
  } else {
    res.statusCode = 404;
    res.end('404');
  }
});

server.listen(3000, () => {
  console.log('Server: http://localhost:3000');
});
