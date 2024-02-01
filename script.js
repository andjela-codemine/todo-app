const toggleButton = document.querySelector(".btn.theme-btn.light");
const toggleButtonImg = document.querySelector(".btn.theme-btn.light img");
const body = document.querySelector("body");

const inputTodo = document.getElementById("todo-input");
const addTodoButton = document.querySelector(".add-todo");
const listTodos = document.querySelector(".todos");
const h1 = document.querySelector("h1");
const form = document.querySelector("form");
const span = document.querySelector(".round");

const countItems = document.querySelector(".count-left");

const activeButton = document.getElementById("active");
const allButton = document.getElementById("all");
const completedButton = document.getElementById("completed");
const clearCompletedButton = document.getElementById("clear-completed");

const taskData = JSON.parse(localStorage.getItem("data")) || [];

let currentTask = {};

toggleButton.addEventListener("click", () => {
  if (toggleButton.classList.contains("light")) {
    toggleButton.classList.remove("light");
    toggleButtonImg.src = "./images/icon-sun.svg";
    body.classList.add("dark");
    inputTodo.classList.add("dark");
    addTodoButton.classList.add("dark");
    listTodos.classList.add("dark");
    h1.classList.add("dark");
    form.classList.add("dark");
    span.classList.add("dark");
  } else {
    toggleButton.classList.add("light");
    toggleButtonImg.src = "./images/icon-moon.svg";
    body.classList.remove("dark");
    inputTodo.classList.remove("dark");
    addTodoButton.classList.remove("dark");
    listTodos.classList.remove("dark");
    h1.classList.remove("dark");
    form.classList.remove("dark");
    span.classList.remove("dark");
  }
});

addTodoButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (inputTodo.value === "") return;
  const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);

  const taskObj = {
    id: `${inputTodo.value.toLowerCase().split(" ").join("-")}`,
    name: `${inputTodo.value}`,
    completed: false,
  };

  if (dataArrIndex === -1) {
    taskData.unshift(taskObj);
  } else {
    taskData[dataArrIndex] = taskObj;
  }
  localStorage.setItem("data", JSON.stringify(taskData));
  updateTaskContainer(taskData);
  reset();
});

const updateTaskContainer = (tasks = taskData) => {
  listTodos.innerHTML = "";

  tasks.forEach(({ id, name, completed }) => {
    const todoItem = document.createElement("div");
    todoItem.className = `todo-item ${
      body.classList.contains("dark") ? "dark" : ""
    } ${completed ? "completed" : ""}`;
    todoItem.draggable = true;
    todoItem.innerHTML = `
          <label class="check-label">
            <input type="checkbox" ${completed ? "checked" : ""}>
            <span class="check-round"></span>
          </label>
          <li class="todo">${name}</li>
          <button class="btn delete ${
            body.classList.contains("dark") ? "dark" : ""
          }" onclick="deleteTask(this)">
          <img src="./images/icon-cross.svg" alt="cross svg" class="cross-icon">
          </button>
        `;
    listTodos.appendChild(todoItem);

    const checkbox = todoItem.querySelector("input[type='checkbox']");

    checkbox.addEventListener("change", () => {
      taskData = taskData.map((task) => {
        if (task.id === id) {
          task.completed = !task.completed;
        }
        return task;
      });
      localStorage.setItem("data", JSON.stringify(taskData));
      updateCountItems();
    });
  });
};

const reset = () => {
  inputTodo.value = "";
  currentTask = {};
};
// const updateCountItems = () => {
//   const remainingCount = taskData.filter((task) => !task.completed).length;
//   countItems.textContent = `${remainingCount} item${remainingCount !== 1 ? 's' : ''} left`;
// };

clearCompletedButton.addEventListener("click", () => {
  taskData
    .filter((task) => task.completed)
    .map((task) => {
      const dataArrIndex = taskData.findIndex((item) => item.id === task.id);
      taskData.splice(dataArrIndex, 1);
    });
  localStorage.setItem("data", JSON.stringify(taskData));
  updateTaskContainer();
});

const deleteTask = (buttonEl) => {
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );

  buttonEl.parentElement.remove();
  taskData.splice(dataArrIndex, 1);
  localStorage.setItem("data", JSON.stringify(taskData));
};

allButton.addEventListener("click", () => updateTaskContainer(taskData));
activeButton.addEventListener("click", () =>
  updateTaskContainer(taskData.filter((task) => !task.completed))
);
completedButton.addEventListener("click", () =>
  updateTaskContainer(taskData.filter((task) => task.completed))
);
