import express from 'express';
import winston from 'winston';
// import cors from 'cors';
import accountsRouter from './routes/accounts.js';
import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;

global.filename = 'accounts.json';

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

global.logger = winston.createLogger({
  level: 'silly',
  transports: [
    // prettier-ignore
    new (winston.transports.Console)(),
    // prettier-ignore
    new (winston.transports.File)({ filename: 'my-bank-api.log' }),
  ],
  // prettier-ignore
  format: combine(
    label({ label: 'my-bank-api' }),
    timestamp(),
    myFormat
  ),
});

const app = express();
app.use(express.json());
// liberação global do cors
// app.use(cors());
app.use(express.static('public'));
app.use('/accounts', accountsRouter);
app.listen(3000, async () => {
  try {
    await readFile(global.filename);
    logger.info('API started!');
  } catch (error) {
    const initialJson = {
      nextId: 1,
      accounts: [],
    };
    writeFile(global.filename, JSON.stringify(initialJson))
      .then(() => {
        logger.info('API started and file created!');
      })
      .catch((err) => {
        logger.error(err);
      });
  }
});
