const response = await fetch('http://localhost:3000/product', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ username: 'Enriconi' }),
});

const body = await response.text();
console.log(body);
