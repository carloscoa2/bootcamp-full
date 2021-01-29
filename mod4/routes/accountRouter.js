import express from 'express';
import { accountModel } from '../models/accountModel.js';

const app = express();

// CREATE
app.post('/account', async (req, res) => {
  try {
    const account = new accountModel(req.body);

    await account.save();

    res.send(account);
  } catch (err) {
    res.status(500).send(err);
  }
});

// RETRIEVE
app.get('/account', async (_, res) => {
  try {
    const accounts = await accountModel.find({});
    res.send(accounts);
  } catch (err) {
    res.status(500).send(err);
  }
});

// UPDATE ACCOUNT BY ID
app.patch('/account/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const account = await accountModel.findByIdAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );

    res.send(account);
  } catch (err) {
    res.status(500).send(err);
  }
});

// DELETE ACCOUNT BY ID
app.delete('/account/:id', async (req, res) => {
  try {
    const account = await accountModel.findByIdAndDelete({
      _id: req.params.id,
    });

    if (!account) {
      res.status(404).send('Documento não encontrado na coleção');
    } else {
      res.status(200).send();
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// DEPÓSITO
app.post('/account/deposit', async (req, res) => {
  try {
    const { agencia, conta, valor } = req.body;

    const account = await accountModel.findOne({
      agencia: agencia,
      conta: conta,
    });

    if (!account) {
      res.status(404).send('Conta não encontrada');
    } else {
      account.balance += valor;
      await account.save();

      res.status(200).send('Saldo Atual: ' + account.balance);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// SAQUE
app.post('/account/withdraw', async (req, res) => {
  try {
    const { agencia, conta, valor } = req.body;

    const account = await accountModel.findOne({
      agencia: agencia,
      conta: conta,
    });

    if (!account) {
      res.status(404).send('Conta não encontrada');
    } else {
      const valorComTaxa = valor + 1; //taxa de 1 por saque
      if (account.balance < valorComTaxa) {
        res.status(406).send('Não há saldo suficiente');
      } else {
        account.balance -= valorComTaxa;
        await account.save();

        res.status(200).send('Saldo Atual: ' + account.balance);
      }
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// Consultar saldo
app.get('/account/balance', async (req, res) => {
  try {
    const { agencia, conta } = req.query;

    const account = await accountModel.findOne({
      agencia: agencia,
      conta: conta,
    });

    if (!account) {
      res.status(404).send('Conta não encontrada');
    } else {
      res.status(200).send('Saldo Atual: ' + account.balance);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// DELETE ACCOUNT BY AGENCY AND NUMBER
app.delete('/deleteAccount', async (req, res) => {
  try {
    const { agencia, conta } = req.body;

    if (!agencia || !conta) {
      res.status(400).send('Agência e conta não fornecidas ou inválidas');
      return;
    }

    const account = await accountModel.findOneAndDelete({
      agencia: agencia,
      conta: conta,
    });

    if (!account) {
      res.status(404).send('Conta não encontrada');
      return;
    }

    const activeAccounts = await accountModel
      .find({ agencia: agencia })
      .count();

    res
      .status(200)
      .send(`Contas ativas na agência ${agencia}: ${activeAccounts}`);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Transfer
app.post('/transfer', async (req, res) => {
  try {
    const { contaOrigem, contaDestino, valor } = req.body;

    const originAccount = await accountModel.findOne({ conta: contaOrigem });
    const destAccount = await accountModel.findOne({ conta: contaDestino });

    if (!originAccount || !destAccount) {
      res.status(404).send('Conta(s) não encontrada(s)');
      return;
    }

    // valor com taxa que será debitada da origem, mas
    // a conta destino recebe o valor normal (sem a taxa)
    let valorComTaxa = valor;
    if (originAccount.agencia !== destAccount.agencia) {
      valorComTaxa += 8;
      console.log(valorComTaxa);
    }

    // valida se a conta de origem tem saldo suficiente
    if (originAccount.balance < valorComTaxa) {
      res.status(406).send('Saldo insuficiente');
      return;
    }

    originAccount.balance -= valorComTaxa;
    originAccount.save();
    destAccount.balance += valor;
    destAccount.save();

    res.status(200).send('Saldo conta de origem: ' + originAccount.balance);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Average
app.post('/average', async (req, res) => {
  try {
    const { agencia } = req.body;

    const ag = await accountModel.findOne({ agencia: agencia });
    if (!ag) {
      res.status(404).send('Agência não encontrada');
      return;
    }

    const avg = await accountModel.aggregate([
      { $match: { agencia: agencia } },
      { $group: { _id: '$agencia', avg: { $avg: '$balance' } } },
    ]);

    const accAvg = avg[0].avg;

    res.status(200).send(`Média de saldo da agência ${agencia}: ${accAvg}`);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Lower balances
app.post('/lowerbalances', async (req, res) => {
  try {
    const { quant } = req.body;

    const accounts = await accountModel.aggregate([
      { $project: { _id: 0 } },
      { $sort: { balance: 1 } },
      { $limit: quant },
    ]);

    res.status(200).send(accounts);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Higher balances
app.post('/higherbalances', async (req, res) => {
  try {
    const { quant } = req.body;

    const accounts = await accountModel.aggregate([
      { $project: { _id: 0 } },
      { $sort: { balance: -1, name: 1 } },
      { $limit: quant },
    ]);

    res.status(200).send(accounts);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Private ==> NÃO FINALIZADO
app.post('/private', async (req, res) => {
  try {
    const toPrivate = await accountModel.aggregate([
      { $group: { _id: '$agencia', balance: { $max: '$balance' } } },
      { $project: { agencia: '$_id', _id: 0, name: 1, balance: 1 } },
      //   { $project: { _id: 1, name: 1, agencia: 1, balance: 1 } },
      //   { $sort: { balance: -1 } },
      //   {
      //     $group: {
      //       _id: '$agencia',
      //       firstSalesDate: { $first: '$balance' },
      //     },
      //   },
    ]);

    res.status(200).send(toPrivate);
  } catch (err) {
    res.status(500).send(err);
  }
});

export { app as accountRouter };
