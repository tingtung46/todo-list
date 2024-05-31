import { LocalStorageProjects } from './modules/LocalStorageProjects';
import { TodoListsHandle } from './modules/TodoListsHandle';
import { getFormData } from './modules/form';
import { RenderUI } from './modules/ui';

//declare DOM from html
const sidebar = document.querySelector('.sidebar');
const addProjectForm = document.querySelector('#add-project-form');
const addProjectBtn = document.querySelector('.add-project-btn');
const editProjectForm = document.querySelector('#edit-project-form');
const editProjectBtn = document.querySelector('.edit-project-btn');
const inpProjectTitle = document.querySelector('#add-project-title');
const editProjectTitle = document.querySelector('#edit-project-title');
const todolistsContainer = document.querySelector('.todolists-container');
const addTodoForm = document.querySelector('#add-todo-form');
const inpTodoTitle = document.querySelector('#todo-title');
const projectDropDown = document.querySelector('#todo-project');
const addTodoBtn = document.querySelector('.add-todo-btn');
const editTodoForm = document.querySelector('#edit-todo-form');
const editTodoTitle = document.querySelector('#edit-todo-title');
const editTodoDesc = document.querySelector('#edit-todo-desc');
const editTodoDate = document.querySelector('#edit-todo-date');
const editTodoPriority = document.querySelector('#edit-todo-priority');
const editTodoProject = document.querySelector('#edit-todo-project');
const editTodoBtn = document.querySelector('.edit-todo-btn');

const projectValidation = function validateProjectTitle(titleInput) {
    const projectExist = LocalStorageProjects.findProject(
        titleInput.value.trim()
    ) !== undefined;
    titleInput.setCustomValidity(projectExist ? 'Project already exist' : '');
};

const todoValidation = function validateTodoTitle(titleInput, projectDropDown) {
    const projectNotFound = LocalStorageProjects.findProject(
        projectDropDown.value.trim()
    ) === undefined;
    const todoExist = TodoListsHandle.findTodoList(
        LocalStorageProjects.findProject(
            projectDropDown.value),
            titleInput.trim()
        ) !== undefined;

    if (projectNotFound) {
        titleInput.setCustomValidity('You must create a project')
    } if (todoExist) {
        titleInput.setCustomValidity('Todo already exist')
    } else {
        titleInput.setCustomValidity('')
    };
};

const taskDetails = function setTaskDetails(button) {
    const projectTitle = button.getAttribute('data-project');

    projectDropDown.value = projectTitle;
};

const setEditTodoDetails = (button) => {
    const projectTitle = button.getAttribute('data-project');
    const todoTitle = button.getAttribute('data-todo');
    const project = LocalStorageProjects.findProject(projectTitle);
    const todo = TodoListsHandle.findTodoList(project, todoTitle);

    editTodoTitle.value = todoTitle;
    editTodoDesc.value = todo.description;
    editTodoDate.value = todo.dueDate;
    editTodoPriority.value = todo.priority;
    editTodoProject.value = projectTitle;

    editTodoTitle.setAttribute('data-todo', todoTitle);
    editTodoBtn.setAttribute('data-project', projectTitle);
};

const renderProject = (projectTitle) => {
    switch (projectTitle) {
        case 'All Tasks':
            RenderUI.renderAllProjectDetails(LocalStorageProjects.getProject);
            break;
        case 'Today':
            RenderUI.renderTodayProjectDetails(LocalStorageProjects.getProject);
            break;
        case 'This Week':
            RenderUI.renderThisWeekProject(LocalStorageProjects.getProject);
            break;
        default:
            RenderUI.renderProjectDetails(LocalStorageProjects.findProject(projectTitle));
    };
};

const renderCurrentProject = () => {
    const projectTitle = document.querySelector('.project-header');
    renderProject(projectTitle.textContent);
};

sidebar.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-project-option')) {
        RenderUI.setEditProjectTitle(e.target);
    } else if (e.target.classList.contains('project-btn')) {
        renderProject(e.target.getAttribute('data-project'));
    };
});

