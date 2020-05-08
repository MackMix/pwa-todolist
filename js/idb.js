import { openDB } from 'idb';

export async function initDB() {
    const db = await openDB('awesome-todo',  1, {
        upgrade(db) {
            const store = db.createObjectStore('task', {
                keyPath: 'id',
            });
            store.createIndex('state', 'state');
            store.createIndex('date', 'date');
        },
    });
    return db;
}

export async function setTodos(data) {
    const db = await initDB();
    const tx = db.transaction('task', 'readwrite');
    data.forEach(item => {
        tx.store.put(item);
    });
    await tx.done;
    return await db.getAll('task');
}

export async function setTodo(data) {
    const db = await initDB();
    const tx = db.transaction('task', 'readwrite');
    return await tx.store.put(data);
}

export async function unsetTodo(id) {
    const db = await initDB();
    
    return await db.delete('task', id);
  }

export async function getTodos() {
    const db = await initDB();
    return await db.getAll('task');
}

export async function getTodo(id) {
    const db = await initDB();
    return await db.get('task', id);
}

