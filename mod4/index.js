import mongoose from 'mongoose';

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

const accountSchema = mongoose.Schema({
  agencia: {
    type: Number,
    required: true,
  },
  conta: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    min: 0,
  },
});

mongoose.model('account', accountSchema);

const account = mongoose.model('account');

new account({
  agencia: 123,
  conta: 456,
  name: 'Carlos Teste',
  balance: 2,
})
  .save()
  .then(() => console.log('Inserido'))
  .catch((err) => console.log('Erro ao inserir: ' + err));
