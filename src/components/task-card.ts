import {store} from '../core/store';

class TaskCard extends HTMLElement{
    static get observedAttributes(){
        return ['task-id'];
    }
    
    private unsubscribe: (()=>void) | null = null;

    constructor(){
        super();
        this.attachShadow({mode:'open'});    }

    connectedCallback(){
        this.unsubscribe = store.subscribe(()=>this.render());
        this.render();
    }

    disconnectedCallback(){
        this.unsubscribe?.();
    }

    attributeChangedCallback(){
        this.render();
    }

    render(){
        const taskId = this.getAttribute('task-id');
        if(!taskId){
            this.shadowRoot!.innerHTML = `<div class="card error">⚠️ 缺少任务ID</div>`;
            return;
        }

        const task = store.state.tasks.find(t=>t.id === taskId);
        if(!task){
            this.shadowRoot!.innerHTML = `<div class="card error">⚠️ 任务不存在 (ID: ${taskId})</div>`;
            return;
        }
        this.shadowRoot!.innerHTML = `
            <style>
                .card {
                border: 1px solid var(--border-color);
                border-radius: 8px;
                padding: 12px 16px;
                margin: 8px 0;
                background-color: var(--card-bg);
                box-shadow: var(--shadow);
                
                color: var(--text-primary);
                transition: box-shadow 0.2s;
                }
                .card:hover {
                box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                }
                .card.error {
                background-color: #fee;
                color: #c00;
                border-color: #fcc;
                }
            </style>
            <div class="card">
                📋 ${task.title}
            </div>
        `; 
    }
}

customElements.define('task-card', TaskCard);





// class TaskCard extends HTMLElement {
//     static get observedAttributes(){
//         return ['title'];
//     }
//     constructor(){
//         super();
//     }

//     connectedCallback(){
//         this.render();
//     }

//     attributeChangedCallback(){
//         this.render();
//     }

//     render(){
//         const title = this.getAttribute('title') || '未命名任务';
//         this.textContent = `📋 ${title}`;
//     }
// }

// customElements.define('task-card',TaskCard);

// class TaskCard extends HTMLElement{
//     static get observedAttributes(){
//         return ['title'];
//     }

//     constructor(){
//         super();
//         this.attachShadow({mode:'open'});
//     }

//     connectedCallback(){
//         this.render();
//     }

//     attributeChangedCallback(){
//         this.render();
//     }

//     render() {
//         const title = this.getAttribute('title') || '未命名任务';

//         this.shadowRoot!.innerHTML = `
//             <style>
//                 .card{
//                     border: 1px solid #e0e0e0;
//                     border-radius: 8px;
//                     padding: 12px 16px;
//                     margin: 8px 0;
//                     background-color: #ffffff;
//                     box-shadow: 0 1px 3px rgba(0,0,0,0.05);
//                     font-family: system-ui, sans-serif;
//                     color: #333;
//                     transition: box-shadow 0.2s;
//                 }
//                 .card:hover{
//                     box-shadow: 0 4px 6px rgba(0,0,0,0.05);
//                 }
//             </style>
//             <div class="card">
//                 📋 ${title}
//             </div>
//         `;
//     }

// }

// customElements.define('task-card',TaskCard);