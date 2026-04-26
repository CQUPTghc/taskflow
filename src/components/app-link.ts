import { router } from "../core/router";

class AppLink extends HTMLElement{
    static get observedAttributes(){
        return ['href'];
    }

    constructor(){
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback(){
        this.render();
        this.addEventListener('click', this.handleClick);
    }

    disconnectedCallback(){
        this.removeEventListener('click', this.handleClick);
    }

    attributeChangedCallback(){
        this.render();
    }

    private handleClick = (e: Event) => {
        e.preventDefault();
        const href = this.getAttribute('href');
        if(href){
            router.navigate(href);
        }
    };

    private render(){
        const href = this.getAttribute('href') || '#';
        this.shadowRoot!.innerHTML = `
            <style>
                a{
                    color: #0066cc;
                    text-decoration: none;
                    cursor: pointer;
                }
                a:hover{
                    text-decoration: underline;
                }
            </style>
            <a href="${href}"><slot></slot></a>
        `;
    }
}

customElements.define('app-link', AppLink);