import Project from './project'

let projects = [];

class LocalStorageProjects {
    static getProjects() {
        if(localStorage.getItem('projects', JSON.parse(projects)) === null) {
            localStorage.setItem('projects', JSON.stringify(projects));
        }
        else {
            projects = localStorage.getItem('projects', JSON.parse(projects));
        };

        return projects;
    };

    static addProjects(title, todoLists) {
        const projects = this.getProjects();
        const project = new Project(title, todoLists);
        projects.push(project);
        localStorage.setItem('projects', JSON.stringify(projects));
    };

    static removeProjects(title) {
        const project = projects.find((project) => project.title === title.trim());
        projects.splice(projects.indexOf(project), 1);
        localStorage.setItem('projects', JSON.stringify(projects));
    };

    static editProject(title, newTitle) {
        const project = projects.find((project) => project.title === title.trim());
        if (project) {
            project.title = newTitle;
        };
        localStorage.setItem('projects', JSON.stringify(projects));
    };
};

export default LocalStorageProjects;