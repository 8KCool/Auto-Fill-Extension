var loadingBar;

document.addEventListener("DOMContentLoaded", function() {
    var registerButton = document.getElementById("register_btn");
    registerButton.addEventListener('click', function() {
        registerUser();
    });
    loadingBar = document.getElementById("loading");
    showLoading();
});

var registerUser = () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    
    const db = openDatabase('user.db', '1.0', 'User database', 2 * 1024 * 1024);
    db.transaction(function(tx) {
        tx.executeSql('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, password, email]);
    });    
}

var showLoading = () => {
    if(loadingBar)
        loadingBar.style.display = 'block';
}

var hideLoading = () => {
    if(loadingBar)
        loadingBar.style.display = 'none';
}