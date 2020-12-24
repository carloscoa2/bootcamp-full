import express from 'express';
import { promises as fs } from 'fs';

const router = express.Router();

router.get('/', async (_, res) => {
  try {
    const allGrades = await fs.readFile(global.filename);

    res.send(allGrades);
  } catch (err) {
    console.log(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const allGrades = JSON.parse(await fs.readFile(global.filename));

    // prettier-ignore
    const grade = allGrades.grades.find(
      (g) => g.id === parseInt(req.params.id)
    );

    res.send(grade);
  } catch (err) {
    console.log(err);
  }
});

router.post('/', async (req, res) => {
  try {
    // Recebendo parâmetros
    const newGrade = req.body;

    // Validando os campos
    if (
      !newGrade.student ||
      !newGrade.subject ||
      !newGrade.type ||
      newGrade.value == null
    ) {
      res.send('Os atributos student, subject, type e value são obrigatórios.');
    }

    // Lendo o arquivo
    const allGrades = JSON.parse(await fs.readFile(global.filename));

    // Novo registro e sobrescrevendo arquivo
    const newGradeFile = {
      id: allGrades.nextId++,
      ...newGrade,
    };
    allGrades.grades.push(newGradeFile);

    await fs.writeFile(global.filename, JSON.stringify(allGrades, null, 2));

    // Retornando o objeto que foi criado
    res.send(newGradeFile);
  } catch (err) {
    console.log(err);
  }
});

router.put('/', async (req, res) => {
  try {
    // Recebendo parâmetros
    const updatedGrade = req.body;

    // Validando os campos
    if (
      !updatedGrade.id ||
      !updatedGrade.student ||
      !updatedGrade.subject ||
      !updatedGrade.type ||
      updatedGrade.value == null
    ) {
      res.send(
        'Os atributos ID, student, subject, type e value são obrigatórios.'
      );
    }

    // Lendo o arquivo
    const allGrades = JSON.parse(await fs.readFile(global.filename));

    // Encontrando o registro
    const index = allGrades.grades.findIndex((g) => g.id === updatedGrade.id);

    // Verificando se encontrou o registro
    if (index === -1) {
      res.send('Registro não encontrado, índice: ' + index);
      return;
    }

    // Atualizando o registro
    allGrades.grades[index].student = updatedGrade.student;
    allGrades.grades[index].subject = updatedGrade.subject;
    allGrades.grades[index].type = updatedGrade.type;
    allGrades.grades[index].value = updatedGrade.value;

    // Salvando com o registro atualizado
    await fs.writeFile(global.filename, JSON.stringify(allGrades, null, 2));

    res.send(updatedGrade);
  } catch (err) {
    console.log(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // Lendo arquivo
    const allGrades = JSON.parse(await fs.readFile(global.filename));

    // Filtrando registros diferentes do id fornecido
    allGrades.grades = allGrades.grades.filter(
      (g) => g.id !== parseInt(req.params.id)
    );

    // Reescrevendo o arquivo
    await fs.writeFile(global.filename, JSON.stringify(allGrades, null, 2));

    res.end();
  } catch (err) {
    console.log(err);
  }
});

export default router;
