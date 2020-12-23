let db;
// create a database request 
const request = indexDB.open("transaction", 1);

// seed/update database with .onupgradeneeded
request.onupgradeneeded = function (e) {
    // set up db
    const db = evt.target.result;
    // set up pending data
    db.createOnjectStore("pending", { autoincrement : true });
};

// function check connection .onsuccess
request.onsuccess = function (e) {
    db = e.target.result;

}

// catch error
request.onerror = function(e) {
    console.loge(event.target.errorCode)
}

// a function take pending records entered offline

// a function complete transaction POST into database once connected online

    // clear items once all complete

// listen to online, call function to operate transaction 
window.addEventListener("online", insertToDataBase);

