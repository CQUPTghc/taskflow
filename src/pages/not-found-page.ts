export class NotFoundPage extends HTMLElement{
    constructor(){
        super();
        this.innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <h1>404</h1>
                <p>页面不存在</p>
                <app-link href="/">回到首页<app-link>
            </div>
        `;
    }
}

customElements.define('not-found-page', NotFoundPage);