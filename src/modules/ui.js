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
import { beTarask } from 'date-fns/locale';

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

    static renderProjectTitle(project) {
        const projectTitle = document.createElement('div');
        projectTitle.classList.add('project-title');

        projectTitle.textContent = project.title;
        return projectTitle;
        //append to project header
    }

    static renderAddTodoBtn() {
        const addTodoLi = document.createElement('li');
        const addTodo = document.createElement('button');
        
        addTodo.textContent = 'Add todo';
        addTodoLi.appendChild(addTodo);
        
        return addTodoLi;
        //append to todolist container ul
    };

    static renderTodo(project, todolist) {
        const todo = document.createElement('li');
        todo.classList.add('todo-item');

        todo.setAttribute('data-todo', todolist.title);
        todo.setAttribute('data-project', project.title);

        return todo;
        //append to todolist container ul
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
        todoCheckbox.setAttribute('id', 'todo-checkbox');

        checkboxContainer.appendChild(todoCheckbox);

        return checkboxContainer;
    };

    static renderDate(todolist) {
        if (task.dueDate === '') return '';

        const currentDate = startOfDay(new Date());
        const startOfWeek = new Date(currentDate);
        const endOfWeek = endOfDay(addDays(startOfWeek, 6));
        const todoDate = startOfDay(new Date(todolist.dueDate));
        const endOfYearDate = endOfYear(currentDate);

        let todoDateText = '';

        if (todolist.done === true) {
            todoDateText = 'Completed';
        } else if (isBefore(todoDate, currentDate)) {
            todoDateText = 'Overdue';
        } else if (isToday(todoDate)) {
            todoDateText = 'Today';
        } else if (isTomorrow(todoDate)) {
            todoDateText = 'Tomorrow';
        } else if (
            isAfter(todoDate, startOfWeek) &&
            isBefore(todoDate, endOfWeek)
        ) {
            todoDateText = format(todoDate, 'EEEE');
        } else if (
            isAfter(todoDate, endOfWeek) &&
            isBefore(todoDate, endOfYearDate)
        ) {
            todoDateText = format(todoDate, 'MMM d');
        } else {
            todoDateText = format(todoDate, 'MMM d yyyy');
        }
        return todoDateText;
    };

    static renderPriority(todolist) {
        let priorityText = '';

        switch (todolist.priority) {
            case 'Urgent':
                priorityText = 'Urgent';
                break;
            case 'Important':
                priorityText = 'Important';
                break
            case 'Not Important':
                priorityText = 'Not important';
                break;
        };

        return priorityText;
    };

    static renderTodoName(todolist) {
        const todoName = document.createElement('button');

        todoName.textContent(todolist.title);

        return todoName;
    };
};