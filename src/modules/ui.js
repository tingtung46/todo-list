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

const projectContainer = document.querySelector('.project-container');
const projectHeader = document.querySelector('.project-header');
const todolistsContainer = document.querySelector('.todolists-container');

class RenderUI {
    static clearElement(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        };
    };
    
    static renderAddProjectBtn() {
        const addProject = document.createElement('button');
        addProject.textContent = 'Add Project';
        
        projectContainer.appendChild(addProject);
    };

    static renderProject(project) {
        const projectList = document.createElement('li');
        const projectBtnGroup = document.createElement('div');

        projectList.classList.add('project-item');

        projectBtnGroup.append(
            RenderUI.renderProjectName(project),
            RenderUI.deleteButton,
            RenderUI.editButton
        );
        projectList.appendChild(projectBtnGroup);
        
        return projectList;
    };

    static renderProjectName(project) {
        const projectName = document.createElement('button');
        
        projectName.textContent = project.title;
        projectName.classList.add('project-name', 'btn');
        projectName.setAttribute('data-project', project.title);
        
        return projectName;
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
        projectHeader.appendChild(projectTitle);
    }

    static renderAddTodoBtn() {
        const addTodoLi = document.createElement('li');
        const addTodo = document.createElement('button');
        
        addTodo.textContent = 'Add todo';
        addTodoLi.appendChild(addTodo);
        
        todolistsContainer.appendChild(addTodoLi);
    };

    static renderTodo(project, todolist) {
        const todo = document.createElement('li');
        todo.classList.add('todo-item');

        todo.setAttribute('data-todo', todolist.title);
        todo.setAttribute('data-project', project.title);

        return todo;
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
        if (todolist.dueDate === '') return '';

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

    static renderTodoDetails(todolist) {
        const tododetails = document.createElement('div');
        const todoHead = document.createElement('div');
        const todoName = document.createElement('div');
        const todoBtnGroup = document.createElement('div');
        const todoDesc = document.createElement('div');

        todoHead.classList.add('todo-head');
        todoDesc.classList.add('todo-desc');

        todoName.textContent = todolist.title;
        todoBtnGroup.append(RenderUI.deleteButton, RenderUI.editButton);
        todoHead.append(todoName, todoBtnGroup);

        if (todolist.dueDate !== '' && todolist.priority !== '') {
            todoDesc.textContent = `${RenderUI.renderDate} | ${RenderUI.renderPriority}`;
        } else if (todolist.dueDate !== '' && todolist.priority === '') {
            todoDesc.textContent = `${RenderUI.renderDate}`;
        } else if (todolist.dueDate === '' && todolist.priority !== '') {
            todoDesc.textContent = `${RenderUI.renderPriority}`;
        };

        tododetails.append(todoHead, todoDesc);

        return tododetails;
    };

    static renderAllTodolists(project, todolists) {
        todolists.forEach((todo) => {
            const todoItem = RenderUI.renderTodo(project, todo);
            const todoContainer = RenderUI.renderTodoContainer;
            const todoCheckbox = RenderUI.renderCheckbox;
            const todoDetails = RenderUI.renderTodoDetails(todo);

            todoContainer.append(todoCheckbox, todoDetails);
            todoItem.appendChild(todoContainer);
            todolistsContainer.appendChild(todoItem);
        });
    };
};