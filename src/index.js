import { LocalStorageProjects } from './modules/LocalStorageProjects';
import { TodoListsHandle } from './modules/TodoListsHandle';
import { getFormData } from './modules/form';
import { RenderUI } from './modules/ui';

//declare DOM from html
const sidebar = document.querySelector('.sidebar');
const addProjectForm = document.querySelector('#add-project-form');
const addProjectBtn = document.querySelector('.add-project-btn');
const delProjectBtn = document.querySelector('.delete-project-btn');
const editProjectForm = document.querySelector('#edit-project-form');
const editProjectBtn = document.querySelector('.edit-project-btn');
const inpProjectTitle = document.querySelector('#add-project-title');
const editProjectTitle = document.querySelector('#edit-project-title');
const todolistsContainer = document.querySelector('.todolists-container');
const addTodoForm = document.querySelector('#add-todo-form');
const inpTodoTitle = document.querySelector('#todo-title');
const projectDropDown = document.querySelector('#todo-project');
const addTodoBtn = document.querySelector('.add-todo-btn');
const delTodoBtn = document.querySelector('.delete-todo-btn');
const editTodoForm = document.querySelector('#edit-todo-form');
const editTodoTitle = document.querySelector('#edit-todo-title');
const editTodoDesc = document.querySelector('#edit-todo-desc');
const editTodoDate = document.querySelector('#edit-todo-date');
const editTodoPriority = document.querySelector('#edit-todo-priority');
const editProjectDropDown = document.querySelector('#edit-todo-project');
const editTodoBtn = document.querySelector('.edit-todo-btn');
const baseProject = ['All Tasks', 'Today', 'This Week'];

const projectValidation = function validateProjectTitle(titleInput, btnProject) {
    const projectExist = LocalStorageProjects.findProject(
        titleInput.value.trim()
    ) !== undefined;
    titleInput.setCustomValidity(projectExist ? 'Project already exist' : '');

    btnProject.preventDefault();
};

const todoValidation = function validateTodoTitle(titleInput, projectDropDown, btnTodo) {
    const projectNotFound = LocalStorageProjects.findProject(
        projectDropDown.value.trim()
    ) === undefined;
    const todoExist = TodoListsHandle.findTodoList(
        LocalStorageProjects.findProject(
            projectDropDown.value
        ),
            titleInput.trim()
        ) !== undefined;

    if (projectNotFound) {
        titleInput.setCustomValidity('You must create a project')
    } if (todoExist) {
        titleInput.setCustomValidity('Todo already exist')
    } else {
        titleInput.setCustomValidity('')
    };

    btnTodo.preventDefault();
};

const taskDetails = function setTaskDetails(button) {
    const projectTitle = button.getAttribute('data-project');
    if (baseProject.includes(projectTitle)) return;

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
            RenderUI.renderAllProjectDetails(LocalStorageProjects.getProjects);
            break;
        case 'Today':
            RenderUI.renderTodayProjectDetails(LocalStorageProjects.getProjects);
            break;
        case 'This Week':
            RenderUI.renderThisWeekProject(LocalStorageProjects.getProjects);
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

todolistsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-todo-option')) {
        RenderUI.renderProjectDropDown(LocalStorageProjects.getProjects, projectDropDown);
        taskDetails(e.target);
    } else if (e.target.classList.contains('edit-todo-option')) {
        RenderUI.renderProjectDropDown(LocalStorageProjects.getProjects, editProjectDropDown);
        setEditTodoDetails(e.target);
    } else if (e.target.classList.contains('todo-status')) {
        const projectTitle = e.target.getAttribute('data-project');
        const todoTitle = e.target.getAttribute('data-todo');

        TodoListsHandle.toggleStatus(LocalStorageProjects.findProject(projectTitle), todoTitle);
        LocalStorageProjects.saveProjects;
        renderCurrentProject();
    };
});

inpProjectTitle.addEventListener('input', () => {
    projectValidation(inpProjectTitle, addProjectBtn);
});

addProjectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const project = getFormData(addProjectForm);
    LocalStorageProjects.addProjects(project.title.trim());
    RenderUI.renderProjectItem(LocalStorageProjects.getProjects);
    addProjectForm.reset();
    renderProject(project.title);
});

delProjectBtn.addEventListener('click', (e) => {
    const projectTitle = e.target.getAttribute('data-project');
    LocalStorageProjects.removeProject(projectTitle);
    RenderUI.renderProjectItem(LocalStorageProjects.getProjects);

    const projectHeader = document.querySelector('.project-header');
    if (projectHeader.textContent === projectTitle) {
        renderProject('Today');
    } else {
        renderCurrentProject();
    };
});

editProjectTitle.addEventListener('input', () => {
    projectValidation(editProjectTitle, editProjectBtn);
});

editProjectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const projectTitle = editProjectTitle.getAttribute('data-project');
    const newProject = getFormData(editProjectForm);
    LocalStorageProjects.editProject(projectTitle, newProject.title.trim());
    RenderUI.renderProjectItem(LocalStorageProjects.getProjects);
    editProjectForm.reset();
    renderCurrentProject();
});

inpTodoTitle.addEventListener('input', () => {
    todoValidation(inpTodoTitle, projectDropDown, addTodoBtn);
});

addTodoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const todo = getFormData(addTodoForm);
    TodoListsHandle.addTodoList(
        LocalStorageProjects.findProject(todo.project),
        todo.title,
        todo.description,
        todo.dueDate,
        todo.prirority,
    );
    LocalStorageProjects.saveProjects;
    renderCurrentProject();
    addTodoForm.reset();
});

delTodoBtn.addEventListener('click', (e) => {
    const projectTitle = e.target.getAttribute('data-project');
    const todoTitle = e.target.getAttribute('data-todo');
    TodoListsHandle.removeTodoList(LocalStorageProjects.findProject(projectTitle), todoTitle);
    LocalStorageProjects.saveProjects;
    renderCurrentProject();
});

editTodoTitle.addEventListener('input', () => {
    todoValidation(editTodoTitle, projectDropDown, addTodoBtn);
});

editTodoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const projectTitle = editTodoBtn.target.getAttribute('data-project');
    const todoTitle = editTodoTitle.target.getAttribute('data-todo');
    const newTodo = getFormData(editTodoForm);
    TodoListsHandle.editTodoList(
        LocalStorageProjects.findProject(projectTitle),
        todoTitle,
        LocalStorageProjects.findProject(newTodo.project),
        newTodo.title.trim(),
        newTodo.description,
        newTodo.dueDate,
        newTodo.priority
    );
    LocalStorageProjects.saveProjects;
    renderCurrentProject();
    editTodoForm.reset();
});

renderProject('Today');
RenderUI.renderProjectItem(LocalStorageProjects.getProjects);