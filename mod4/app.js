import express from 'express';
import mongoose from 'mongoose';

import { accountRouter } from './routes/accountRouter.js';

// Conectar ao MongoDB pelo mongoose
(async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://carlos:igti123@cluster0.ytycr.mongodb.net/bank?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log('Conectado ao MongoDB');
  } catch (err) {
    console.log('Erro ao conectar no MongoDB: ' + err);
  }
})();

const app = express();

app.use(express.json());
app.use(accountRouter);

app.listen(3000, () => console.log('API iniciada'));
