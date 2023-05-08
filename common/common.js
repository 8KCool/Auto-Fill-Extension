const showLoading = () => {
    $(".main-content").hide();
    $(".loading-bar").show();
}

const hideLoading = () => {
    $(".loading-bar").hide();
    $(".main-content").fadeIn();
}

const initPieChart = () => {
    $('.continue-button .chart').easyPieChart({
        size: 30,
        barColor: "lightgreen",
        scaleLength: 0,
        lineWidth: 4,
        trackColor: "white",
        lineCap: "circle",
        animate: 1000,
    });
}

const updatePieChart = (pro) => {
    $('.continue-button .chart font').text(pro);
    $('.continue-button .chart').data('easyPieChart').update(pro);
}