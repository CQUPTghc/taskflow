export class SettingsPage extends HTMLElement {
    constructor(){
        super();
        this.innerHTML = `
            <div style="padding: 20px;">
                <h2>设置</h2>
                <p>主题切换等功能会放在这里。</p>
                <app-link href="/">回到看板</app-link>
            </div>
        `;
    }
}

customElements.define('settings-page', SettingsPage);