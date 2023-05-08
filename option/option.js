$(document).ready(() => {
    loadHelloPage();
    initPieChart();
});

// function to load the hello page
const loadHelloPage = () => {
    showLoading();
    $("#edit_content").load('./pages/hello/index.html', () => {
        hideLoading();
        $("#start_btn").click(function() {
            loadEditRolesPage();
        })
    });
}

// function to load the roles page
const loadEditRolesPage = () => {
    $(".edit-show").show();
    showLoading();
    $("#edit_content").load('./pages/roles/index.html', () => {
        hideLoading();
        updatePieChart(0);
        initRolesPage();
    });
}

const initRolesPage = () => {
    var totalCnt = getInputCount();
    var editCnt = 0;
    $(".edit-form").change(function() {
        checkValidateRolesPage(false);
    })
}

// validate input form, show progress, control error show
const checkValidateRolesPage = (errorshow) => {
    
}





// count of the edit input to save data
const getInputCount = () => {
    return $(".edit-form").length;
}