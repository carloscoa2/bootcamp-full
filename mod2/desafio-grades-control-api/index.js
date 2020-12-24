import express from 'express';
import gradesRouter from './routes/grades.js';

global.filename = 'grades.json';

const app = express();

app.use(express.json());
app.use('/grades', gradesRouter);

app.listen(3000, () => {
  console.log('API iniciada');
});
