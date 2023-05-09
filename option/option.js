var currentPageIndex = 0;

$(document).ready(() => {
    loadHelloPage();
    initPieChart();

    $(".continue-button").click(() => {
        if (checkValidatePage(true) && pageList[currentPageIndex].checkValidate()) {
            nextPageLoad();
        }
    });

    $(".main-tab-btn-before").click(() => {
        prevPageLoad();
    });
});

// function to load the next page when continue button clicked
const nextPageLoad = () => {
    var oldpage = currentPageIndex;
    currentPageIndex++;
    if (currentPageIndex >= pageList.length) {
        currentPageIndex = pageList.length - 1;
    }
    if (currentPageIndex != oldpage)
        pageList[currentPageIndex].init();
}

// function to load the next page when continue button clicked
const prevPageLoad = () => {
    var oldpage = currentPageIndex;
    currentPageIndex--;
    if (currentPageIndex < 0) {
        currentPageIndex = 0;
    }
    if (currentPageIndex != oldpage)
        pageList[currentPageIndex].init();
}

// function to load the next page when continue button clicked
const tabPageLoad = (element) => {
    var oldpage = currentPageIndex;
    currentPageIndex = parseInt($(element).attr("data"));
    if (currentPageIndex != oldpage)
        pageList[currentPageIndex].init();
}

// function to load the hello page
const loadHelloPage = () => {
    showLoading();
    currentPageIndex = 0;
    $("#edit_content").load('./pages/hello/index.html', () => {
        hideLoading();
        $("#start_btn").click(function () {
            EEOPage.init();
        })
    });
}

// function to load the roles page
const RolesPage = {
    init: () => {
        $(".edit-show").show();
        showLoading();
        $("#edit_content").load('./pages/roles/index.html', () => {
            hideLoading();
            checkValidatePage(false);
            refreshTabButton();
            $(".validate-input-form").change(function () {
                checkValidatePage(false);
            })
        });
    },
    checkValidate: () => {
        return true;
    }

}

// function to load the Personal page
const PersonalPage = {
    init: async () => {
        $(".edit-show").show();
        showLoading();
        $("#edit_content").load('./pages/personal/index.html', async () => {
            refreshTabButton();
            await PersonalPage.initCountrySelectData();
            customSelect.init("country-select");
            checkValidatePage(false);
            hideLoading();
            $(".validate-input-form").change(function () {
                checkValidatePage(false);
            })
        });
    },

    checkValidate: () => {
        return true;
    },

    // get all country names and set data
    initCountrySelectData: async () => {
        await $.getJSON("https://trial.mobiscroll.com/content/countries.json", function (resp) {
            // var countries = [];
            for (var i = 0; i < resp.length; ++i) {
                var country = resp[i];
                // countries.push({ text: country.text, value: country.value });
                $(".country-select .options-container").append(
                    `<div class="option">
                        <img class="mr-2" width="24" height="16" src="https://img.mobiscroll.com/demos/flags/${country.value}.png" />
                        <input type="radio" class="radio mt-1" data-id="${country.text.toLowerCase()}" name="category" />
                        <label for="${country.text.toLowerCase()}">${country.text}</label>
                    </div>`
                );
            }
        });
    }
}

// function to load the Education page
const EducationPage = {
    init: () => {
        $(".edit-show").show();
        showLoading();
        $("#edit_content").load('./pages/education/index.html', () => {
            checkValidatePage(false);
            refreshTabButton();
            initSelectYear();
            hideLoading();
            $(".validate-input-form").change(function () {
                checkValidatePage(false);
            })
        });
    },
    checkValidate: () => {
        return true;
    }
}

// function to load the Experience page
const ExperiencePage = {
    init: () => {
        $(".edit-show").show();
        showLoading();
        $("#edit_content").load('./pages/experience/index.html', () => {
            checkValidatePage(false);
            initSelectYear();
            refreshTabButton();
            hideLoading();
            $(".validate-input-form").change(function () {
                checkValidatePage(false);
            })
        });
    },
    checkValidate: () => {
        return true;
    }
}

// function to load the Experience page
const WorkauthPage = {
    init: () => {
        $(".edit-show").show();
        showLoading();
        $("#edit_content").load('./pages/workauth/index.html', () => {
            checkValidatePage(false);
            refreshTabButton();
            customRadioButton.init("auth_us_radio");
            customRadioButton.init("visa_radio");
            hideLoading();
            $(".validate-input-form").change(function () {
                checkValidatePage(false);
            })
        });
    },
    checkValidate: () => {
        return true;
    }
}

// function to load the EEO page
const EEOPage = {
    init: () => {
        $(".edit-show").show();
        showLoading();
        $("#edit_content").load('./pages/EEO/index.html', () => {
            checkValidatePage(false);
            refreshTabButton();
            customRadioButton.init("disability_radio");
            customRadioButton.init("vertain_radio");
            customRadioButton.init("lgbtq_radio");
            customRadioButton.init("gender_radio");
            hideLoading();
            $(".validate-input-form").change(function () {
                checkValidatePage(false);
            })
        });
    },
    checkValidate: () => {
        return true;
    }
}

// function to load the skills page
const SkillsPage = {
    init: () => {
        $(".edit-show").show();
        showLoading();
        $("#edit_content").load('./pages/skills/index.html', () => {
            hideLoading();
            checkValidatePage(false);
            refreshTabButton();
            $(".validate-input-form").change(function () {
                checkValidatePage(false);
            })
        });
    },
    checkValidate: () => {
        return true;
    }
}

// function to load the resume page
const ResumePage = {
    init: () => {
        $(".edit-show").show();
        showLoading();
        $("#edit_content").load('./pages/resume/index.html', () => {
            hideLoading();
            checkValidatePage(false);
            refreshTabButton();
            $(".validate-input-form").change(function () {
                checkValidatePage(false);
            })
        });
    },
    checkValidate: () => {
        return true;
    }
}


// validate input form, show progress, control error show
const checkValidatePage = (errorshow) => {
    var elemInputs = $("input.validate-input-form");
    var inputCount = elemInputs.length;
    var totalCount = inputCount;
    var editedCount = 0;
    elemInputs.each((index, element) => {
        if ($(element).val().length == 0) {
            if (errorshow)
                $(element).addClass("validate-error");
        } else {
            $(element).removeClass("validate-error");
            editedCount++;
        }
    });

    if (totalCount == 0) {
        updatePieChart(100);
        return true;
    }
    updatePieChart(Math.floor(editedCount / totalCount * 100));
    return (totalCount == editedCount);
}

const refreshTabButton = () => {
    $(".main-tab-btn").each((index, element) => {
        if (!$(element).hasClass("edited")) {
            if ($(element).hasClass("active")) {
                $(element).removeClass("active");
                $(element).addClass("edited");
                $(element).click(function () {
                    tabPageLoad(element);
                });
            }
        }
    })
    $(".main-tab-btn").removeClass("active");
    $("#main-tab-button-" + currentPageIndex).addClass("active");
}

var pageList = [RolesPage, PersonalPage, EducationPage, ExperiencePage, WorkauthPage, EEOPage, SkillsPage, ResumePage];
