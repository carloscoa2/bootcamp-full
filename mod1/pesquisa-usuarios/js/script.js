// Data from json
let res = JSON.parse(data);

// Data formatted
let users = res.results.map((item) => {
  let nameItem = item.name.first + ' ' + item.name.last;
  return {
    name: nameItem,
    gender: item.gender,
    picture: item.picture.thumbnail,
    age: item.dob.age,
    nameSearch: nameItem.toLocaleLowerCase(),
  };
});
console.log(users);

// Search input and search button
const searchInput = document.querySelector('#searchInput');
const searchBtn = document.querySelector('#searchBtn');

// Results
const userResults = document.querySelector('#userResults');
const calcResults = document.querySelector('#calcResults');

// Start function
function start() {
  searchInput.addEventListener('keyup', checkEmpty);
  searchBtn.addEventListener('click', filterUsers);
}

function flushInput() {
  searchInput.value = '';
  searchBtn.disabled = true;
}

function checkEmpty() {
  const val = searchInput.value;
  if (val == ' ' || val == '') {
    flushInput();
  } else {
    if (event.key == 'Enter') {
      filterUsers();
      flushInput();
      return;
    }
    searchBtn.disabled = false;
  }
}

function filterUsers() {
  const val = searchInput.value;
  flushInput();

  const filteredUsers = users.filter((item) => {
    return item.nameSearch.includes(val.toLocaleLowerCase());
  });

  userResults.innerHTML = getUsersResults(filteredUsers);
  calcResults.innerHTML = getCalcResults(filteredUsers);
}

function getUsersResults(filteredUsers) {
  const tam = filteredUsers.length;
  let res = `<h3>${tam} usuário(s) encontrado (s)</h3>`;

  filteredUsers.forEach((item) => {
    res += `
    <div class="userItem">
      <img src="${item.picture}">
      <span>${item.name}</span>
      <span>, ${item.age} anos</span>
    </div>
  `;
  });

  return res;
}

function getCalcResults(filteredUsers) {
  let res = '<h3>Estatísticas</h3>';

  let masc = 0;
  let fem = 0;
  let sumAges = 0;
  let aveAges = 0;

  filteredUsers.forEach((item) => {
    if (item.gender == 'male') {
      masc++;
    } else {
      fem++;
    }
    sumAges += item.age;
  });

  if (filteredUsers.length != 0) {
    aveAges = (sumAges / filteredUsers.length).toFixed(2);
  }

  res += `
    <p>Sexo masculino: ${masc}</p>
    <p>Sexo feminino: ${fem}</p>
    <p>Soma das idades: ${sumAges}</p>
    <p>Média das idades: ${aveAges}</p>
  `;

  return res;
}

start();
