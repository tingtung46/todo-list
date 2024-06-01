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

const projectContainer = document.querySelector('.project-container');
const projectHeader = document.querySelector('.project-header');
const todolistsContainer = document.querySelector('.todolists-container');
const editProjectTitle = document.querySelector('.edit-project-title');

class RenderUI {
    static clearElement(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        };
    };

    static clearProjectDetails() {
        RenderUI.clearElement(projectHeader);
        RenderUI.clearElement(todolistsContainer);
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
            RenderUI.deleteButton(project.title),
            RenderUI.editButton(project.title)
        );
        projectList.appendChild(projectBtnGroup);
        
        return projectList;
    };

    static renderProjectName(project) {
        const projectName = document.createElement('button');
        
        projectName.textContent = project.title;
        projectName.classList.add('project-btn');
        projectName.setAttribute('data-project', project.title);
        
        return projectName;
    };

    static deleteButton(projectTitle, todoTitle = '') {
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.setAttribute('data-project', projectTitle);
        delBtn.classList.add('delete-' + (todoTitle ? 'todo' : 'project') + '-btn');

        if (todoTitle !== '') delBtn.setAttribute('data-todo', todoTitle);

        //append to project list and todolist
        return delBtn;
    };

    static editButton(projectTitle, todoTitle = '') {
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.setAttribute('data-project', projectTitle);
        editBtn.classList.add('edit-' + (todoTitle ? 'todo' : 'project') + '-btn');

        if (todoTitle !== '') delBtn.setAttribute('data-todo', todoTitle);

        //append to project list and todolist
        return editBtn;
    };

    static renderProjectTitle(projectName) {
        const projectTitle = document.createElement('div');
        projectTitle.classList.add('project-title');

        projectTitle.textContent = projectName;
        projectHeader.appendChild(projectTitle);
    }

    static renderAddTodoBtn(projectTitle) {
        const addTodoLi = document.createElement('li');
        const addTodo = document.createElement('button');

        addTodo.classList.add('add-todo-option');
        addTodo.setAttribute('data-project', projectTitle);
        
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

    static renderCheckbox(projectTitle, todolistTitle) {
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

    static renderTodoDetails(project, todolist) {
        const tododetails = document.createElement('div');
        const todoHead = document.createElement('div');
        const todoName = document.createElement('div');
        const todoBtnGroup = document.createElement('div');
        const todoDesc = document.createElement('div');

        todoHead.classList.add('todo-head');
        todoDesc.classList.add('todo-desc');

        todoName.textContent = todolist.title;
        todoBtnGroup.append(
            RenderUI.deleteButton(project.title, todolist.title),
            RenderUI.editButton(project.title, todolist.title)
        );
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
            const todoCheckbox = RenderUI.renderCheckbox(project.title, todo.title);
            const todoDetails = RenderUI.renderTodoDetails(project, todo);

            todoContainer.append(todoCheckbox, todoDetails);
            todoItem.appendChild(todoContainer);
            todolistsContainer.appendChild(todoItem);
        });
    };

    static setEditProjectTitle(button) {
        const projectTitle = button.getAttribute('data-project');
        editProjectTitle.value = projectTitle;
        editProjectTitle.setAttribute('data-project', projectTitle);
    };

    static renderProjectItem(projectLists) {
        RenderUI.clearElement(projectContainer);

        projectLists.forEach((project) => {
            const projectItem = RenderUI.renderProject(project);
            projectContainer.appendChild(projectItem);
        });
    };

    static renderProjectDetails(project) {
        RenderUI.clearProjectDetails;
        RenderUI.renderProjectTitle(project.title);
        RenderUI.clearElement(todolistsContainer);
        RenderUI.renderAllTodolists(project, project.todolists);
        RenderUI.renderAddTodoBtn(project.title);
    };

    static renderAllProjectDetails(projectLists) {
        RenderUI.clearProjectDetails;
        RenderUI.renderProjectTitle('All Tasks');

        projectLists.forEach((project) => {
            RenderUI.renderAllTodolists(project, project.todolists);
        });

        RenderUI.renderAddTodoBtn('All Tasks');
    };

    static renderTodayProjectDetails(projectLists) {
        RenderUI.clearProjectDetails;
        RenderUI.renderProjectTitle('Today');

        projectLists.forEach((project) => {
            const todolists = project.todolists.filter((todolist) => {
                const dayTodolist = startOfDay(new Date(todolist.dueDate));
                return isToday(dayTodolist);
            });
            
            RenderUI.renderAllTodolists(project, todolists);
        });

        RenderUI.renderAddTodoBtn('Today');
    };

    static renderThisWeekProject(projectLists) {
        RenderUI.clearProjectDetails;
        RenderUI.renderProjectTitle('This week');

        projectLists.forEach((project) => {
            const todolists = project.todolists.filter((todolist) => {
                const weekTodolist = startOfDay(new Date(todolist.dueDate));
                return isThisWeek(weekTodolist);
            });

            RenderUI.renderAllTodolists(project, todolists);
        });

        RenderUI.renderAddTodoBtn('This Week');
    };

    static renderProjectDropDown(projectLists, projectDropDown) {
        RenderUI.clearElement(projectDropDown);

        projectLists.forEach((project) => {
            const option = document.createElement('option');
            option.value = project.title;
            option.textContent = project.title;

            projectDropDown.appendChild(option);
        });
    };
};

export default RenderUI;