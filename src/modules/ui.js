import {
    format,
    addDays,
    isBefore,
    startOfDay,
    endOfDay,
    isToday,
    isTomorrow,
    isAfter,
    endOfYear,
} from 'date-fns';

class RenderUI {
    static clearElement(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        };
    };
    
    static renderAddProjectBtn() {
        const addProject = document.createElement('button');
        addProject.textContent = 'Add Project';
        
        return addProject;
        //append to project container
    };

    static renderProject() {
        const projectList = document.createElement('li');
        const projectBtnGroup = document.createElement('div');

        projectList.classList.add('project-item');

        projectBtnGroup.append(RenderUI.renderProjectList,
            RenderUI.deleteButton,
            RenderUI.editButton
        );
        projectList.appendChild(projectBtnGroup);
        
        return projectList;
    };

    static renderProjectName(project) {
        const projectName = document.createElement('button');

        //get project lists from local storage
        
        projectName.textContent = project.title;
        //append to list container
        return projectItem;
        
    };

    static deleteButton() {
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';

        //append to project list and todolist
        return delBtn;
    };

    static editButton() {
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';

        //append to project list and todolist
        return editBtn;
    };

    static renderAddTodoBtn() {
        const addTodoLi = document.createElement('li');
        const addTodo = document.createElement('button');
        
        addTodo.textContent = 'Add todo';
        addTodoLi.appendChild(addTodo);
        
        return addTodoLi;
        //append to todolist container
    };

    static renderTodo() {
        const todo = document.createElement('li');
        todo.classList.add('todo-item');

        return todo;
        //append to todolist container
    };

    static renderTodoContainer() {
        const todoContainer = document.createElement('div');
        todoContainer.classList.add('todo-container');

        return todoContainer;
    };

    static renderCheckbox() {
        const todoCheckbox = document.createElement('input');
        const checkboxContainer = document.createElement('div');

        todoCheckbox.setAttribute('type', 'checkbox');
        checkboxContainer.appendChild(todoCheckbox);

        return checkboxContainer;
    };

    static renderTodoName(todolist) {
        const todoName = document.createElement('button');

        todoName.textContent(todolist.title);

        return todoName;
    };
};