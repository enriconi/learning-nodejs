import { createServer } from 'node:http';
import { Router } from './router.mjs';
import { customRequest } from './custom-request.mjs';
import { customResponse } from './custom-response.mjs';
import fs from 'node:fs/promises';

const router = new Router();

router.post('/product', async (req, res) => {
  const { name, slug, category, price } = req.body;
  try {
    await fs.mkdir(`./products/${category}`, { recursive: true });
    await fs.writeFile(
      `./products/${category}/${slug}.json`,
      JSON.stringify({ name, slug, category, price }),
    );
  } catch (error) {
    console.error('Folder exists.', error);
  }

  res.status(201).json({ name, slug, category, price });
});

router.get('/products', async (req, res) => {
  const productsDir = await fs.readdir('./products', { recursive: true });
  const jsonFiles = productsDir.filter((file) => file.endsWith('.json'));

  const products = await Promise.all(
    jsonFiles.map(async (file) => {
      const data = await fs.readFile(`./products/${file}`, 'utf-8');
      return JSON.parse(data);
    }),
  );

  res.status(200).json(products);
});

router.get('/product', async (req, res) => {
  const category = req.query.get('category');
  const slug = req.query.get('slug');
  const data = await fs.readFile(
    `./products/${category}/${slug}.json`,
    'utf-8',
  );

  res.status(200).json(data);
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
