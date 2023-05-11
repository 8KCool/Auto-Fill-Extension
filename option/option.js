var currentPageIndex = 0;
var pageName = ["Roles", "Personal", "Education", "Experience", "Workauth", "EEO", "Skills", "Resume"];


$(document).ready(() => {
    // clear storage function
    // chrome.storage.local.clear(function() {
    //     var error = chrome.runtime.lastError;
    //     if (error) {
    //         console.error(error);
    //     }
    //     // do something more
    // });
    loadHelloPage();
    initPieChart();

    $(".continue-button").click(async () => {
        if (checkValidatePage(true) && pageList[currentPageIndex].checkValidate()) {
            saveCurrentData(function (state) {
                if (state && currentPageIndex != pageName.length - 1) {
                    showLoading();
                    nextPageLoad();
                }
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
            updatePieChart(0);
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
        if (chrome.runtime.lastError) {
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
            updatePieChart(0);
            await PersonalPage.initCountrySelectData();
            customSelect.init("country-select");
            await PersonalPage.getCurrentSavedData();
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
            country: $(".country-select").attr("data-value")
        }
    },
    getCurrentSavedData: async () => {
        const key = pageName[currentPageIndex];
        const result = await chrome.storage.local.get(key);
        if (chrome.runtime.lastError) {
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

            customSelect.setSelect("country-select", personData['country']);
        }
    }
}

// function to load the Education page
const EducationPage = {
    init: () => {
        $(".edit-show").show();
        showLoading();
        $("#edit_content").load('./pages/education/index.html', async () => {
            updatePieChart(0);
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
        if (chrome.runtime.lastError) {
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
            updatePieChart(0);
            initSelectYear();
            await ExperiencePage.getCurrentSavedData();
            refreshTabButton();
            checkValidatePage(false);
            hideLoading();
            
            $(".validate-input-form").change(function () {
                checkValidatePage(false);
            })

            $("#has_experience").change(function () {
                if (this.checked) {
                    $("#experience_panel").html("<p class='mb-3 ft-20'><i>You've come to the right place! Simplify has helped thousands of students land their first job.</i></p>")
                    $("#btn_add").hide();
                } else {
                    $("#btn_add").show();
                    $("#experience_panel").html(ExperiencePage.makeRenderTemplate(1));
                }
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
            experience_type: $("#experience_type").val(),
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
        if (chrome.runtime.lastError) {
            console.log('Error getting');
        }
        else if (result && result.Experience) {
            var experienceData = result.Experience;
            ExperiencePage.renderExperienceField(experienceData);
        }
    },

    renderExperienceField: (experienceData) => {
        var experience_count = -1;
        if (experienceData['experience_state']) {
            experience_count = parseInt(experienceData['experience_state']);
        }

        if (experience_count == -1) {
            // saved no data or unchecked no experience check box
            $("#experience_panel").append(ExperiencePage.makeRenderTemplate(1));
        } else if (experience_count == 0) {
            // checked no experience check box

        }
        else if (experience_count > 0) {
            $("#experience_panel").append(ExperiencePage.makeRenderTemplate(experience_count, data));
            // saved data
            // $("#experience_company").val(experienceData['experience_company']);
            // $("#experience_location").val(experienceData['experience_location']);
            // $("#experience_position_title").val(experienceData['experience_position_title']);
            // $("#experience_type").val(experienceData['experience_type']);
            // $("#experience_start_month").val(experienceData['experience_start_month']);
            // $("#experience_start_year").val(experienceData['experience_start_year']);
            // $("#experience_end_month").val(experienceData['experience_end_month']);
            // $("#experience_end_year").val(experienceData['experience_end_year']);
            // $("#experience_description").val(experienceData['experience_description']);
        }
    },

    makeRenderTemplate: (count, data) => {
        var html = "";
        if(data) {

        } else {
            for(var i = 1; i <= count; i ++) {
                html += `<div class="row w-100 col-sm-12">
                            <h3>Work Experience ${i}</h3>
                            </div>
                            <div class="row w-100">
                            <div class="col-sm-6 mb-3">
                                <h5 class="color-gray">Company</h5>
                                <input type="text" id="experience_company_${i}" class="form-control custom-input mt-2 validate-input-form"
                                placeholder="Company" />
                            </div>
                            <div class="col-sm-6 mb-3">
                                <h5 class="color-gray">Location</h5>
                                <input type="text" id="experience_location_${i}" class="form-control custom-input mt-2 validate-input-form"
                                placeholder="Location" />
                            </div>
                            </div>
                            <div class="row w-100">
                            <div class="col-sm-6 mb-3">
                                <h5 class="color-gray">Position Title</h5>
                                <input type="text" id="experience_position_title_${i}" class="form-control custom-input mt-2 validate-input-form"
                                placeholder="Position Title" />
                            </div>
                            <div class="col-sm-6 mb-3">
                                <h5 class="color-gray">Experience Title</h5>
                                <select class="form-control custom-select mt-2" id="experience_type_${i}">
                                <option value="Internship" selected>Internship</option>
                                <option value="Full-Time">Full-Time</option>
                                <option value="Part-Time">Part-Time</option>
                                </select>
                            </div>
                            </div>
        
                            <div class="row w-100 mb-3">
                            <div class="col-sm-4 mb-3">
                                <h5 class="color-gray">Start Month</h5>
                                <select class="form-control custom-select mt-2" id="experience_start_month_${i}">
                                <option value="January">January</option>
                                <option value="February">February</option>
                                <option value="March">March</option>
                                <option value="April">April</option>
                                <option value="May">May</option>
                                <option value="June">June</option>
                                <option value="July">July</option>
                                <option value="August">August</option>
                                <option value="September">September</option>
                                <option value="October">October</option>
                                <option value="November">November</option>
                                <option value="December">December</option>
                                </select>
                            </div>
                            <div class="col-sm-2 mb-3">
                                <h5 class="color-gray">Start Year</h5>
                                <select class="form-control custom-select mt-2 select-year" id="experience_start_year_${i}"></select>
                            </div>
                            <div class="col-sm-4 mb-3">
                                <h5 class="color-gray">End Month</h5>
                                <select class="form-control custom-select mt-2" id="experience_end_month_${i}">
                                <option value="January">January</option>
                                <option value="February">February</option>
                                <option value="March">March</option>
                                <option value="April">April</option>
                                <option value="May">May</option>
                                <option value="June">June</option>
                                <option value="July">July</option>
                                <option value="August">August</option>
                                <option value="September">September</option>
                                <option value="October">October</option>
                                <option value="November">November</option>
                                <option value="December">December</option>
                                </select>
                            </div>
                            <div class="col-sm-2 mb-3">
                                <h5 class="color-gray">End Year</h5>
                                <select class="form-control custom-select mt-2 select-year" id="experience_end_year_${i}"></select>
                            </div>
                            </div>
                            <div class="row w-100 mb-6">
                            <div class="col-sm-12 mb-3">
                                <h5 class="color-gray">Description</h5>
                                <input type="text" id="experience_description_${i}" class="form-control custom-input mt-2 validate-input-form"
                                placeholder="A couple sentences about your role" />
                            </div>
                        </div>`;
            }
        }
        return html;
    }

}

// function to load the Experience page
const WorkauthPage = {
    init: () => {
        $(".edit-show").show();
        showLoading();
        $("#edit_content").load('./pages/workauth/index.html', async () => {
            updatePieChart(0);
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
        if (chrome.runtime.lastError) {
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
            updatePieChart(0);
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
        if (chrome.runtime.lastError) {
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
            updatePieChart(0);
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
    },
    // todo
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
        if (chrome.runtime.lastError) {
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

// function to load the resume page
const ResumePage = {
    init: () => {
        $(".edit-show").show();
        showLoading();
        $("#edit_content").load('./pages/resume/index.html', async () => {
            updatePieChart(0);
            await ResumePage.getCurrentSavedData();
            checkValidatePage(false);
            refreshTabButton();
            hideLoading();
            $(".validate-input-form").change(function () {
                checkValidatePage(false);
            });

            $(".custom-file-input").on("change", function () {
                var fileName = $(this).val().split("\\").pop();
                $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
            });
        });
    },
    checkValidate: () => {
        return true;
    },
    getSaveData: () => {
        // get file data
        var resumeFileData = {};
        if ($("#customResumeFile").prop('files').length > 0) {
            var resume_file = $("#customResumeFile").prop('files')[0];

            const reader = new FileReader();
            reader.onload = (e) => {
                resumeFileData["name"] = resume_file.name;
                resumeFileData["type"] = resume_file.type;
                resumeFileData["size"] = resume_file.size;
                resumeFileData["lastModified"] = resume_file.lastModified;
                resumeFileData["lastModifiedDate"] = resume_file.lastModifiedDate;
                resumeFileData["text"] = e.target.result;
                console.log(resumeFileData);
                chrome.storage.local.set({ "resumeFile": resumeFileData }, function () {
                    console.log("Resume saved");
                });
            };
            reader.readAsDataURL(resume_file);
        }

        var letterFileData = {};
        if ($("#customCoverLetterFile").prop('files').length > 0) {
            var letter_file = $("#customCoverLetterFile").prop('files')[0];

            const reader = new FileReader();
            reader.onload = (e) => {
                var fileData = {}
                letterFileData["name"] = letter_file.name;
                letterFileData["type"] = letter_file.type;
                letterFileData["size"] = letter_file.size;
                letterFileData["lastModified"] = letter_file.lastModified;
                letterFileData["lastModifiedDate"] = letter_file.lastModifiedDate;
                letterFileData["text"] = e.target.result;
                console.log(letterFileData);
                chrome.storage.local.set({ "coverLetterFile": letterFileData }, function () {
                    console.log("coverLetter saved");
                });
            };
            reader.readAsDataURL(letter_file);
        }

        return {
            linkedin_url: $("#linkedin_url").val(),
            github_url: $("#github_url").val(),
            portfolio_url: $("#portfolio_url").val(),
            other_url: $("#other_url").val(),
        }
    },
    getCurrentSavedData: async () => {
        const key = pageName[currentPageIndex];
        const result = await chrome.storage.local.get(key);
        if (chrome.runtime.lastError) {
            console.log('Error getting');
        }
        else if (result && result.Resume) {
            var resumeData = result.Resume;
            $("#linkedin_url").val(resumeData['linkedin_url']);
            $("#github_url").val(resumeData['github_url']);
            $("#portfolio_url").val(resumeData['portfolio_url']);
            $("#other_url").val(resumeData['other_url']);
        }

        debugger;
        // Load resume
        chrome.storage.local.get("resumeFile", function (result) {
            var resumeFile = result.resumeFile;
            if (resumeFile) {
                // var editprofileform = document.forms["editprofileform"];
                var dataTransfer = new DataTransfer();
                dataTransfer.items.add(new File([resumeFile["text"]], resumeFile["name"], { type: "application/pdf" }));
                // editprofileform["inputresume"].files = dataTransfer.files;
                $("#customResumeFile").files = dataTransfer.files;
                $("#customResumeFileLabel").addClass("selected").html(resumeFile["name"]);
            }
        });
        // Load cover letter
        chrome.storage.local.get("coverLetterFile", function (result) {
            var coverLetterFile = result.coverLetterFile;
            if (coverLetterFile) {
                // var editprofileform = document.forms["editprofileform"];
                var dataTransfer = new DataTransfer();
                dataTransfer.items.add(new File([coverLetterFile['text']], coverLetterFile["name"], { type: "application/pdf" }));
                // editprofileform["inputcoverletter"].files = dataTransfer.files;
                $("#customCoverLetterFile").files = dataTransfer.files;
                $("#customCoverLetterFileLabel").addClass("selected").html(coverLetterFile["name"]);
            }
        });
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
