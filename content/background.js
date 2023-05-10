chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.message === "open edit page") {
        chrome.tabs.create({ url: chrome.runtime.getURL('./option/option.html') });
    }
    else if (request.message == "db") {
        var data = request.payload;
        if (data.type == "create") {
            debugger;
            create_database(function (result) {
                console.log(result);
                sendResponse(result);
            });
        } else if (data.type == "insert") {
            insert_records(data, function (result) {
                sendResponse(result);
            });
        }
    }
});


// background.js
let db = null;
const DBName = "Profile";

function create_database(callback) {
    const request = indexedDB.open(DBName);
    request.onerror = function (event) {
        callback({
            status: false,
            msg: "Problem opening DB."
        });
    }

    request.onsuccess = function (event) {
        db = event.target.result;
        callback({
            status: true,
            msg: "DB is opened"
        });

        db.onerror = function (event) {
            callback({
                status: false,
                msg: "FAILED TO OPEN DB"
            });
        }
    }
}

// background.js
function insert_records(records) {
    if (db) {
        const insert_transaction = db.transaction(DBName, "readwrite");
        const objectStore = insert_transaction.objectStore(DBName);

        return new Promise((resolve, reject) => {
            insert_transaction.oncomplete = function () {
                console.log("ALL INSERT TRANSACTIONS COMPLETE.");
                resolve(true);
            }

            insert_transaction.onerror = function () {
                console.log("PROBLEM INSERTING RECORDS.")
                resolve(false);
            }

            records.forEach(person => {
                let request = objectStore.add(person);

                request.onsuccess = function () {
                    console.log("Added: ", person);
                }
            });
        });
    }
    else {
        create_database();
    }
}


// background.js
function get_record(email) {
    if (db) {
        const get_transaction = db.transaction(DBName, "readonly");
        const objectStore = get_transaction.objectStore(DBName);

        return new Promise((resolve, reject) => {
            get_transaction.oncomplete = function () {
                console.log("ALL GET TRANSACTIONS COMPLETE.");
            }

            get_transaction.onerror = function () {
                console.log("PROBLEM GETTING RECORDS.")
            }

            let request = objectStore.get(email);

            request.onsuccess = function (event) {
                resolve(event.target.result);
            }
        });
    }
}

function update_record(record) {
    if (db) {
        const put_transaction = db.transaction(DBName, "readwrite");
        const objectStore = put_transaction.objectStore(DBName);

        return new Promise((resolve, reject) => {
            put_transaction.oncomplete = function () {
                console.log("ALL PUT TRANSACTIONS COMPLETE.");
                resolve(true);
            }

            put_transaction.onerror = function () {
                console.log("PROBLEM UPDATING RECORDS.")
                resolve(false);
            }

            objectStore.put(record);
        });
    }
}

function delete_record(email) {
    if (db) {
        const delete_transaction = db.transaction(DBName,
            "readwrite");
        const objectStore = delete_transaction.objectStore(DBName);

        return new Promise((resolve, reject) => {
            delete_transaction.oncomplete = function () {
                console.log("ALL DELETE TRANSACTIONS COMPLETE.");
                resolve(true);
            }

            delete_transaction.onerror = function () {
                console.log("PROBLEM DELETE RECORDS.")
                resolve(false);
            }

            objectStore.delete(email);
        });
    }
}