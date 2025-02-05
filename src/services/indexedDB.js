const DB_NAME = 'projectsDB';
const DB_VERSION = 1;
const STORE_NAME = 'projects';

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
};

const serializeData = (data) => {
  if (data === null || data === undefined) return data;
  if (data instanceof Date) return data.toISOString();
  if (Array.isArray(data)) return data.map(item => serializeData(item));
  if (typeof data === 'object') {
    const serialized = {};
    for (const [key, value] of Object.entries(data)) {
      serialized[key] = serializeData(value);
    }
    return serialized;
  }
  return data;
};

const deserializeData = (data) => {
  if (data === null || data === undefined) return data;
  if (Array.isArray(data)) return data.map(item => deserializeData(item));
  if (typeof data === 'object') {
    const deserialized = {};
    for (const [key, value] of Object.entries(data)) {
      // Convert ISO date strings back to Date objects
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
        deserialized[key] = new Date(value);
      } else {
        deserialized[key] = deserializeData(value);
      }
    }
    return deserialized;
  }
  return data;
};

export const saveProjects = async (projects) => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // Clear existing data
    await new Promise((resolve, reject) => {
      const clearRequest = store.clear();
      clearRequest.onsuccess = () => resolve();
      clearRequest.onerror = () => reject(clearRequest.error);
    });

    // Save new data
    await new Promise((resolve, reject) => {
      // Create a deeply serialized copy of the projects array
      const serializableProjects = serializeData(projects);
      
      const addRequest = store.add({ id: 1, projects: serializableProjects });
      addRequest.onsuccess = () => resolve();
      addRequest.onerror = () => reject(addRequest.error);
    });

    return true;
  } catch (error) {
    console.error('Error saving projects:', error);
    return false;
  }
};

export const loadProjects = async () => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    const result = await new Promise((resolve, reject) => {
      const getRequest = store.get(1);
      getRequest.onsuccess = () => resolve(getRequest.result);
      getRequest.onerror = () => reject(getRequest.error);
    });

    // Deserialize the data before returning
    const deserializedProjects = deserializeData(result?.projects || []);
    return deserializedProjects;
  } catch (error) {
    console.error('Error loading projects:', error);
    return [];
  }
};