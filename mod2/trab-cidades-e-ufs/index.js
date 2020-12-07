import { promises as fs } from 'fs';

init();

async function quantCidades(uf) {
  try {
    const cidades = JSON.parse(await fs.readFile(`./saida/${uf}.json`));

    const res = cidades.length;

    return res;
  } catch (err) {
    console.log(err);
  }
}

function compareCityQuant(a, b) {
  return b.quantCidades - a.quantCidades;
}

function compareNameLengthLow(a, b) {
  return a.length - b.length || a.localeCompare(b);
}

function compareNameLengthHigh(a, b) {
  return b.length - a.length || a.localeCompare(b);
}

async function cincoUfs(estados, type) {
  const arrayUfs = [];
  let res = [];
  for (const estado of estados) {
    const obj = {
      uf: estado.Sigla,
      quantCidades: await quantCidades(estado.Sigla),
    };
    arrayUfs.push(obj);
  }
  if (type === 'maiores') {
    res = arrayUfs.sort(compareCityQuant).slice(0, 5);
  } else {
    res = arrayUfs.sort(compareCityQuant).slice(-5);
  }

  console.log(res);
  return res;
}

async function cidadePorUf(uf, type) {
  try {
    const cidades = JSON.parse(await fs.readFile(`./saida/${uf}.json`));
    let res = '';

    if (type === 'maior') {
      res = cidades.sort(compareNameLengthHigh)[0];
    } else {
      res = cidades.sort(compareNameLengthLow)[0];
    }

    res = res + ' - ' + uf;

    return res;
  } catch (err) {
    console.log(err);
  }
}

async function cidadeNomeGeral(type) {
  try {
    const estados = JSON.parse(await fs.readFile('./dados/Estados.json'));
    const arrayCidades = [];
    let res = [];

    if (type === 'maior') {
      for (let estado of estados) {
        const cidade = await cidadePorUf(estado.Sigla, 'maior');
        arrayCidades.push(cidade);
      }

      res = arrayCidades.sort(compareNameLengthHigh);
    } else {
      for (let estado of estados) {
        const cidade = await cidadePorUf(estado.Sigla, 'menor');
        arrayCidades.push(cidade);
      }

      res = arrayCidades.sort(compareNameLengthLow);
    }

    console.log(res);

    return res;
  } catch (err) {
    console.log(err);
  }
}

async function init() {
  try {
    // leitura de dados
    const estados = JSON.parse(await fs.readFile('./dados/Estados.json'));
    const cidades = JSON.parse(await fs.readFile('./dados/Cidades.json'));

    // montando o conteúdo dos arquvios
    for (const estado of estados) {
      // preenchendo array de cidades
      let arrayCidades = [];
      for (const cidade of cidades) {
        if (estado.ID === cidade.Estado) {
          arrayCidades.push(cidade.Nome);
        }
      }

      // escrevendo as cidades do estado
      // prettier-ignore
      await fs.writeFile(`./saida/${estado.Sigla}.json`,JSON.stringify(arrayCidades));
    }

    // chamando funções
    // quantCidades('DF');
    // cincoUfs(estados, 'maiores');
    cincoUfs(estados, 'menores');
    // cidadePorUf('AC', 'maior');
    // cidadePorUf('AC', 'menor');
    // cidadeNomeGeral('maior');
    // cidadeNomeGeral('menor');
  } catch (err) {
    console.log(err);
  }
}
