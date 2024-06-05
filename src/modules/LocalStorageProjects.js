import Project from './project'

const configLocalStorage = (function() {
    let projects = [];

    const getProjects = () => {
        if(JSON.parse(localStorage.getItem(projects)) === null) {
            localStorage.setItem('projects', JSON.stringify(projects));
        } else {
            projects = JSON.parse(localStorage.getItem(projects));
        };
    
        return projects;
    };
    
    const saveProjects = () => {
        localStorage.setItem('projects', JSON.stringify(projects));
    };
    
    const findProject = (title) => {
        return projects.find((project) => project.title === title.trim());
    };
    
    const addProjects = (title) => {
        const projects = getProjects();
        const project = new Project(title);
        projects.push(project);
        saveProjects();
    };
    
    const removeProjects = (title) => {
        const project = findProject(title);
        projects.splice(projects.indexOf(project), 1);
        saveProjects();
    };
    
    const editProject = (title, newTitle) => {
        const project = findProject(title);
        if (project) {
            project.title = newTitle;
        };
        saveProjects();
    };

    return {getProjects, saveProjects, findProject, addProjects, removeProjects, editProject,}
})();

export default configLocalStorage;