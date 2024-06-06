import configLocalStorage from './LocalStorageProjects';
import todoListsHandle from './TodoListsHandle';
import getFormData from './form';
import renderUI from './ui';

const DOM = (function() {
    const sidebar = document.querySelector('.sidebar');
    const closeBtn = document.querySelectorAll('.close-btn');
    const cancelBtn = document.querySelectorAll('.cancel-btn');
    const overlay = document.querySelector('.overlay');
    const addProjectModal = document.querySelector('#project-modal');
    const inpProjectTitle = document.querySelector('#add-project-title');
    const addProjectBtn = document.querySelector('.add-project-btn');
    const addProjectForm = document.querySelector('#add-project-form');
    const delProjectBtn = document.querySelector('.delete-project-btn');
    const editProjectBtn = document.querySelector('.edit-project-btn');
    const editProject = document.querySelector('.edit-project');
    const editProjectTitle = document.querySelector('#edit-project-title');
    const editProjectModal = document.querySelector('#edit-project-modal');
    const editProjectForm = document.querySelector('#edit-project-form');
    const todoModal = document.querySelector('#todo-modal');
    const addTodoForm = document.querySelector('#add-todo-form');
    const projectDropDown = document.querySelector('#todo-project');
    const todolistsContainer = document.querySelector('.todolists-container');
    const editTodoModal = document.querySelector('#edit-todo-modal');
    const editTodoForm = document.querySelector('#edit-todo-form')
    const editTodoTitle = document.querySelector('#edit-todo-title');
    const editTodoDesc = document.querySelector('#edit-todo-desc');
    const editTodoDate = document.querySelector('#edit-todo-date');
    const editTodoPriority = document.querySelector('#edit-todo-priority');
    const editProjectDropDown = document.querySelector('#edit-todo-project');
    const editTodoBtn = document.querySelector('.edit-todo-btn');

    const baseProject = ['All Tasks', 'Today', 'This Week'];

    const projectValidation = function validateProjectTitle(titleInput) {
        const projectExist = configLocalStorage.findProject(
            titleInput.value.trim()
        ) !== undefined;
        titleInput.setCustomValidity(projectExist ? 'Project already exist' : '');
    };
    
    const todoValidation = function validateTodoTitle(titleInput, projectDropDown) {
        const projectNotFound = configLocalStorage.findProject(
            projectDropDown.value.trim()
        ) === undefined;
        const todoExist = todoListsHandle.findTodoList(
            configLocalStorage.findProject(
                projectDropDown.value
            ),
                titleInput.value.trim()
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
        if (baseProject.includes(projectTitle)) return;
    
        projectDropDown.value = projectTitle;
    };
    
    const setEditTodoDetails = (button) => {
        const projectTitle = button.getAttribute('data-project');
        const todoTitle = button.getAttribute('data-todo');
        const project = configLocalStorage.findProject(projectTitle);
        const todo = todoListsHandle.findTodoList(project, todoTitle);
    
        editTodoTitle.value = todoTitle;
        editTodoDesc.value = todo.description;
        editTodoDate.value = todo.dueDate;
        editTodoPriority.value = todo.priority;
        editProjectDropDown.value = projectTitle;
    
        editTodoTitle.setAttribute('data-todo', todoTitle);
        editTodoBtn.setAttribute('data-project', projectTitle);
    };
    
    const eventListener = () => {
        closeBtn.forEach((btn) => {
            btn.addEventListener('click', () => {
                overlay.classList.add('fade');
                addProjectModal.classList.add('fade');
                editProjectModal.classList.add('fade');
                todoModal.classList.add('fade');
                editTodoModal.classList.add('fade');
            });
        });
        
        cancelBtn.forEach((btn) => {
            btn.addEventListener('click', () => {
                overlay.classList.add('fade');
                addProjectModal.classList.add('fade');
                editProjectModal.classList.add('fade');
                todoModal.classList.add('fade');
                editTodoModal.classList.add('fade');
            });
        });

        sidebar.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-project-btn')) {
                renderUI.setEditProjectTitle(e.target);

            } else if (e.target.classList.contains('project-btn')) {
                renderUI.loadProject(e.target.getAttribute('data-project'));
            };
        });
        
        todolistsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-todo-option')) {
                renderUI.renderProjectDropDown(configLocalStorage.getProjects(), projectDropDown);
                taskDetails(e.target);
            } else if (e.target.classList.contains('edit-todo-btn')) {
                renderUI.renderProjectDropDown(configLocalStorage.getProjects(), editProjectDropDown);
                setEditTodoDetails(e.target);
            } else if (e.target.classList.contains('todo-status')) {
                const projectTitle = e.target.getAttribute('data-project');
                const todoTitle = e.target.getAttribute('data-todo');
        
                todoListsHandle.toggleStatus(configLocalStorage.findProject(projectTitle), todoTitle);
                configLocalStorage.saveProjects();
                renderUI.renderCurrentProject();
            };
        });

        inpProjectTitle.addEventListener('input', () => {
            projectValidation(inpProjectTitle, addProjectBtn);
        });
    
        addProjectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const project = getFormData(addProjectForm);
            configLocalStorage.addProjects(project.title.trim());
            renderUI.renderProjectItem(configLocalStorage.getProjects());
            console.log(project);
            renderUI.loadProject(project.title);
            addProjectForm.reset();
            overlay.classList.add('fade');
            addProjectModal.classList.add('fade');
        });
        
        editProjectTitle.addEventListener('input', () => {
            projectValidation(editProjectTitle, editProject);
        });
        
        editProjectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const projectTitle = editProjectTitle.getAttribute('data-project');
            const newProject = getFormData(editProjectForm);
            configLocalStorage.editProject(projectTitle, newProject.title.trim());
            renderUI.renderProjectItem(configLocalStorage.getProjects());
            editProjectForm.reset();
            overlay.classList.add('fade');
            editProjectModal.classList.add('fade');
            renderUI.renderEditProject(newProject.title);
        });

        addTodoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const todo = getFormData(addTodoForm);
            todoListsHandle.addTodoList(
                configLocalStorage.findProject(todo.project),
                todo.title,
                todo.description,
                todo.dueDate,
                todo.priority,
            );
            configLocalStorage.saveProjects();
            renderUI.renderCurrentProject();
            addTodoForm.reset();
            overlay.classList.add('fade');
            todoModal.classList.add('fade');
        });

        editTodoTitle.addEventListener('input', () => {
            todoValidation(editTodoTitle, projectDropDown);
        });
        
        editTodoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const projectTitle = editTodoBtn.getAttribute('data-project');
            const todoTitle = editTodoTitle.getAttribute('data-todo');
            const newTodo = getFormData(editTodoForm);
            todoListsHandle.editTodoList(
                configLocalStorage.findProject(projectTitle),
                todoTitle,
                configLocalStorage.findProject(newTodo.project),
                newTodo.title.trim(),
                newTodo.description,
                newTodo.dueDate,
                newTodo.priority
            );
            configLocalStorage.saveProjects();
            renderUI.renderCurrentProject();
            editTodoForm.reset();
            overlay.classList.add('fade');
            editTodoModal.classList.add('fade');
        });
    };

    return {projectValidation, todoValidation, eventListener,};
})();

export default DOM;