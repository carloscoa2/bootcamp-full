import React, { useEffect, useState } from 'react';
import { YEARS, MONTHS } from './data/Dates';
import Button from './components/Button';
import Summary from './components/Summary';
import Todo from './components/Todo';

export default function App() {
  const [selectedYear, setSelectedYear] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedTodos, setSelectedTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      // Se filtro ainda não selecionado, não há o que buscar
      if (selectedYear === 0 || selectedMonth === 0) {
        return;
      }

      const res = await fetch(
        `http://localhost:3001/todos?year=${selectedYear}&month=${selectedMonth}`
      );
      const json = await res.json();
      setSelectedTodos(json);
    };

    fetchTodos();
  }, [selectedYear, selectedMonth]);

  const handleClick = (e, type) => {
    const id = e.target.id;

    if (type === 'year') {
      setSelectedYear(parseInt(id));
    } else {
      setSelectedMonth(parseInt(id));
    }
  };

  const countDoneTodos = () => {
    let counter = 0;

    for (let task of selectedTodos) {
      if (task.done) {
        counter++;
      }
    }

    return counter;
  };

  const countNotDoneTodos = () => {
    let counter = 0;

    for (let task of selectedTodos) {
      if (!task.done) {
        counter++;
      }
    }

    return counter;
  };

  const sortTodos = () => {
    const res = [...selectedTodos];

    // Coloca na ordem crescente de dia (mês e ano já são iguais)
    res.sort(function (a, b) {
      return a.day - b.day;
    });

    // Converte a data de yyyy-mm-dd para dd/mm/yyyy
    res.forEach((item) => {
      item.date = item.date.split('-').reverse().join('/');
    });

    return res;
  };

  return (
    <div className="container center">
      <h4>React Todos</h4>

      {/* Os Botões de Filtro */}
      <div>
        {YEARS.map((item, index) => {
          return (
            <Button
              key={index}
              value={item.id}
              label={item.label}
              type={item.type}
              style={
                selectedYear === item.id ? styles.selectedBtn : styles.yearBtn
              }
              handle={handleClick}
            />
          );
        })}
      </div>
      <div style={styles.appDiv}>
        {MONTHS.map((item, index) => {
          return (
            <Button
              key={index}
              value={item.id}
              label={item.label}
              type={item.type}
              style={
                selectedMonth === item.id ? styles.selectedBtn : styles.monthBtn
              }
              handle={handleClick}
            />
          );
        })}
      </div>

      {/* A lista de tarefas filtrada por mês e ano */}
      {selectedTodos.length > 0 && (
        <div style={styles.appDiv}>
          <Summary
            total={selectedTodos.length}
            done={countDoneTodos()}
            notDone={countNotDoneTodos()}
          />
          <ul style={styles.todoUl}>
            {sortTodos().map((item, index) => {
              return (
                <Todo
                  key={index}
                  date={item.date}
                  description={item.description}
                  style={item.done ? styles.doneTodo : styles.notDoneTodo}
                />
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

const styles = {
  yearBtn: {
    backgroundColor: 'darkblue',
    marginLeft: '10px',
  },
  appDiv: {
    marginTop: '20px',
  },
  monthBtn: {
    backgroundColor: 'darkred',
    marginLeft: '10px',
  },
  selectedBtn: {
    backgroundColor: 'black',
    marginLeft: '10px',
  },
  todoUl: {
    textAlign: 'left',
    marginLeft: '100px',
    marginRight: '100px',
    fontSize: '1.5em',
  },
  doneTodo: {
    backgroundColor: '#7be11e',
    margin: '10px',
  },
  notDoneTodo: {
    backgroundColor: '#ff7f50',
    margin: '10px',
  },
};
