import {
    format,
    addDays,
    isBefore,
    isThisWeek,
    startOfDay,
    endOfDay,
    isToday,
    isTomorrow,
    isAfter,
    endOfYear,
} from 'date-fns';
import configLocalStorage from './LocalStorageProjects';
import DOM from './DOM';
import getFormData from './form';
import todoListHandle from './TodoListsHandle';

const renderUI = (function() {
    const projectContainer = document.querySelector('.project-container');
    const projectHeader = document.querySelector('.project-header');
    const todolistsContainer = document.querySelector('.todolists-container');
    const editProjectTitle = document.querySelector('#edit-project-title');
    const overlay = document.querySelector('.overlay');
    const inpProjectTitle = document.querySelector('#add-project-title');
    const addProjectBtn = document.querySelector('.add-project-btn');
    const addProjectForm = document.querySelector('#add-project-form');
    const editProjectForm = document.querySelector('#edit-project-form');
    const addTodoModal = document.querySelector('#todo-modal');
    const addTodoForm = document.querySelector('#add-todo-form');
    const inpTodoTitle = document.querySelector('#todo-title');
    const projectDropDown = document.querySelector('#todo-project');
    const addTodoBtn = document.querySelector('.add-todo-btn');
    const editTodoForm = document.querySelector('#edit-todo-form');
    const editTodoTitle = document.querySelector('#edit-todo-title');
    const addProjectModal = document.querySelector('#project-modal');
    const editProjectModal = document.querySelector('#edit-project-modal');
    const addProjectOption = document.querySelector('add-project-option');
    // const delProjectBtn = document.querySelector('.delete-project-btn');
    // const editProjectBtn = document.querySelector('.edit-project-btn');

    const clearElement = (element) => {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        };
    };

    const clearProjectDetails = () => {
        clearElement(projectHeader);
        clearElement(todolistsContainer);
    };

    const renderAddProjectBtn = () => {
        const addProject = document.createElement('button');
        addProject.textContent = 'Add Project';
        addProject.classList.add('add-project-option');
    
        projectContainer.appendChild(addProject);

        addProject.addEventListener('click', () => {
            overlay.classList.remove('fade');
            addProjectModal.classList.remove('fade');
        });
    };

    const renderProject = (project) => {
        const projectList = document.createElement('li');
        const projectBtnGroup = document.createElement('div');

        projectList.classList.add('project-item');

        projectBtnGroup.append(
            renderProjectName(project),
            deleteButton(project.title),
            editButton(project.title)
        );
        projectList.appendChild(projectBtnGroup);
    
        return projectList;
    };

    const renderProjectName = (project) => {
        const projectName = document.createElement('button');
    
        projectName.textContent = project.title;
        projectName.classList.add('project-btn');
        projectName.setAttribute('data-project', project.title);
    
        return projectName;
    };

    const deleteButton = (projectTitle, todoTitle = '') => {
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.setAttribute('data-project', projectTitle);
        delBtn.classList.add('delete-' + (todoTitle ? 'todo' : 'project') + '-btn');

        if (todoTitle !== '') delBtn.setAttribute('data-todo', todoTitle);

        return delBtn;
    };

    const editButton = (projectTitle, todoTitle = '') => {
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.setAttribute('data-project', projectTitle);
        editBtn.classList.add('edit-' + (todoTitle ? 'todo' : 'project') + '-btn');

        if (todoTitle !== '') editBtn.setAttribute('data-todo', todoTitle);

        return editBtn;
    };

    const renderProjectTitle = (projectName) => {
        const projectTitle = document.createElement('div');
        projectTitle.classList.add('project-title');

        projectTitle.textContent = projectName;
        projectHeader.appendChild(projectTitle);
    };

    const renderAddTodoBtn = (projectTitle) => {
        const addTodoLi = document.createElement('li');
        const addTodo = document.createElement('button');

        addTodo.classList.add('add-todo-option');
        addTodo.setAttribute('data-project', projectTitle);
        addTodo.textContent = 'Add todo';

        addTodo.addEventListener('click', () => {
            const addTodoModal = document.querySelector('#todo-modal');
            overlay.classList.remove('fade');
            addTodoModal.classList.remove('fade');
        });

        inpTodoTitle.addEventListener('input', () => {
            DOM.todoValidation(inpTodoTitle, projectDropDown, addTodoBtn);
        });
        
        addTodoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const todo = getFormData(addTodoForm);
            todoListHandle.addTodoList(
                configLocalStorage.findProject(todo.project),
                todo.title,
                todo.description,
                todo.dueDate,
                todo.prirority,
            );
            configLocalStorage.saveProjects();
            renderCurrentProject();
            addTodoForm.reset();
            overlay.classList.add('fade');
            addTodoModal.classList.add('fade');
        });

        addTodoLi.appendChild(addTodo);
    
        todolistsContainer.appendChild(addTodoLi);
    };

    const renderTodo = (project, todolist) => {
        const todo = document.createElement('li');
        todo.classList.add('todo-item');

        todo.setAttribute('data-todo', todolist.title);
        todo.setAttribute('data-project', project.title);

        return todo;
    };

    const renderTodoContainer = () => {
        const todoContainer = document.createElement('div');
        todoContainer.classList.add('todo-container');

        return todoContainer;
    };

    const renderCheckbox = (projectTitle, todolistTitle) => {
        const todoCheckbox = document.createElement('input');
        const checkboxContainer = document.createElement('div');

        todoCheckbox.classList.add('todo-status');
        todoCheckbox.setAttribute('type', 'checkbox');
        todoCheckbox.setAttribute('id', 'todo-checkbox');
        todoCheckbox.setAttribute('data-project', projectTitle);
        todoCheckbox.setAttribute('data-todo', todolistTitle);

        checkboxContainer.appendChild(todoCheckbox);

        return checkboxContainer;
    };

    const renderDate = (todolist) => {
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

    const renderPriority = (todolist) => {
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

    const renderTodoDetails = (project, todolist) => {
        const tododetails = document.createElement('div');
        const todoHead = document.createElement('div');
        const todoName = document.createElement('div');
        const todoBtnGroup = document.createElement('div');
        const todoDesc = document.createElement('div');

        todoHead.classList.add('todo-head');
        todoDesc.classList.add('todo-desc');

        todoName.textContent = todolist.title;
        todoBtnGroup.append(
            deleteButton(project.title, todolist.title),
            editButton(project.title, todolist.title)
        );
        todoHead.append(todoName, todoBtnGroup);

        if (todolist.dueDate !== '' && todolist.priority !== '') {
            todoDesc.textContent = `${renderDate} | ${renderPriority}`;
        } else if (todolist.dueDate !== '' && todolist.priority === '') {
            todoDesc.textContent = `${renderDate}`;
        } else if (todolist.dueDate === '' && todolist.priority !== '') {
            todoDesc.textContent = `${renderPriority}`;
        };

        tododetails.append(todoHead, todoDesc);

        return tododetails;
    };

    const renderAllTodolists = (project, todolists) => {
        todolists.forEach((todo) => {
            const todoItem = renderTodo(project, todo);
            const todoContainer = renderTodoContainer();
            const todoCheckbox = renderCheckbox(project.title, todo.title);
            const todoDetails = renderTodoDetails(project, todo);

            todoContainer.append(todoCheckbox, todoDetails);
            todoItem.appendChild(todoContainer);
            todolistsContainer.appendChild(todoItem);

            const delTodoBtn = document.querySelector('.delete-todo-btn');

            delTodoBtn.addEventListener('click', (e) => {
                const projectTitle = e.target.getAttribute('data-project');
                const todoTitle = e.target.getAttribute('data-todo');
                todoListHandle.removeTodoList(configLocalStorage.findProject(projectTitle), todoTitle);
                configLocalStorage.saveProjects();
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
                todoListHandle.editTodoList(
                    configLocalStorage.findProject(projectTitle),
                    todoTitle,
                    configLocalStorage.findProject(newTodo.project),
                    newTodo.title.trim(),
                    newTodo.description,
                    newTodo.dueDate,
                    newTodo.priority
                );
                configLocalStorage.saveProjects();
                renderCurrentProject();
                editTodoForm.reset();
            });
        });
    };

    const setEditProjectTitle = (button) => {
        const projectTitle = button.getAttribute('data-project');
        editProjectTitle.value = projectTitle;
        editProjectTitle.setAttribute('data-project', projectTitle);
    };

    const renderProjectItem = (projectLists) => {
        clearElement(projectContainer);
        renderAddProjectBtn();

        projectLists.forEach((project) => {
            const projectItem = renderProject(project);
            projectContainer.appendChild(projectItem);
        });

        const delProjectBtn = document.querySelectorAll('.delete-project-btn');
        const editProjectBtn = document.querySelectorAll('.edit-project-btn');
    
        delProjectBtn.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const projectTitle = e.target.getAttribute('data-project');
                configLocalStorage.removeProjects(projectTitle);
                renderProjectItem(configLocalStorage.getProjects());
            
                const projectHeader = document.querySelector('.project-header');
                if (projectHeader.textContent === projectTitle) {
                    loadProject('Today');
                } else {
                    renderCurrentProject();
                };
            });
        });
    
        editProjectBtn.forEach((btn) => {
            btn.addEventListener('click', () => {
                overlay.classList.remove('fade');
                editProjectModal.classList.remove('fade');
            });
        });
    };

    const renderCurrentProject = () => {
        const projectTitle = document.querySelector('.project-title').textContent;
        loadProject(projectTitle);
    };

    const renderEditProject = (projectName) => {
        const projectTitle = document.querySelector('.project-title');
        projectTitle.textContent = projectName;
        loadProject(projectTitle.textContent);
    };

    const loadProject = (projectTitle) => {
        switch (projectTitle) {
            case 'All Tasks':
                renderAllProjectDetails(configLocalStorage.getProjects());
                break;
            case 'Today':
                renderTodayProjectDetails(configLocalStorage.getProjects());
                break;
            case 'This Week':
                renderThisWeekProject(configLocalStorage.getProjects());
                break;
            default:
                renderProjectDetails(configLocalStorage.findProject(projectTitle));
        };
    };

    const renderProjectDetails = (project) => {
        clearProjectDetails();
        renderProjectTitle(project.title);
        clearElement(todolistsContainer);
        renderAllTodolists(project, project.todoLists);
        renderAddTodoBtn(project.title);
    };

    const renderAllProjectDetails = (projectLists) => {
        clearProjectDetails();
        renderProjectTitle('All Tasks');

        projectLists.forEach((project) => {
            renderAllTodolists(project, project.todoLists);
        });

        renderAddTodoBtn('All Tasks');
    };

    const renderTodayProjectDetails = (projectLists) => {
        clearProjectDetails();
        renderProjectTitle('Today');

        projectLists.forEach((project) => {
            const todolists = project.todoLists.filter((todolist) => {
                const dayTodolist = startOfDay(new Date(todolist.dueDate));
                return isToday(dayTodolist);
            });
        
            renderAllTodolists(project, todolists);
        });

        renderAddTodoBtn('Today');
    };

    const renderThisWeekProject = (projectLists) => {
        clearProjectDetails();
        renderProjectTitle('This week');

        projectLists.forEach((project) => {
            const todolists = project.todoLists.filter((todolist) => {
                const weekTodolist = startOfDay(new Date(todolist.dueDate));
                return isThisWeek(weekTodolist);
            });

            renderAllTodolists(project, todolists);
        });

        renderAddTodoBtn('This Week');
    };

    const renderProjectDropDown = (projectLists, projectDropDown) => {
        clearElement(projectDropDown);

        projectLists.forEach((project) => {
            const option = document.createElement('option');
            option.value = project.title;
            option.textContent = project.title;

            projectDropDown.appendChild(option);
        });
    };

return {
    setEditProjectTitle,
    renderProjectItem,
    renderCurrentProject,
    renderEditProject,
    renderProjectDetails,
    renderAllProjectDetails,
    renderTodayProjectDetails,
    renderThisWeekProject,
    renderProjectDropDown,
    loadProject,
}
})();

export default renderUI;