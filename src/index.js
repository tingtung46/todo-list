import configLocalStorage from './modules/LocalStorageProjects';
import renderUI from './modules/ui';
import DOM from './modules/DOM';
import './style.css';

document.addEventListener('DOMContentLoaded', () => {
    renderUI.loadProject('Today');
    renderUI.renderProjectItem(configLocalStorage.getProjects());
    DOM.eventListener();
});