import { store } from "../core/store";

export class SettingsPage extends HTMLElement {
    private unsubscribe: (() => void) | null = null;

    constructor(){
        super();
        this.innerHTML = `
            <div style="padding: 20px;">
                <h2>设置</h2>
                <p>
                    主题:
                    <button id="theme-toggle">切换为暗色</button>
                </p>
                <app-link href="/">回到看板</app-link>
            </div>
        `;
    }

    connectedCallback(){
        const btn = this.querySelector('#theme-toggle') as HTMLButtonElement;
        if(btn){
            btn.addEventListener('click', () => {
                store.state.ui.theme = store.state.ui.theme === 'light' ? 'dark' : 'light';

            });

            this.unsubscribe = store.subscribe(() => this.updateButton());
            this.updateButton();
        }
    }

    disconnectedCallback(){
        this.unsubscribe?.();
    }

    private updateButton(){
        const btn = this.querySelector('#theme-toggle') as HTMLButtonElement;
        if(btn){
            btn.textContent = store.state.ui.theme === 'light' ? '切换为暗色' : '切换为亮色';
        }
    }
}

customElements.define('settings-page', SettingsPage);