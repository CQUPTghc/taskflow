import { saveToDB, loadFromDB } from "../utils/storage";

type Listener = () => void;

function isObject(value: unknown): value is Record<string, unknown>{
  return value!== null && typeof value === 'object';
}

//createStore函数返回原对象的代理对象（有拦截功能）和一个订阅原对象的方法
export function createStore<T extends object>(initialState: T) {
  // 使用 Set 存储监听函数，确保不重复
  const listeners = new Set<Listener>();

  function deepProxy<U extends object>(initialState: U) {
    // 创建 Proxy 拦截属性赋值操作
    return new Proxy(initialState, {
      //store.state.tasks.push({ id: '4', title: '新任务', columnId: 'col3' })
      get(target, prop, receiver) {
        const res = Reflect.get(target, prop, receiver);
        if (typeof res === 'object' && res !== null) {
          return deepProxy(res);
        }
        return res;
      },

      set(target, prop, value, receiver) {
        const oldValue = Reflect.get(target, prop, receiver);
        // 如果值没有变化，跳过通知（可选优化）
        if (oldValue === value) {
          return true;
        }
        // 执行默认赋值
        Reflect.set(target, prop, value, receiver);
        // 通知所有订阅者
        listeners.forEach((listener) => listener());
        return true;
      },
    });
  }

  const state = deepProxy(initialState);

  return {
    state,
    subscribe(listener: Listener) {
      listeners.add(listener);
      // 返回取消订阅函数
      return () => listeners.delete(listener);
    },
  };
}

// ---------- 应用状态定义 ----------
export interface Task {
  id: string;
  title: string;
  description?: string;
  columnId: string; // 所属列的 id
}

export interface Column {
  id: string;
  title: string;
}

export interface AppState {
  tasks: Task[];
  columns: Column[];
  ui: {
    theme: 'light' | 'dark';
  };
}

const emptyState: AppState = {
  tasks:[],
  columns:[],
  ui:{
    theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  }
};

// 初始演示数据
const initialState = {
  tasks: [
    { id: "1", title: "学习 Proxy", columnId: "col1" },
    { id: "2", title: "掌握 Web Components", columnId: "col1" },
    { id: "3", title: "搭建 Vite 项目", columnId: "col2" },
  ],
  columns: [
    { id: "col1", title: "待办" },
    { id: "col2", title: "进行中" },
    { id: "col3", title: "已完成" },
  ],
};

// 创建并导出全局 store 实例
export const store = createStore(emptyState);

async function initStore() {
  const { tasks, columns } = await loadFromDB();
  if(tasks.length > 0 || columns.length > 0){
    store.state.tasks = tasks;
    store.state.columns = columns;
  } else{
    store.state.tasks = initialState.tasks;
    store.state.columns = initialState.columns;

    await saveToDB(store.state.tasks, store.state.columns);
  }
}

let saveTimer: number | undefined;
store.subscribe(() => {
  clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    saveToDB(store.state.tasks, store.state.columns);
  }, 300);
});

store.subscribe(() => {
  const currentTheme = store.state.ui.theme;
  document.documentElement.setAttribute('data-theme', currentTheme);
  localStorage.setItem('theme', currentTheme);
})

initStore();

// 挂载到 window 方便调试
if (typeof window !== "undefined") {
  (window as any).store = store;
}

// function deepProxy<T extends object>(target: T): T {
//   return new Proxy(target, {
//     get(obj, key, receiver) {
//       // 1. 获取当前属性的值
//       const res = Reflect.get(obj, key, receiver);

//       // 2. 如果值是对象或数组，则动态返回一个它的 Proxy（递归代理）
//       if (typeof res === 'object' && res !== null) {
//         return deepProxy(res);
//       }

//       return res;
//     },

//     set(obj, key, value, receiver) {
//       console.log(`[拦截到修改] 属性: ${String(key)}, 新值:`, value);
//       // 3. 执行真正的赋值操作
//       return Reflect.set(obj, key, value, receiver);
//     }
//   });
// }
