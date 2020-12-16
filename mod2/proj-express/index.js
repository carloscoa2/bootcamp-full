import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/', (req, res) => {
  const a = 3;
  const b = 5;
  const resultado = a + b;
  res.send('Resultado: ' + resultado);
});

app.listen(3000, () => {
  console.log('API Started');
});
