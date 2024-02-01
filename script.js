const toggleButton = document.querySelector(".btn.theme-btn");

const inputTodo = document.getElementById("todo-input");
const addTodoButton = document.querySelector(".add-todo");
const listTodos = document.querySelector(".todos");

const countItems = document.querySelector(".count-left");

const activeButton = document.getElementById("active");
const allButton = document.getElementById("all");
const completedButton = document.getElementById("completed");
const clearCompletedButton = document.getElementById("clear-completed");

const taskData = JSON.parse(localStorage.getItem("data")) || [];

let currentTask = {};

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
    todoItem.className = `todo-item ${completed ? "completed" : ""}`;
    todoItem.draggable = true;
    todoItem.innerHTML = `
          <label class="check-label">
            <input type="checkbox" ${completed ? "checked" : ""}>
            <span class="check-round"></span>
          </label>
          <li class="todo">${name}</li>
          <button class="btn delete" onclick="deleteTask(this)"><img src="./images/icon-cross.svg" alt="cross svg"></button>
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

clearCompletedButton.addEventListener("click", () => {
  taskData.filter((task)=>task.completed).map((task)=>{
    const dataArrIndex = taskData.findIndex(
      (item) => item.id === task.id
    );
    taskData.splice(dataArrIndex, 1);
  })
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
