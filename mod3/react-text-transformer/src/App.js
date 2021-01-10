import React, { useState } from 'react';
import Input from './components/Input';

export default function App() {
  const [userInput, setUserInput] = useState('');

  const updateInputs = (e) => {
    const value = e.target.value;
    setUserInput(value);
  };

  const reverse = (text) => {
    return text.split('').reverse().join('');
  };

  const toNumeric = (text) => {
    // prettier-ignore
    return text
            .toUpperCase()
            .replaceAll('O', '0')
            .replaceAll('L', '1')
            .replaceAll('E', '3')
            .replaceAll('A', '4')
            .replaceAll('S', '5')
            .replaceAll('T', '7');
  };

  const toCSV = (text) => {
    if (text === '') {
      return text;
    }

    const array = text.trim().split(' ');

    let res = '';
    for (let i = 0; i < array.length; i++) {
      // adiciona as aspas a cada item
      res += '"' + array[i] + '"';
      // se não for o último item, adiciona ponto e vírgula
      if (i !== array.length - 1) {
        res += ';';
      }
    }

    return res;
  };

  const toSlug = (text) => {
    return text.toLowerCase().split(' ').join('-');
  };

  const onlyVowels = (text) => {
    return text.replace(/[bcdfghjklmnpqrstvwxyz]/gi, '');
  };

  const onlyConsonants = (text) => {
    return text.replace(/[aeiou]/gi, '');
  };

  const toVariable = (text) => {
    const array = text.trim().split(' ');

    if (array.length === 1) {
      return text.toLowerCase();
    }

    let res = '';
    res += array[0].toLowerCase();

    for (let i = 1; i < array.length; i++) {
      res += array[i].charAt(0).toUpperCase() + array[i].slice(1).toLowerCase();
    }

    return res;
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col s12">
          <h4 style={styles.titulo}>react-text-transformer</h4>
          <div>
            <label>Entre com algum texto:</label>
            <input type="text" id="textoEntrada" onChange={updateInputs} />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col s12">
          <h5 style={styles.titulo}>Transformações</h5>

          <Input label="Texto invertido" value={reverse(userInput)} />
          <Input label="Texto numérico" value={toNumeric(userInput)} />
          <Input label="CSV" value={toCSV(userInput)} />
          <Input label="Slug" value={toSlug(userInput)} />
          <Input label="Somente vogais" value={onlyVowels(userInput)} />
          <Input label="Somente consoantes" value={onlyConsonants(userInput)} />
          <Input label="Variável" value={toVariable(userInput)} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  titulo: {
    textAlign: 'center',
  },
};
