export type PageConstructor = new () => HTMLElement;

class Router{
    private routes: Map<string, PageConstructor> = new Map();
    private outlet: HTMLElement | null = null;
    private currentPage: HTMLElement | null = null;

    init(outletSelector: string){//outlet:#app
        this.outlet = document.querySelector(outletSelector);
        if(!this.outlet){
            throw new Error(`Router outlet "${outletSelector}" not found`);
        }

        window.addEventListener('popstate', () => this.render());

        this.render();
    }

    addRoute(path: string, pageConstructor: PageConstructor){
        this.routes.set(path, pageConstructor);
        
    }

    navigate(path:string){
        if(window.location.pathname !== path){
            history.pushState(null, '', path);
            this.render();
        }
    }

    private render(){
        const path = window.location.pathname;
        
        const PageConstructor = this.routes.get(path);
        
        if(!this.outlet) return;

        if(this.currentPage){
            this.currentPage.remove();
            this.currentPage = null;
        }

        if(PageConstructor){
            this.currentPage = new PageConstructor();
            this.outlet.appendChild(this.currentPage);
            
        } else {
            this.outlet.innerHTML = '<not-found-page></not-found-page>';
        }
    }
}

export const router = new Router();