import { store } from "../core/store";

class TaskColumn extends HTMLElement{
    static get observedAttributes(){
        return ['column-title', 'column-id'];
    }

    constructor(){
        super();
        this.attachShadow({mode:'open'});
    }

    connectedCallback(){
        this.render();
        this.addEventListener('dragover',this.onDragOver);
        this.addEventListener('dragleave',this.onDragLeave);
        this.addEventListener('drop',this.onDrop);
    }

    disconnectedCallback(){
        this.removeEventListener('dragover', this.onDragOver);
        this.removeEventListener('dragleave', this.onDragLeave);
        this.removeEventListener('drop', this.onDrop);
    }

    attributeChangedCallback(){
        this.render();
    }

    private onDragOver = (e:DragEvent) => {
        e.preventDefault();
        if(e.dataTransfer){
            e.dataTransfer.dropEffect = 'move';
        }

        (this.shadowRoot?.querySelector('.column') as HTMLElement)?.classList.add('drag-over');
    };

    private onDragLeave = () => {
        (this.shadowRoot?.querySelector('.column') as HTMLElement)?.classList.remove('drag-over');
    };

    private onDrop = (e: DragEvent) => {
        e.preventDefault();
        (this.shadowRoot?.querySelector('.column') as HTMLElement)?.classList.remove('drag-over');

        const taskId = e.dataTransfer?.getData('text/plain');
        if(!taskId) return;

        const columnId = this.getAttribute('column-id');
        if(!columnId) return;

        const task = store.state.tasks.find(t => t.id === taskId);
        if(task){
            task.columnId = columnId;
        }
    };

    render(){
        const columnTitle = this.getAttribute('column-title') || '未命名列';
        const columnId = this.getAttribute('column-id') || '';

        this.shadowRoot!.innerHTML = `
            <style>
                :host{
                    display: flex;
                    flex-direction: column;
                    width: 280px;
                    min-height: 200px;
                    background: var(--column-bg);
                    border-radius: 8px;
                    padding: 12px;
                    margin-right: 16px;
                    flex-shrink: 0;
                }
                .column {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                .column.drag-over{
                    background-color: rgba(0,100,255,0.08);
                    border-radius: 8px;
                }
                .column-header{
                    font-weight: 600;
                    font-size: 14px;
                    color: var(--text-secondary);
                    margin-bottom: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .cards-container{
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
            </style>
            <div class="column">
                <div class="column-header">${columnTitle}</div>
                <div class="cards-container">
                    <slot></slot>
                </div>
            </div>
        `;
    }
}

customElements.define('task-column', TaskColumn);