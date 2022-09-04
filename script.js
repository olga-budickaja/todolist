class Task {
    constructor(text) {
        this.text = text;
        this.completedTask = false;
    }
}

let dataTasks = {
    tasks: [],

    get allTasks() {
        return this.tasks;
    },

    get inCompleteTasks() {
        return this.tasks.filter(task => task.completedTask == false);
    },

    add(task) {
        this.tasks.push(task);
        this.save();
    },

    delete(task) {
        let indexTask = this.tasks.indexOf(task);
        this.tasks.splice(indexTask, 1);
        this.save();
    },

    save() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    },

    open() {
        this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    }
}

class TasksListShow {
    item;
    dataTasks;

    constructor(item) {
        this.item = item;
        dataTasks = dataTasks;
    }

    #listTask(itemsTask) {
        this.item.innerHTML = "";

        itemsTask.forEach(task => {
            task.createIn(this.item);
        });
    }

    listAll() {
        let taskItems = [];
        let tasks = dataTasks.allTasks;

        if (tasks.length == 0) return;

        tasks.forEach(task => {
            taskItems.push(new TasksShow(task));
        });
        this.#listTask(taskItems);
    }

    listInComplete() {
        let taskItems = [];
        let tasks = dataTasks.inCompleteTasks;

        if (tasks.length == 0) return;

        tasks.forEach(task => {
            taskItems.push(new TasksShow(task));
        });
        this.#listTask(taskItems);
    }
}

class TasksShow {
    constructor(task) {
        this.task = task;
        this.div = null;
    }

    createIn(item) {
        this.div = document.createElement("div");
        this.div.classList.add("list__task-new");

        let input = document.createElement("input");
        input.classList.add("list__task-input");
        input.addEventListener("click", this.status.bind(this));
        input.type = "checkbox";

        let p = document.createElement("p");
        p.innerText = this.task.text;

        let button = document.createElement("button");
        button.classList.add("list__delete");
        button.innerHTML = `<img src="icons/basket.png" alt="delete basket">`;
        button.addEventListener("click", this.delete.bind(this));

        this.div.append(input);
        this.div.append(p);
        this.div.append(button);

        if (this.task.completedTask) {
            this.div.classList.add("completed");
            input.checked = true;
        }
        item.append(this.div);
    }

    status(item) {
        this.task.completedTask = !this.task.completedTask;
        dataTasks.save();
        this.div.classList.toggle("completed");
    }

    delete() {
        dataTasks.delete(this.task);
        this.div.remove();
    }
}

let listInputTask = document.querySelector("#list__input-task"),
    listInputButton = document.querySelector("#list__input-button"),
    listTaskStart = document.querySelector("#list__task-start"),
    listButtonsAll = document.querySelector("#list__buttons-all"),
    listButtonsIncomplete = document.querySelector("#list__buttons-incomplete"),
    listTask = document.querySelector(".list__task");

dataTasks.open();

let tasksListShow = new TasksListShow(listTask);

listInputButton.addEventListener("click", addTask);
listButtonsAll.addEventListener("click", showAllTasks);
listButtonsIncomplete.addEventListener("click", showIncompleteTask);

window.addEventListener("load", function() {
    tasksListShow.listAll();
});

listInputTask.addEventListener("keydown", function (e) {
    if (e.code == "Enter") addTask();
});

function addTask() {
    if (listInputTask.value) {
        if (!listTaskStart.hidden) listTaskStart.hidden = true;

        let newTask = new Task(listInputTask.value);
        dataTasks.add(newTask);
        tasksListShow.listAll();

        listInputTask.value = ""
    } else {
        alert("add task");
    }
}

function showAllTasks() {
    tasksListShow.listAll();
}

function showIncompleteTask() {
    tasksListShow.listInComplete();
}

