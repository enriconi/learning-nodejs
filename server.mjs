import { createServer } from 'node:http';
import { Router } from './router.mjs';
import { customRequest } from './custom-request.mjs';
import { customResponse } from './custom-response.mjs';

const router = new Router();

router.get('/', (req, res) => {
  res.status(200).end('GET - Home');
});

router.get('/products', (req, res) => {
  res.status(200).end('GET - Products');
});

router.post('/product', (req, res) => {
  const color = req.query.get('color');
  res.status(201).json({ name: 'Notebook', color, price: 5999.99 });
});

const server = createServer(async (request, response) => {
  const req = await customRequest(request);
  const res = customResponse(response);
  const handler = router.find(req.method, req.pathname);

  if (handler) handler(req, res);
  else res.status(404).end('not-found');
});

server.listen(3000, () => {
  console.log('Server: http://localhost:3000');
});
