import ev from './events.js';

ev.on('testEvent', () => {
  console.log('ouviu também');
});

ev.emit('testEvent', 'bla bla bla');
