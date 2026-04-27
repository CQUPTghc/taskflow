import {store} from '../core/store';
import '../components/task-card';
import '../components/task-column';

export class BoardPage extends HTMLElement {
    private unsubscribe: (() => void) | null = null;

    constructor(){
        super();
        this.attachShadow({mode:'open'});
    }

    connectedCallback(){
        this.unsubscribe = store.subscribe(() => this.render());
        this.render();
    }

    disconnectedCallback(){
        this.unsubscribe?.();
    }

    render(){
        const {columns, tasks} = store.state;

        const columnsHTML = columns.map(col => {
            const colTasks = tasks.filter(task => task.columnId === col.id);
            const cardsHTML = colTasks.map(task => `<task-card task-id="${task.id}"></task-card>`).join('');

            return `
                <task-column column-title="${col.title}" column-id="${col.id}">
                    ${cardsHTML}
                </task-column>
            `;
        }).join('');

        this.shadowRoot!.innerHTML = `
            <div><app-link href="/settings">⚙️ 设置</app-link></div>
            <style>
                :host {
                display: flex;
                align-items: flex-start;
                padding: 20px;
                gap: 16px;
                overflow-x: auto;
                min-height: calc(100vh - 40px);
                background-color: var(--bg-primary);
                }
            </style>
            ${columnsHTML}
        `;
    }
}

customElements.define('board-page', BoardPage);