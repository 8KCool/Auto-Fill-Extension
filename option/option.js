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
            RolesPage.init();
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
            $(".edit-form").change(function () {
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
    init: () => {
        $(".edit-show").show();
        showLoading();
        $("#edit_content").load('./pages/personal/index.html', () => {
            hideLoading();
            checkValidatePage(false);
            refreshTabButton();
            $(".edit-form").change(function () {
                checkValidatePage(false);
            })
        });
    },
    checkValidate: () => {
        return true;
    }
}

// function to load the Education page
const EducationPage = {
    init: () => {
        $(".edit-show").show();
        showLoading();
        $("#edit_content").load('./pages/education/index.html', () => {
            hideLoading();
            checkValidatePage(false);
            refreshTabButton();
            $(".edit-form").change(function () {
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
            hideLoading();
            checkValidatePage(false);
            refreshTabButton();
            $(".edit-form").change(function () {
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
            hideLoading();
            checkValidatePage(false);
            refreshTabButton();
            $(".edit-form").change(function () {
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
            hideLoading();
            checkValidatePage(false);
            refreshTabButton();
            $(".edit-form").change(function () {
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
            $(".edit-form").change(function () {
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
            $(".edit-form").change(function () {
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
    var elemInputs = $("input.edit-form");
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
    })

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
                $(element).click(function() {
                    tabPageLoad(element);
                });
            }
        }
    })
    $(".main-tab-btn").removeClass("active");
    $("#main-tab-button-" + currentPageIndex).addClass("active");
}

var pageList = [RolesPage, PersonalPage, EducationPage, ExperiencePage, WorkauthPage, EEOPage, SkillsPage, ResumePage];
