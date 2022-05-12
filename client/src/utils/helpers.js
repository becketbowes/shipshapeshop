export function pluralize(name, count) {
  if (count === 1) {
    return name
  }
  return name + 's'
}

export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    //open connection v.1
    const request = window.indexedDB.open('shipshapeshop', 1);

    //vars to reference db, transaction, object store
    let db, tx, store;

    //if first time or version changes, make object store
    request.onupgradeneeded = function(e) {
      const db = request.result;
      db.createObjectStore('products', { keyPath: '_id'});
      db.createObjectStore('categories', { keyPath: '_id'});
      db.createObjectStore('cart', { keyPath: '_id'});
    };

    //error handling
    request.onerror = function(e) {
      console.log('shits on fire yo')
    };

    //once db opens
    request.onsuccess = function(e) {
      db = request.result;
      //transaction to do what we want as storeName
      tx = db.transaction(storeName, 'readwrite');
      //save reference to object store
      store = tx.objectStore(storeName);

      db.onerror = function(e) {
        console.log('error', e);
      };

      switch (method) {
        case 'put':
          store.put(object);
          resolve(object);
          break;
        case 'get':
          const all = store.getAll();
          all.onsuccess = function() {
            resolve(all.result);
          };
          break;
        case 'delete':
          store.delete(object._id);
          break;
        default:
          console.log('no such method');
          break;
      }

      //close connection
      tx.oncomplete = function() {
        db.close();
      }
    }
  });
}