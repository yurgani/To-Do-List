const addButton = document.querySelector('.in'); //  кнопка добавления задачи
const inputField = document.querySelector('.in_t');//поле ввода задачи
const taskList = document.querySelector('.tasklist');//список задач на странице


const modal = document.querySelector('.modal');//окно 
const closeModal = document.querySelector('.close');//закрытие окна




function openModal() {
  modal.classList.remove("modal_close")
  modal.classList.add("modal_open")
  
}

closeModal.addEventListener('click', () => { 
  modal.classList.remove("modal_open")
  modal.classList.add("modal_close")
});






// Счетчик выполненных задач
let completedTasksCount = 0;


// Получение сохраненных задач из localStorage и добавление их на страницу
let savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];//массив с локального хранилища
savedTasks.forEach((task) => {
  if (task.startsWith('completed:')) {
    addTask(task.substr(10), true);
    // completedTasksCount++;
  } else {
    addTask(task);
  }
});

// Функция добавления задачи на страницу
function addTask(taskText, isCompleted = false) {

  const taskListItems = taskList.querySelectorAll('li');
  for (let i = 0; i < taskListItems.length; i++) {
    if (taskListItems[i].querySelector('span').innerText === taskText) {
      openModal();
      return;
    }
  }



  const newTask = document.createElement('li');//элемет списка для задачи
  const taskSpan = document.createElement('span');//  текст задачи
  taskSpan.innerText = taskText;// Добавление текста задачи в span




  if (isCompleted) {
    taskSpan.classList.add("completed");
  }

  const buttonStorage = document.createElement('div');//  контейнер для кнопок задачи
  
  const taskButton = document.createElement('button');//  кнопка для отметки задачи выполненной
  taskButton.classList.add('button1');
  taskButton.addEventListener('click', completeTask);

  const deleteButton = document.createElement('button');//  кнопка для удаления задачи
  deleteButton.classList.add('button2'); 
  deleteButton.addEventListener('click', deleteTask);

  buttonStorage.appendChild(taskButton);
  buttonStorage.appendChild(deleteButton);

  
  newTask.appendChild(taskSpan);// Добавление текста  задачи в элемент списка
  newTask.appendChild(buttonStorage);//// Добавление дива с кнопками в    элемент списка

  taskList.appendChild(newTask);

  // Сохранение задачи в localStorage
  if (!isCompleted && !savedTasks.includes(taskText)) {
    savedTasks.push(taskText);
    localStorage.setItem('tasks', JSON.stringify(savedTasks));
  }

  // Очистка поля ввода
  inputField.value = '';


}

// Функция для отметки выполненной задачи
function completeTask() {
  const taskSpan = this.parentNode.parentNode.querySelector('span');
  if (taskSpan.classList.contains("completed")) {
    taskSpan.classList.remove("completed");
    taskSpan.classList.add("uncompleted");
    completedTasksCount--;
  } else {
    taskSpan.classList.remove("uncompleted");
    taskSpan.classList.add("completed");
    completedTasksCount++;
  }
  
  savedTasks = Array.from(taskList.children).map((task) => {
    const taskSpan = task.querySelector('span');
    if (taskSpan.classList.contains("completed")) {
      return `completed:${taskSpan.innerText}`;
    } else {
      return taskSpan.innerText;
    }
    
  });
  
  localStorage.setItem('tasks', JSON.stringify(savedTasks));




  // Проверка на выполнение всех задач и запуск конфетти
  if (completedTasksCount === taskList.children.length ) {
    startConfetti();
    
  }
}


// Функция для удаления задачи
function deleteTask() {
  const task = this.parentNode.parentNode;
  task.remove();
  if (task.querySelector('span').classList.contains("completed")) {
    completedTasksCount--;
    console.log(taskList.children.length,completedTasksCount)
  }
  savedTasks = Array.from(taskList.children).map((task) => {
    const taskSpan = task.querySelector('span');
    if (taskSpan.classList.contains("completed")) {
      return `completed:${taskSpan.innerText}`;
    } else {
      return taskSpan.innerText;
    }
  });
  localStorage.setItem('tasks', JSON.stringify(savedTasks));
}

// Добавление задачи по клику на кнопку
addButton.addEventListener('click', () => {
  const taskText = inputField.value.trim();
  if (taskText !== '') {
    addTask(taskText);
  }
});

// Добавление задачи по нажатию на Enter
inputField.addEventListener('keydown', (event) => {
  if (event.keyCode === 13) {
    const taskText = inputField.value.trim();
    if (taskText !== '') {
      addTask(taskText);
    }
  }
});



// Функция для запуска анимации конфетти - https://confetti.js.org/more.html#realistic
function startConfetti() {
  const duration = 2500,
    animationEnd = Date.now() + duration,
    defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }
  const interval = setInterval(function() {
  const timeLeft = animationEnd - Date.now();
  if (timeLeft <= 0) {
    return clearInterval(interval);
  }
  
  const particleCount = 50 * (timeLeft / duration);
  
  confetti(
    Object.assign({}, defaults, {
      particleCount,
      origin: {x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    })
    );
  confetti(
    Object.assign({}, defaults, {
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    })
    );
  }, 250);
}





