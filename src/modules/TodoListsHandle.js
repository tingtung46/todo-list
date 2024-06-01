import Todo from './todo';

let todoLists = [];

class TodoListsHandle {
    static addTodoList(project, title, description, dueDate, priority) {
        const todoList = new Todo(title, description, dueDate, priority);
        project.todoLists.push(todoList);
    };

    static findTodoList(project, title) {
        project.todoLists.find((todoList) => todoList.title === title);
    };

    static removeTodoList(project, title) {
        const todoList = TodoListsHandle.findTodoList(project, title);
        project.todoLists.splice(project.todoLists.indexOf(todoList), 1);
    };

    static toggleStatus(project, title) {
        const todoList = TodoListsHandle.findTodoList(project, title);
        if (todoList) {
            todoList.done = todoList.done === false ? true : false;
        };
    };

    static editTodoList(
        project,
        title,
        newProject,
        newTitle,
        newDescription,
        newDueDate,
        newPriority,
    ) {
        const todoList = TodoListsHandle.findTodoList(project, title);
        if (todoList) {
            if (newProject.title === project.title) {
                todoList.title = newTitle;
                todoList.description = newDescription;
                todoList.dueDate = newDueDate;
                todoList.priority = newPriority;
            } else {
                TodoListsHandle.removeTodoList(project, title);
                TodoListsHandle.addTodoList(
                    newProject,
                    newTitle,
                    newDescription,
                    newDueDate,
                    newPriority,
                );
            };
        };
    };
};

export default TodoListsHandle;