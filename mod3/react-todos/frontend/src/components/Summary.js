import React from 'react';

export default function Summary({ total, done, notDone }) {
  return (
    <h5>
      Total de tarefas: <span style={styles.all}>{total}</span> Tarefas
      cumpridas: <span style={styles.done}>{done}</span> Tarefas não cumpridas:{' '}
      <span style={styles.notDone}>{notDone}</span>
    </h5>
  );
}

const styles = {
  all: {
    color: 'darkblue',
    fontWeight: 'bold',
  },
  done: {
    color: 'darkgreen',
    fontWeight: 'bold',
  },
  notDone: {
    color: 'darkred',
    fontWeight: 'bold',
  },
};
