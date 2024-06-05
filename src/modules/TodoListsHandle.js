import Todo from './todo';

const todoListHandle = (function() {
    const addTodoList = (project, title, description, dueDate, priority) => {
        const todoList = new Todo(title, description, dueDate, priority);
        project.todoLists.push(todoList);
    };
    
    const findTodoList = (project, title) => {
        return project.todoLists.find((todoList) => todoList.title === title);
    };
    
    const removeTodoList = (project, title) => {
        const todoList = findTodoList(project, title);
        project.todoLists.splice(project.todoLists.indexOf(todoList), 1);
    };
    
    const toggleStatus = (project, title) => {
        const todoList = findTodoList(project, title);
        if (todoList) {
            todoList.done = todoList.done === false ? true : false;
        };
    };
    
    const editTodoList = (
        project,
        title,
        newProject,
        newTitle,
        newDescription,
        newDueDate,
        newPriority,
    ) => {
        const todoList = findTodoList(project, title);
        if (todoList) {
            if (newProject.title === project.title) {
                todoList.title = newTitle;
                todoList.description = newDescription;
                todoList.dueDate = newDueDate;
                todoList.priority = newPriority;
            } else {
                removeTodoList(project, title);
                addTodoList(
                    newProject,
                    newTitle,
                    newDescription,
                    newDueDate,
                    newPriority,
                );
            };
        };
    };

    return {addTodoList, findTodoList, removeTodoList, toggleStatus, editTodoList,}
})();


export default todoListHandle;