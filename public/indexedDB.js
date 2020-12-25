// indexedDB setup

let db;

// open budget .open and create "budget", version 1
const request = indexDB.open("budget", 1)

// first load db .onupgradeneeded, pass variable with deconstruction
request.onupgradeneeded = function ({ target }) {

    // get db reference from data passed in function
    let db = target.result;

    // create pending schema
    db.createObjectStore("pending", { autoIncrement: true });
};


// connection .onsuccess
request.oncussess = function ({ target }) {

    // get db reference
    db = target.result;

    // if online
    if (navidator.onLine) {

        // function read database
        onlineOperation();
    };

};

// err catching .onerror
request.onerror = function ({ target }) {

    // print error code
    console.log(target.errorCode);
}

// function to store record
function saveRecord(record) {

    console.log("storing record");

    // getting references
    // create a transaction
    const transaction = db.transaction = db.transaction(["pending"], "readwrite");

    // access to pending object store
    const store = transaction.onjectStore("pending");

    // add record (passed in data) to store 
    store.add(record)

};

// function read database
function onlineOperation() {

    console.log("online");

    // get reference to db and store 
    const transaction = db.transaction(["pending"], "readwrite")
    const store = transaction.objectStore("pending");
    const fetchPending = store.getAll();

    // insert everything in bulk to db 
    fetchPending.oncussess = function () {

        // if there are pending records (bulk)
        if (fetchPending.result.length > 0) {
            fetch("/api/transction/bulk", {
                method: "POST",
                body: JSON.stringify(fetchPending.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "content-Type": "application/json"
                }
            })

                .then(response => {
                    // format response to object
                    return response.json();
                })

                // clear pending
                .then(() => {

                    // get reference
                    const transaction = db.transaction(["pending"], "readwrite");
                    const store = transaction.objectStore("pending");

                    // clear table
                    store.clear();
                });
        }
    };
}
// listen for app online/offline
window.addEventListener("online", onlineOperation);