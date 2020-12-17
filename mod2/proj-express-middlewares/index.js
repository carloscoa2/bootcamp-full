import express from 'express';
import carrosRouter from './carrosRouter.js';
import winston from 'winston';

const app = express();
app.use(express.json());

app.use('/carros', carrosRouter);

app.use((req, res, next) => {
  console.log(new Date());
  next();
});

app.get('/teste', (req, res) => {
  res.end();
});

// async
app.post('/error', async (req, res, next) => {
  try {
    throw new Error('Error message async');
  } catch (err) {
    next(err);
  }
});

// tratamento de erros
app.get('/error', (req, res) => {
  throw new Error('Error message test');
});

app.use((err, req, res, next) => {
  console.log('Error 1');
  res.status(500).send('Ocorreu um erro');
});

// logs (revisar)
const { combine, printf, label, timestamp } = winston.format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: 'warn',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'my-log.log' }),
  ],
  format: combine(label({ label: 'my-app' }), timestamp()),
  myFormat,
});

logger.error('Error log');
logger.warn('warn log');
logger.info('info log');
logger.verbose('verbose log');
logger.debug('debug log');
logger.silly('silly log');

logger.log('info', 'hello with parameter');

// servindo arquivos estáticos
app.use(express.static('public'));
app.use('/images', express.static('public'));

app.listen(3000, () => {
  console.log('API Started');
});
