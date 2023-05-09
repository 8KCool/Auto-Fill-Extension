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

const customSelect = () => {

    const selected = document.querySelector(".selected");
    const optionsContainer = document.querySelector(".options-container");
    const searchBox = document.querySelector(".search-box input");

    const optionsList = document.querySelectorAll(".option");

    selected.addEventListener("click", () => {
        optionsContainer.classList.toggle("active");

        searchBox.value = "";
        filterList("");

        if (optionsContainer.classList.contains("active")) {
            searchBox.focus();
        }
    });

    optionsList.forEach(o => {
        o.addEventListener("click", () => {
            selected.innerHTML = o.querySelector("label").innerHTML;
            optionsContainer.classList.remove("active");
        });
    });

    searchBox.addEventListener("keyup", function (e) {
        filterList(e.target.value);
    });

    const filterList = searchTerm => {
        searchTerm = searchTerm.toLowerCase();
        optionsList.forEach(option => {
            let label = option.firstElementChild.nextElementSibling.innerText.toLowerCase();
            if (label.indexOf(searchTerm) != -1) {
                option.style.display = "block";
            } else {
                option.style.display = "none";
            }
        });
    };
}