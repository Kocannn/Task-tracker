const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'tasks.json');

function loadTasks() {
    if (fs.existsSync(FILE_PATH)) {
        const data = fs.readFileSync(FILE_PATH, 'utf8');
        return JSON.parse(data);
    }
    return [];
}

function saveTasks(tasks) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2), 'utf8');
}

function addTask(description) {
    const tasks = loadTasks();
    const taskId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
    tasks.push({ id: taskId, description, status: 'todo' });
    saveTasks(tasks);
    console.log(`Task added successfully (ID: ${taskId})`);
}

function updateTask(id, description) {
    const tasks = loadTasks();
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.description = description;
        saveTasks(tasks);
        console.log(`Task ${id} updated successfully`);
    } else {
        console.log(`Task ID ${id} not found`);
    }
}

function deleteTask(id) {
    let tasks = loadTasks();
    const taskCountBefore = tasks.length;
    tasks = tasks.filter(task => task.id !== id);
    if (tasks.length < taskCountBefore) {
        saveTasks(tasks);
        console.log(`Task ${id} deleted successfully`);
    } else {
        console.log(`Task ID ${id} not found`);
    }
}

function markTask(id, status) {
    const tasks = loadTasks();
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.status = status;
        saveTasks(tasks);
        console.log(`Task ${id} marked as ${status}`);
    } else {
        console.log(`Task ID ${id} not found`);
    }
}

function listTasks(status = null) {
    const tasks = loadTasks();
    const filteredTasks = tasks.filter(task => (status ? task.status === status : true));
    filteredTasks.forEach(task => {
        console.log(`ID: ${task.id}, Description: ${task.description}, Status: ${task.status}`);
    });
}

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
    case 'add':
        addTask(args.slice(1).join(' '));
        break;
    case 'update':
        updateTask(parseInt(args[1]), args.slice(2).join(' '));
        break;
    case 'delete':
        deleteTask(parseInt(args[1]));
        break;
    case 'mark-in-progress':
        markTask(parseInt(args[1]), 'in-progress');
        break;
    case 'mark-done':
        markTask(parseInt(args[1]), 'done');
        break;
    case 'list':
        listTasks(args[1]);
        break;
    default:
        console.log('Unknown command');
}
