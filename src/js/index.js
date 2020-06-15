
const list = document.querySelector('.list');
const input = document.querySelectorAll('.inputs__userdata');
const id = document.querySelector('.id');
const local = document.querySelector('.local');
const indexed = document.querySelector('.indexed');
const firstname = document.querySelector('.firstname');
const lastname = document.querySelector('.lastname');
const age = document.querySelector('.age');
const email = document.querySelector('.email');
const phone = document.querySelector('.phone');
const create = document.querySelector('.create');
const update = document.querySelector('.update');
const del = document.querySelector('.del');
const data = JSON.parse(localStorage.getItem('person_data'));
let isId = false;
let isIndexedDb = false;
let state = [];
let store;
let persons;

//---working with indexeddb---///
let db;
let dbReq = indexedDB.open('myDB', 1);
dbReq.onupgradeneeded = event => {
  db = event.target.result;
  persons = db.createObjectStore('persons', { keyPath: 'id' });
};
dbReq.onsuccess = event => {
  db = event.target.result;
};
dbReq.onerror = event => {
  alert('error opening database ' + event.target.errorCode);
};

function addIndexDb(db, id, firstname, lastname, age, email, phone) {
  let tx = db.transaction(['persons'], 'readwrite');
  store = tx.objectStore('persons');
  const Person = function() {
    this.id = id.value;
    this.firstname = firstname.value;
    this.lastname = lastname.value;
    this.age = age.value;
    this.email = email.value;
    this.phone = phone.value;
  };
  let personInd = new Person();
  store.add(personInd);
  tx.oncomplete = () => {
    console.log('stored note!');
  };
  tx.onerror = event => {
    alert('error storing note ' + event.target.errorCode);
  };
}

function updateIndexDb(id) {
  let tx = db.transaction(['persons'], 'readonly');
  let store = tx.objectStore('persons');
  let req = store.get(id.value);
  req.onsuccess = event => {
    let gotten = event.target.result;
    if (gotten) {
      gotten.firstname = firstname.value;
      gotten.lastname = lastname.value;
      gotten.age = age.value;
      gotten.email = email.value;
      gotten.phone = phone.value;
      var request = db
        .transaction(['persons'], 'readwrite')
        .objectStore('persons')
        .delete(id.value);
      let tx = db.transaction(['persons'], 'readwrite');
      store = tx.objectStore('persons');
      store.add(gotten);
      tx.onerror = event => {
        alert('error storing note ' + event.target.errorCode);
      };
      request.onsuccess = function(event) {
        renderIndexDb(db);
      };
    }
  };
}

function delIndexDb(id) {
  var request = db
    .transaction(['persons'], 'readwrite')
    .objectStore('persons')
    .delete(id.value);
  request.onsuccess = function(event) {
    // It's gone!
  };
}

function renderIndexDb(db) {
  let tx = db.transaction(['persons'], 'readonly');
  let store = tx.objectStore('persons');
  let req = store.openCursor();
  let allPersons = [];
  req.onsuccess = event => {
    let cursor = event.target.result;
    if (cursor != null) {
      allPersons.push(cursor.value);
      cursor.continue();
    } else {
      list.innerHTML = '';
      for (let i = 0; i < allPersons.length; i++) {
        const newLi = document.createElement('li');
        newLi.innerHTML = `<div class="div">${allPersons[i].id}</div><div class="div">${allPersons[i].firstname}</div><div class="div">${allPersons[i].lastname}</div><div class="div">${allPersons[i].age}</div><div class="div">${allPersons[i].email}</div><div class="div">${allPersons[i].phone}</div>`;
        newLi.className = 'li';
        list.append(newLi);
      }
    }
  };
  req.onerror = event => {
    alert('error in cursor request ' + event.target.errorCode);
  };
}
/////////////////////////////
function createPerson(id, firstname, lastname, age, email, phone) {
  const Person = function() {
    this.id = id.value;
    this.firstname = firstname.value;
    this.lastname = lastname.value;
    this.age = age.value;
    this.email = email.value;
    this.phone = phone.value;
  };
  let person = new Person();
  state.push(person);
  return person;
}

function updatePerson(id, firstname, lastname, age, email, phone) {
  for (let i = 0; i < state.length; i++) {
    if (id === state[i].id) {
      state[i].firstname = firstname;
      state[i].lastname = lastname;
      state[i].age = age;
      state[i].email = email;
      state[i].phone = phone;
      return state[i];
    }
  }
  return state;
}

function deletePerson(id) {
  for (let i = 0; i < state.length; i++) {
    if (id.value === state[i].id) {
      state.splice(i, 1);
    }
  }
  return state;
}

function sync() {
  render();
  localStorage.setItem('person_data', JSON.stringify(state));
}

function validate() {
  const regex = /\D/g;
  if (regex.test(this.value)) {
    id.value = '';
    age.value = '';
    alert('Please, enter only digits!!!');
  }
}
input[0].addEventListener('change', validate);
input[3].addEventListener('change', validate);

function render() {
  list.innerHTML = '';
  for (let i = 0; i < state.length; i++) {
    const newLi = document.createElement('li');
    newLi.innerHTML = `<div class="div">${state[i].id}</div><div class="div">${state[i].firstname}</div><div class="div">${state[i].lastname}</div><div class="div">${state[i].age}</div><div class="div">${state[i].email}</div><div class="div">${state[i].phone}</div>`;
    newLi.className = 'li';
    list.append(newLi);
  }
  for (let i = 0; i < input.length; i++) {
    input[i].value = '';
  }
}

local.addEventListener('click', function() {
  isIndexedDb = false;
  render();
});

indexed.addEventListener('click', function() {
  isIndexedDb = true;
  renderIndexDb(db);
});

window.onload = function() {
  if (data !== null) {
    state = data;
    render();
  }
};

create.addEventListener('click', function() {
  if (
    id.value === '' ||
    firstname.value === '' ||
    lastname.value === '' ||
    age.value === '' ||
    email.value === '' ||
    phone.value === ''
  ) {
    alert('Some fields are empty!!!');
  } else {
    if (isIndexedDb === false) {
      for (let i = 0; i < state.length; i++) {
        if (id.value === state[i].id) {
          isId = true;
        }
      }
      if (isId === true) {
        alert('This id is already exist!!!');
        for (let i = 0; i < input.length; i++) {
          input[i].value = '';
        }
        isId = false;
      } else {
        createPerson(id, firstname, lastname, age, email, phone);
        sync();
      }
    } else {
      addIndexDb(db, id, firstname, lastname, age, email, phone);
      renderIndexDb(db);
      for (let i = 0; i < input.length; i++) {
        input[i].value = '';
      }
    }
  }
});

update.addEventListener('click', function() {
  if (
    id.value === '' ||
    firstname.value === '' ||
    lastname.value === '' ||
    age.value === '' ||
    email.value === '' ||
    phone.value === ''
  ) {
    alert('Some fields are empty!!!');
  } else {
    if (isIndexedDb === false) {
      updatePerson(
        id.value,
        firstname.value,
        lastname.value,
        age.value,
        email.value,
        phone.value
      );
      sync();
    } else if (isIndexedDb === true) {
      updateIndexDb(id);
      renderIndexDb(db);
      for (let i = 0; i < input.length; i++) {
        input[i].value = '';
      }
    }
  }
});

del.addEventListener('click', function() {
  if (isIndexedDb === false) {
    deletePerson(id);
    sync();
  } else if (isIndexedDb === true) {
    delIndexDb(id);
    renderIndexDb(db);
    for (let i = 0; i < input.length; i++) {
      input[i].value = '';
    }
  }
});
