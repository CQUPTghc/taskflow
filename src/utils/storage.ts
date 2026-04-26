import { openDB, type DBSchema } from "idb";

interface TaskFlowDB extends DBSchema{
    tasks:{
        key: string;
        value:{
            id:string;
            title:string;
            description?:string;
            columnId:string;
        };
    };
    columns:{
        key: string;
        value:{
            id:string;
            title:string;
        };
    };
}

const dbPromise = openDB<TaskFlowDB>('TaskFlowDB', 1, {
    //TaskFlowDB 1.数据库的结构类型 2.数据库的名称 
    // 1指定义的数据库版本号
    upgrade(db){
        if(!db.objectStoreNames.contains('tasks')){
            db.createObjectStore('tasks', {keyPath:'id'});
        }
        if(!db.objectStoreNames.contains('columns')){
            db.createObjectStore('columns', {keyPath:'id'});
        }
    }
});

export async function saveToDB(tasks: any[], columns: any[]) {
    const plainTasks = JSON.parse(JSON.stringify(tasks));
    const plainColumns = JSON.parse(JSON.stringify(columns));


    const db = await dbPromise;

    const tx = db.transaction(['tasks', 'columns'], 'readwrite');

    await tx.objectStore('tasks').clear();
    await tx.objectStore('columns').clear();

    for (const task of plainTasks){
        await tx.objectStore('tasks').put(task);
    }
    for (const col of plainColumns){
        await tx.objectStore('columns').put(col);
    }

    await tx.done;
}

export async function loadFromDB() {
    const db = await dbPromise;
    const tasks = await db.getAll('tasks');
    const columns = await db.getAll('columns');
    return {tasks,columns};
}