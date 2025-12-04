import { createServer } from 'node:http';
import { Router } from './router.mjs';
import { customRequest } from './custom-request.mjs';
import { customResponse } from './custom-response.mjs';
import fs from 'node:fs/promises';

const router = new Router();

router.post('/product', async (req, res) => {
  const { slug, category } = req.body;
  try {
    await fs.mkdir(`./products/${category}`, { recursive: true });
  } catch {
    res.status(500).json({ error: 'Folder exists.' });
  }

  try {
    await fs.writeFile(
      `./products/${category}/${slug}.json`,
      JSON.stringify(req.body),
      { flag: 'wx' },
    );
    res.status(201).json(req.body);
  } catch (error) {
    res.status(500).json({ error: `${error.code} - Failed to save product.` });
  }
});

router.get('/products', async (req, res) => {
  try {
    const productsDir = await fs.readdir('./products', { recursive: true });
    const jsonFiles = productsDir.filter((file) => file.endsWith('.json'));

    const products = await Promise.all(
      jsonFiles.map(async (file) => {
        const data = await fs.readFile(`./products/${file}`, 'utf-8');
        return JSON.parse(data);
      }),
    );

    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ error: `${error.code} - Failed to search products.` });
  }
});

router.get('/product', async (req, res) => {
  const category = req.query.get('category');
  const slug = req.query.get('slug');

  try {
    const data = await fs.readFile(
      `./products/${category}/${slug}.json`,
      'utf-8',
    );
    res.status(200).json(JSON.parse(data));
  } catch (error) {
    res
      .status(404)
      .json({ error: `${error.code} - Failed to search product.` });
  }
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
