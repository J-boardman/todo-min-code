// STATE
let todoList = JSON.parse(localStorage.getItem('todos')) || [];
const setTodos = (data) => {
  todoList = data;
  localStorage.setItem('todos', JSON.stringify(todoList));
  render();
}

// CACHE DOM
const form = document.querySelector('form');
const template = document.querySelector('template');
const main = document.querySelector('main');

// RENDER
const render = () => {
  if(!todoList?.length) return main.innerHTML = '<h2>Nothing to do!</h2>'
  main.innerHTML = '';
  
  todoList.map(todo => {
    const temp = template.content.cloneNode(true);
    const tqs = (element) => temp.querySelector(element);
    tqs('article').dataset.key = todo.id;
    tqs('[data-title]').textContent = todo.title;
    tqs('[data-due-date]').textContent = todo.dueDate;
    tqs('input[type="text"]').value = todo.title;
    tqs('input[type="date"]').value = todo.dueDate.split("/").reverse().join("-");
    tqs('[data-edit-btn]').addEventListener('click', () => handleEdit(todo.id));
    tqs('[data-delete-btn]').addEventListener('click', () => handleDelete(todo.id));
    
    main.prepend(temp);
  })
};

render();

// UTILITY FUNCTIONS
const addTodo = (e) => {
  e.preventDefault();
  setTodos([...todoList, { 
    id: "id" + Math.random().toString(16).slice(2),
    title: e.target[0].value, 
    dueDate: parseDate(e.target[1].value)
  }]);
  form.reset();
}

const handleEdit = (id) => {
  const todoElement = document.querySelector(`[data-key="${id}"]`);
  const filteredTodos = todoList.filter(todo => todo.id !== id);

  const flipVisibility = () => todoElement
    .querySelectorAll('form, span, [data-edit-btn], [data-delete-btn]')
    .forEach(el => el.classList.toggle('hidden'));
  flipVisibility();

  todoElement.querySelector('input[type="text"]').focus();
  
  todoElement.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    setTodos([...filteredTodos, { id, title: e.target[0].value, dueDate: e.target[1].value }])
    flipVisibility();
  });
};

const handleDelete = (id) => setTodos(todoList.filter(todo => todo.id !== id));
const parseDate = (date) => new Date(date || new Date()).toLocaleDateString();

form.addEventListener('submit', addTodo);