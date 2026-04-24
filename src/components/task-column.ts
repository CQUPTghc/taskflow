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
    }

    attributeChangedCallback(){
        this.render();
    }

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
                    background: #f4f5f7;
                    border-radius: 8px;
                    padding: 12px;
                    margin-right: 16px;
                    flex-shrink: 0;
                }
                .column-header{
                    font-weight: 600;
                    font-size: 14px;
                    color: #5e6c84;
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
            <div class="column-header">${columnTitle}</div>
            <div class="cards-container">
                <slot></slot>
            </div>
        `;
    }
}

customElements.define('task-column', TaskColumn);