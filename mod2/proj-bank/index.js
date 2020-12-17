import express from 'express';
import accountsRouter from './routes/accounts.js';
import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;

global.filename = 'accounts.json';

const app = express();
app.use(express.json());

app.use('/accounts', accountsRouter);

app.listen(3000, async () => {
  try {
    await readFile(global.filename);
    console.log('API started!');
  } catch (error) {
    const initialJson = {
      nextId: 1,
      accounts: [],
    };
    writeFile(global.filename, JSON.stringify(initialJson))
      .then(() => {
        console.log('API started and file created!');
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
