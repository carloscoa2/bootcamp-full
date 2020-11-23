window.addEventListener('load', start);

// Função de início que aciona os eventos
function start() {
  handleEvents();
}

// Arrays de números por extenso
const unidades = [
  'zero',
  'um',
  'dois',
  'três',
  'quatro',
  'cinco',
  'seis',
  'sete',
  'oito',
  'nove',
  'dez',
  'onze',
  'doze',
  'treze',
  'quatorze',
  'quinze',
  'dezesseis',
  'dezessete',
  'dezoito',
  'dezenove',
];

const dezenas = [
  '',
  '',
  'vinte',
  'trinta',
  'quarenta',
  'cinquenta',
  'sessenta',
  'setenta',
  'oitenta',
  'noventa',
];

const centenas = [
  'cem',
  'cento',
  'duzentos',
  'trezentos',
  'quatrocentos',
  'quinhentos',
  'seiscentos',
  'setecentos',
  'oitocentos',
  'novecentos',
];

// Inputs da aplicação
const numRange = document.querySelector('#numRange');
const numActual = document.querySelector('#numActual');
const numFull = document.querySelector('#numFull');

// Habilitando eventos
function handleEvents() {
  setValues();

  numRange.addEventListener('change', setValues);
}

// Seta os valores dos outros inputs
function setValues() {
  numActual.value = numRange.value;
  numFull.value = getNumFull();
}

// Função que retorna o número por extenso
function getNumFull() {
  const val = parseInt(numRange.value);
  let res = '';

  // Entre 0 e 19
  if (val >= 0 && val <= 19) {
    res = unidades[val];
    // Entre 20 e 99
  } else if (val >= 20 && val <= 99) {
    const str = val.toString();
    const digOne = parseInt(str[0]);
    const digTwo = parseInt(str[1]);

    if (digTwo === 0) {
      res = dezenas[digOne];
    } else {
      res = dezenas[digOne] + ' e ' + unidades[digTwo];
    }
    // Entre 100 e 999
  } else if (val >= 100 && val <= 999) {
    if (val === 100) {
      res = centenas[0];
    } else {
      const str = val.toString();
      const digOne = parseInt(str[0]);
      const digTwo = parseInt(str[1]);
      const digThree = parseInt(str[2]);
      const lastTwoDigits = parseInt(str.substring(1));

      if (lastTwoDigits === 0) {
        res = centenas[digOne];
      } else if (lastTwoDigits > 0 && lastTwoDigits <= 19) {
        res = centenas[digOne] + ' e ' + unidades[lastTwoDigits];
      } else {
        if (digThree === 0) {
          res = centenas[digOne] + ' e ' + dezenas[digTwo];
        } else {
          res =
            centenas[digOne] +
            ' e ' +
            dezenas[digTwo] +
            ' e ' +
            unidades[digThree];
        }
      }
    }
    // Fora do intervalo do app
  } else {
    res = 'Número fora do intervalo';
  }

  return res;
}
