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

    static saveProjects() {
        localStorage.setItem('projects', JSON.stringify(projects));
    };

    static findProject(title) {
        projects.find((project) => project.title === title.trim());
    };

    static addProjects(title) {
        const projects = LocalStorageProjects.getProjects();
        const project = new Project(title);
        projects.push(project);
        LocalStorageProjects.saveProjects;
    };

    static removeProjects(title) {
        const project = LocalStorageProjects.findProject(title);
        projects.splice(projects.indexOf(project), 1);
        LocalStorageProjects.saveProjects;
    };

    static editProject(title, newTitle) {
        const project = LocalStorageProjects.findProject(title);
        if (project) {
            project.title = newTitle;
        };
        LocalStorageProjects.saveProjects;
    };
};

export default LocalStorageProjects;