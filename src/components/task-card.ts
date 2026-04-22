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

class TaskCard extends HTMLElement{
    static get observedAttributes(){
        return ['title'];
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

    render() {
        const title = this.getAttribute('title') || '未命名任务';

        this.shadowRoot!.innerHTML = `
            <style>
                .card{
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    padding: 12px 16px;
                    margin: 8px 0;
                    background-color: #ffffff;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                    font-family: system-ui, sans-serif;
                    color: #333;
                    transition: box-shadow 0.2s;
                }
                .card:hover{
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                }
            </style>
            <div class="card">
                📋 ${title}
            </div>
        `;
    }

}

customElements.define('task-card',TaskCard);