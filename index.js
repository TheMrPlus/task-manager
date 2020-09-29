var TaskManager = (function () {
  var Task = function (id, taskName, taskStart, taskEnd) {
    this.id = id;
    this.taskName = taskName;
    this.taskStart = taskStart;
    this.taskEnd = taskEnd;
  };
  var taskData = {
    tasks: [],
    completedTasks: [],
    failedTasks: [],
  };
  return {
    addTask: function (taskName, taskStart, taskEnd) {
      let ID;
      if (taskData.tasks.length > 0) {
        ID = taskData.tasks[taskData.tasks.length - 1].id + 1;
      } else {
        ID = 0;
      }

      var newTask = new Task(ID, taskName, taskStart, taskEnd);
      taskData.tasks.push(newTask);
      console.log(taskData);
      return newTask;
    },
    getTaskData: () => taskData,
    updateTasks: function (taskID, taskType) {
      var result = taskData.tasks.map((el) => el.id).indexOf(taskID);
      if (result !== -1) {
        result = taskData.tasks.splice(result, 1);
        if (taskType === "success") {
          taskData.completedTasks.push(result);
        } else if (taskType === "failure") {
          taskData.failedTasks.push(result);
        }
      }
      return result[0];
    },
  };
})();

var UIController = (function (taskManager) {
  const DOMStrings = {
    inputTaskName: ".task__name--input",
    inputTaskStart: ".task__start--input",
    inputTaskEnd: ".task__end--input",
    taskSubmit: ".task__submit",
    taskArea: ".task__area",
    taskDay: ".task__day",
    inputArea: ".input__area",
    completedTasks: ".success__tasks",
    failedTasks: ".failure__tasks",
  };

  let taskAreaDisplay = function () {
    //  console.log(taskManager.getTaskData().tasks.length === 0);
    if (taskManager.getTaskData().tasks.length === 0) {
      // document.querySelector(DOMStrings.inputArea).style.marginTop = "20%";
      document.querySelector(DOMStrings.taskArea).style.display = "none";
    } else {
      if (
        document.querySelector(DOMStrings.taskArea).style.display === "none"
      ) {
        document.querySelector(DOMStrings.inputArea).style.margin =
          "50px auto 0 auto";
        document.querySelector(DOMStrings.taskArea).style.display = "flex";
      }
    }
  };
  let completedAreaDisplay = function () {
    if (
      taskManager.getTaskData().completedTasks.length > 0 ||
      taskManager.getTaskData().failedTasks.length > 0
    ) {
      document.querySelector(DOMStrings.taskDay).style.display = "block";
      document.querySelector(DOMStrings.completedTasks).style.display = "block";
      document.querySelector(DOMStrings.failedTasks).style.display = "block";
    }
  };

  return {
    getInput: function () {
      return {
        taskName: document.querySelector(DOMStrings.inputTaskName).value,
        taskStart: document.querySelector(DOMStrings.inputTaskStart).value,
        taskEnd: document.querySelector(DOMStrings.inputTaskEnd).value,
      };
    },
    clearInput: () => {
      document.querySelector(DOMStrings.inputTaskName).value = "";
      document.querySelector(DOMStrings.inputTaskStart).value = "";
      document.querySelector(DOMStrings.inputTaskEnd).value = "";
    },
    getDOMStrings: () => DOMStrings,
    addListItem: function (newTask) {
      var task = `<div
          class="card text-white bg-dark mb-3 card-box"
          style="max-width: 18rem"
          id="${newTask.id}"
        >
          <div class="card-header">${newTask.taskName}</div>
          <div class="card-body">
            <h5 class="card-title">${newTask.taskStart}</h5>
            <h5 class="card-title">-</h5>
            <h5 class="card-title">${newTask.taskEnd}</h5>
            <div class="card-buttons">
              <button type="button" class="btn btn-outline-success card-button" id="success">
                Success!
              </button>
              <button type="button" class="btn btn-outline-danger card-button" id="failure">
                Failed!
              </button>
            </div>
          </div>
        </div>`;
      taskAreaDisplay();
      document
        .querySelector(DOMStrings.taskArea)
        .insertAdjacentHTML("beforeend", task);
    },
    updateListItem: function (selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
      taskAreaDisplay();
    },
    addCompletedItem: function (task, type) {
      completedAreaDisplay();
      var taskElement = `<div class="completed__task">
            <h3>${task.taskName}</h3>
            <h4>${task.taskStart} - ${task.taskEnd}</h4>
          </div>`;

      if (type === "success") {
        document
          .querySelector(DOMStrings.completedTasks)
          .insertAdjacentHTML("beforeend", taskElement);
      } else if (type === "failure") {
        document
          .querySelector(DOMStrings.failedTasks)
          .insertAdjacentHTML("beforeend", taskElement);
      }
    },
  };
})(TaskManager);

var controller = (function (UICtrl, taskManager) {
  var DOMcontroller = UICtrl.getDOMStrings();
  var setupEventListeners = function () {
    document
      .querySelector(DOMcontroller.taskSubmit)
      .addEventListener("click", (event) => {
        event.preventDefault();
        ctrlAddItem();
      });
    document
      .querySelector(DOMcontroller.taskArea)
      .addEventListener("click", ctrlUpdateItem);
  };
  var ctrlAddItem = function () {
    var input;

    input = UICtrl.getInput();
    if (
      input.taskName !== "" &&
      input.taskStart !== "" &&
      input.taskEnd !== ""
    ) {
      UICtrl.clearInput();
      var newTask = taskManager.addTask(
        input.taskName,
        input.taskStart,
        input.taskEnd
      );
      UICtrl.addListItem(newTask);
    }
  };
  var ctrlUpdateItem = function (event) {
    if (event.target.id === "success" || event.target.id === "failure") {
      var eventID = event.target.parentNode.parentNode.parentNode.id;
      var task = TaskManager.updateTasks(parseInt(eventID), event.target.id);
      console.log(task);
      UICtrl.updateListItem(eventID);
      UICtrl.addCompletedItem(task, event.target.id);
    }
  };
  var ctrlInit = () => {
    document.querySelector(DOMcontroller.taskArea).style.display = "none";
    document.querySelector(
      DOMcontroller.taskDay
    ).innerHTML = `<h1>${new Date().toLocaleString("en-us", {
      weekday: "long",
    })}</h1>`;
    document.querySelector(DOMcontroller.taskDay).style.display = "none";
    document.querySelector(DOMcontroller.failedTasks).style.display = "none";
    document.querySelector(DOMcontroller.completedTasks).style.display = "none";
  };
  return {
    init: () => {
      setupEventListeners();
      ctrlInit();
    },
  };
})(UIController, TaskManager);
controller.init();
