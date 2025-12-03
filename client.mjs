// const response = await fetch('http://localhost:3000/product', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({
//     name: 'iPhone 15 PRO',
//     slug: 'iphone-15-pro',
//     category: 'phone',
//     price: 999.9,
//   }),
// });

// const response = await fetch('http://localhost:3000/products', {
//   method: 'GET',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

const response = await fetch(
  'http://localhost:3000/product?category=notebook&slug=macbook-m4-pro',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
);

const body = await response.json();
console.log(body);
