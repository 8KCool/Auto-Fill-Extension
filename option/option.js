var currentPageIndex = 0;
var pageName = ["Roles", "Personal", "Education", "Experience", "Workauth", "EEO", "Skills", "Resume"];


$(document).ready(() => {
    loadHelloPage();
    initPieChart();

    $(".continue-button").click(async () => {
        if (checkValidatePage(true) && pageList[currentPageIndex].checkValidate()) {
            showLoading();
            saveCurrentData(function (state) {
                if (state)
                    nextPageLoad();
                hideLoading();
            });
        }
    });

    $(".main-tab-btn-before").click(() => {
        prevPageLoad();
    });
});

// function  to save the current Page data into Index DB Google
const saveCurrentData = (callback) => {
    var savedData = pageList[currentPageIndex].getSaveData();
    let option;
    switch (currentPageIndex) {
        case 0: option = { "Roles": savedData }; break;
        case 1: option = { "Personal": savedData }; break;
        case 2: option = { "Education": savedData }; break;
        case 3: option = { "Experience": savedData }; break;
        case 4: option = { "Workauth": savedData }; break;
        case 5: option = { "EEO": savedData }; break;
        case 6: option = { "Skills": savedData }; break;
        case 7: option = { "Resume": savedData }; break;
    }
    chrome.storage.local.set(option, () => {
        if (chrome.runtime.lastError) {
            console.log('Error setting');
            callback(false);
        }
        console.log('Stored: ' + savedData);
        callback(true);
    });
}

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
        $("#edit_content").load('./pages/roles/index.html', async () => {
            await RolesPage.getCurrentSavedData();
            checkValidatePage(false);
            refreshTabButton();
            hideLoading();
            $(".validate-input-form").change(function () {
                checkValidatePage(false);
            })
        });
    },
    checkValidate: () => {
        return true;
    },
    getSaveData: () => {
        return {
            firstName: $("#first_name_input").val(),
            lastName: $("#last_name_input").val()
        }
    },
    getCurrentSavedData: async () => {
        const key = pageName[currentPageIndex];
        const result = await chrome.storage.local.get(key);
        if (chrome.runtime.lastError){
            console.log('Error getting');
        }
        else if (result && result.Roles) {
            var rolesData = result.Roles;
            $("#first_name_input").val(rolesData["firstName"]);
            $("#last_name_input").val(rolesData["lastName"]);
        }
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

            await PersonalPage.getCurrentSavedData();
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
    }, 
    getSaveData: () => {
        return {
            email: $("#email").val(),
            address_line: $("#address_line").val(),
            city: $("#city").val(),
            state: $("#state").val(),
            postal_code: $("#postal_code").val(),
            phone_number: $("#phone_number").val(),
            phone_code: $("#phone_code").val(),
            phone_extension: $("#phone_extension").val(),
        }
    },
    getCurrentSavedData: async () => {
        const key = pageName[currentPageIndex];
        const result = await chrome.storage.local.get(key);
        if (chrome.runtime.lastError){
            console.log('Error getting');
        }
        else if (result && result.Personal) {
            var personData = result.Personal;
            $("#email").val(personData['email']);
            $("#address_line").val(personData['address_line']);
            $("#city").val(personData['city']);
            $("#state").val(personData['state']);
            $("#postal_code").val(personData['postal_code']);
            $("#phone_number").val(personData['phone_number']);
            $("#phone_code").val(personData['phone_code']);
            $("#phone_extension").val(personData['phone_extension']);
        }
    }
}

// function to load the Education page
const EducationPage = {
    init: () => {
        $(".edit-show").show();
        showLoading();
        $("#edit_content").load('./pages/education/index.html', async () => {
            initSelectYear();
            await EducationPage.getCurrentSavedData();
            checkValidatePage(false);
            refreshTabButton();
            hideLoading();
            $(".validate-input-form").change(function () {
                checkValidatePage(false);
            })
        });
    },
    checkValidate: () => {
        return true;
    },
    getSaveData: () => {
        return {
            school_name: $("#school_name").val(),
            major: $("#major").val(),
            degree_type: $("#degree_type").val(),
            gpa: $("#gpa").val(),
            edu_start_month: $("#edu_start_month").val(),
            edu_start_year: $("#edu_start_year").val(),
            edu_end_month: $("#edu_end_month").val(),
            edu_end_year: $("#edu_end_year").val(),
        }
    },
    getCurrentSavedData: async () => {
        const key = pageName[currentPageIndex];
        const result = await chrome.storage.local.get(key);
        if (chrome.runtime.lastError){
            console.log('Error getting');
        }
        else if (result && result.Education) {
            var educationData = result.Education;
            $("#school_name").val(educationData['school_name']);
            $("#major").val(educationData['major']);
            $("#degree_type").val(educationData['degree_type']);
            $("#gpa").val(educationData['gpa']);
            $("#edu_start_month").val(educationData['edu_start_month']);
            $("#edu_start_year").val(educationData['edu_start_year']);
            $("#edu_end_month").val(educationData['edu_end_month']);
            $("#edu_end_year").val(educationData['edu_end_year']);
        }
    }
}

// function to load the Experience page
const ExperiencePage = {
    init: () => {
        $(".edit-show").show();
        showLoading();
        $("#edit_content").load('./pages/experience/index.html', async () => {
            initSelectYear();
            await ExperiencePage.getCurrentSavedData();
            refreshTabButton();
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
    getSaveData: () => {
        return {
            experience_company: $("#experience_company").val(),
            experience_location: $("#experience_location").val(),
            experience_position_title: $("#experience_position_title").val(),
            experience_title: $("#experience_title").val(),
            experience_start_month: $("#experience_start_month").val(),
            experience_start_year: $("#experience_start_year").val(),
            experience_end_month: $("#experience_end_month").val(),
            experience_end_year: $("#experience_end_year").val(),
            experience_description: $("#experience_description").val(),
        }
    },
    getCurrentSavedData: async () => {
        const key = pageName[currentPageIndex];
        const result = await chrome.storage.local.get(key);
        if (chrome.runtime.lastError){
            console.log('Error getting');
        }
        else if (result && result.Experience) {
            var experienceData = result.Experience;
            $("#experience_company").val(experienceData['experience_company']);
            $("#experience_location").val(experienceData['experience_location']);
            $("#experience_position_title").val(experienceData['experience_position_title']);
            $("#experience_title").val(experienceData['experience_title']);
            $("#experience_start_month").val(experienceData['experience_start_month']);
            $("#experience_start_year").val(experienceData['experience_start_year']);
            $("#experience_end_month").val(experienceData['experience_end_month']);
            $("#experience_end_year").val(experienceData['experience_end_year']);
            $("#experience_description").val(experienceData['experience_description']);
        }
    }
}

// function to load the Experience page
const WorkauthPage = {
    init: () => {
        $(".edit-show").show();
        showLoading();
        $("#edit_content").load('./pages/workauth/index.html', async () => {
            customRadioButton.init("auth_us_radio");
            customRadioButton.init("visa_radio");
            await WorkauthPage.getCurrentSavedData();
            checkValidatePage(false);
            refreshTabButton();
            hideLoading();
            $(".validate-input-form").change(function () {
                checkValidatePage(false);
            })
        });
    },
    checkValidate: () => {
        return true;
    },
    getSaveData: () => {
        return {
            auth_us: customRadioButton.getValue("auth_us_radio"),
            visa: customRadioButton.getValue("visa_radio")
        }
    },
    getCurrentSavedData: async () => {
        const key = pageName[currentPageIndex];
        const result = await chrome.storage.local.get(key);
        if (chrome.runtime.lastError){
            console.log('Error getting');
        }
        else if (result && result.Workauth) {
            var workAuthData = result.Workauth;
            customRadioButton.setValue("auth_us_radio", workAuthData['auth_us']);
            customRadioButton.setValue("visa_radio", workAuthData['visa']);
        }
    }
}

// function to load the EEO page
const EEOPage = {
    init: () => {
        $(".edit-show").show();
        showLoading();
        $("#edit_content").load('./pages/EEO/index.html', async () => {
            customRadioButton.init("disability_radio");
            customRadioButton.init("vertain_radio");
            customRadioButton.init("lgbtq_radio");
            customRadioButton.init("gender_radio");
            await EEOPage.getCurrentSavedData();
            checkValidatePage(false);
            refreshTabButton();
            hideLoading();
            $(".validate-input-form").change(function () {
                checkValidatePage(false);
            })
        });
    },
    checkValidate: () => {
        return true;
    },
    getSaveData: () => {
        return {
            disability: customRadioButton.getValue("disability_radio"),
            vertain: customRadioButton.getValue("vertain_radio"),
            lgbtq: customRadioButton.getValue("lgbtq_radio"),
            gender: customRadioButton.getValue("gender_radio"),
            ethnicity: $("#ethnicity").val(),
        }
    },
    getCurrentSavedData: async () => {
        const key = pageName[currentPageIndex];
        const result = await chrome.storage.local.get(key);
        if (chrome.runtime.lastError){
            console.log('Error getting');
        }
        else if (result && result.EEO) {
            var eeoData = result.EEO;
            customRadioButton.setValue("disability_radio", eeoData['disability']);
            customRadioButton.setValue("vertain_radio", eeoData['vertain']);
            customRadioButton.setValue("lgbtq_radio", eeoData['lgbtq']);
            customRadioButton.setValue("gender_radio", eeoData['gender']);
            $("#ethnicity").val(eeoData['ethnicity']);
        }
    }
}

// function to load the skills page
const SkillsPage = {
    init: () => {
        $(".edit-show").show();
        showLoading();
        $("#edit_content").load('./pages/skills/index.html', async () => {
            checkValidatePage(false);
            refreshTabButton();
            // await SkillsPage.initSkillsData();
            // customSelect.init("skills-select"); 
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
    initSkillsData: async () => {
        await $.getJSON("https://trial.mobiscroll.com/content/countries.json", function (resp) {
            // var countries = [];
            for (var i = 0; i < resp.length; ++i) {
                var country = resp[i];
                // countries.push({ text: country.text, value: country.value });
                $(".skills-select .options-container").append(
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
