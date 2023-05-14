
var currentPageIndex = 0;
var pageName = ["Roles", "Personal", "Education", "Experience", "Workauth", "Skills", "Resume"];


$(document).ready(() => {

    loadHelloPage();
    initPieChart();

    $(".continue-button").click(async () => {
        if (checkValidatePage(true) && pageList[currentPageIndex].checkValidate()) {
            saveCurrentData(function (state) {
                if (state && currentPageIndex != pageName.length - 1) {
                    showLoading();
                    nextPageLoad();
                    hideLoading();
                } else if (currentPageIndex == pageName.length - 1) {
                    showResultSavedPage();
                }
            });
        }
    });

    $(".main-tab-btn-before").click(() => {
        prevPageLoad();
    });

    $("#finish_button").click(function () {
        saveProfileDataFinal();
    });

    $("#back_button").click(function () {
        $(".result-content").hide();
        $(".main-content").fadeIn();
    });
});

const saveProfileDataFinal = async () => {

    var profileData = {};
    let data = await chrome.storage.local.get({
        Roles: 'Roles',
        Personal: 'Personal',
        Education: 'Roles',
        Experience: 'Experience',
        Workauth: 'Workauth',
        // EEO: 'EEO',
        Skills: 'Skills',
        Resume: 'Resume',
    });

    for (const datakey in data) {

        if (data[datakey]) {
            let eachData = data[datakey];
            for (const key in eachData) {
                console.log(`${key}: ${eachData[key]}`);
                profileData[key] = eachData[key];
            }
        }
    }

    utils.storeProfile("AutoFillProfile", profileData);


    chrome.storage.local.set({ "profile_saved": true }, () => {
        if (chrome.runtime.lastError) {
            console.log('Error setting');
        }
        console.log('Stored: ' + "completed");
        alert("Profile saved successfully.");
    });
}

const showResultSavedPage = () => {
    $(".main-content").hide();
    $(".result-content").fadeIn();
}

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
        // case 5: option = { "EEO": savedData }; break;
        case 5: option = { "Skills": savedData }; break;
        case 6: option = { "Resume": savedData }; break;
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

const clearAllSaveProfileData = () => {
    // clear storage function
    chrome.storage.local.clear(function () {
        var error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }
        // do something more
    });
}

// function to load the hello page
const loadHelloPage = () => {
    showLoading();
    currentPageIndex = 0;
    $("#edit_content").load('./pages/hello/index.html', async () => {
        // check already saved data 
        const result = await chrome.storage.local.get("profile_saved");
        if (chrome.runtime.lastError) {
            console.log('Error getting');
        }
        else if (result && result.profile_saved) {
            var state = result.profile_saved;
            if (state) {
                //    already saved
                $("#start_btn #title").text("continue");
                $("#hello_content").text(`You already saved your profile info. If you want to edit profile data, click "continue" button.
                If you want to clear your profile data and make a new, click "clear" button.`);
                $("#clear_btn").show();
            }
            else {
                $("#clear_btn").hide();
            }
        }

        hideLoading();
        $("#start_btn").click(function () {
            RolesPage.init();
        })
        $("#clear_btn").click(function () {
            clearAllSaveProfileData();
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
            firstName: $("#first_name").val(),
            lastName: $("#last_name").val(),
            fullName: $("#full_name").val(),
            middleName: $("#middle_name").val()
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
            $("#first_name").val(rolesData["firstName"]);
            $("#last_name").val(rolesData["lastName"]);
            $("#full_name").val(rolesData["fullName"]);
            $("#middle_name").val(rolesData["middleName"]);
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
            address: $("#address").val(),
            city: $("#city").val(),
            state: $("#state").val(),
            postal_code: $("#postal_code").val(),
            phone_number: $("#phone_number").val(),
            birthday: $("#birthday").val(),
            located: $("#located").val(),
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
            $("#address").val(personData['address']);
            $("#city").val(personData['city']);
            $("#state").val(personData['state']);
            $("#postal_code").val(personData['postal_code']);
            $("#phone_number").val(personData['phone_number']);
            $("#birthday").val(personData['birthday']);
            $("#located").val(personData['located']);

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
            await EducationPage.getCurrentSavedData();
            initSelectYear();
            checkValidatePage(false);
            refreshTabButton();
            hideLoading();
            $(".validate-input-form").change(function () {
                checkValidatePage(false);
            });
            $("#btn_add").click(function () {
                var idx = $(".education-content").length + 1;
                $("#education_panel").append(EducationPage.makeRenderTemplate(idx));
                initSelectYear();
                checkValidatePage(false);
            });
        });
    },
    checkValidate: () => {
        return true;
    },
    getSaveData: () => {
        var education_array = [];
        var count = $(".education-content").length;
        for (var i = 1; i <= count; i++) {
            education_array.push({
                education_school_name: $(`#education_school_name_${i}`).val(),
                education_major: $(`#education_major_${i}`).val(),
                education_degree_type: $(`#education_degree_type_${i}`).val(),
                education_gpa: $(`#education_gpa_${i}`).val(),
                education_start_month: $(`#education_start_month_${i}`).val(),
                education_start_year: $(`#education_start_year_${i}`).val(),
                education_end_month: $(`#education_end_month_${i}`).val(),
                education_end_year: $(`#education_end_year_${i}`).val(),
            });
        }
        return {
            education_state: count,
            education_data: education_array
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
            EducationPage.renderEducationField(educationData);
            initSelectYear();
            EducationPage.setRenderedFieldData(educationData);
        } else {
            $("#education_panel").append(EducationPage.makeRenderTemplate(1));
        }
    },
    renderEducationField: (educationData) => {
        var education_count = -1;
        if (educationData['education_state'] >= 0) {
            education_count = parseInt(educationData['education_state']);
        }

        if (education_count <= 0) {
            // saved no data or unchecked no education check box
            $("#education_panel").append(EducationPage.makeRenderTemplate(1));
        }
        else if (education_count > 0) {
            var dataArray = educationData['education_data'];
            for (i = 1; i <= education_count; i++) {
                $("#education_panel").append(EducationPage.makeRenderTemplate(i));
            }
        }
    },
    makeRenderTemplate: (idx) => {
        var html = "";
        html += `<div class="row w-100 col-sm-12 education-content">
                    <h3>Education ${idx}</h3>
                </div>
                <div class="row w-100 col-sm-12 mb-3">
                    <h6 class="color-gray">School Name</h6>
                    <input type="text" id="education_school_name_${idx}" class="form-control custom-input mt-2 validate-input-form"
                    placeholder="School Name" />
                </div>
                <div class="row w-100">
                    <div class="col-sm-6 mb-3">
                    <h6 class="color-gray">Major</h6>
                    <select class="form-control custom-select mt-2" id="education_major_${idx}">
                        <option value="0" selected>Accounting</option>
                        <option value="1">Actuarial Science</option>
                        <option value="2">Aerospace Engineering</option>
                        <option value="3">Anthropology</option>
                        <option value="4">Applied Mathematics</option>
                        <option value="5">Architecture</option>
                        <option value="6">Art</option>
                        <option value="7">Art History</option>
                        <option value="8">Astronomy</option>
                        <option value="9">Biochemistry</option>
                        <option value="10">Bioinformatics</option>
                        <option value="11">Biology</option>
                        <option value="12">Biomedical Engineering</option>
                        <option value="13">Business</option>
                        <option value="14">Business Analytics</option>
                        <option value="15">Cell & Molecular Biology</option>
                        <option value="16">Chemical Engineering</option>
                        <option value="17">Chemistry</option>
                        <option value="18">Civil Engineering</option>
                        <option value="19">Coding School</option>
                        <option value="20">Cognitive Science</option>
                        <option value="21">Communications</option>
                        <option value="22">Computer Engineering</option>
                        <option value="23">Computer Science</option>
                        <option value="24">Data Science</option>
                        <option value="25">Earth Science</option>
                        <option value="26">Economics</option>
                        <option value="27">Education</option>
                        <option value="28">Electrical Engineering</option>
                        <option value="29">English</option>
                        <option value="30">Entrepreneurship</option>
                        <option value="31">Environmental Engineering</option>
                        <option value="32">Environmental Science</option>
                        <option value="33">Film</option>
                        <option value="34">Finance</option>
                        <option value="35">Financial Engineering</option>
                        <option value="36">Forensic Science</option>
                        <option value="37">Gender Studies</option>
                        <option value="38">Geophysics</option>
                        <option value="39">Graphic Design</option>
                        <option value="40">History</option>
                        <option value="41">Hotel Administration</option>
                        <option value="42">Human Computer Interaction</option>
                        <option value="43">Human Resources</option>
                        <option value="44">Industrial Engineering</option>
                        <option value="45">Informatics</option>
                        <option value="46">Information Science</option>
                        <option value="47">Information Systems</option>
                        <option value="48">International Relations</option>
                        <option value="49">Journalism</option>
                        <option value="50">"Latin American Studies</option>
                        <option value="51">Latin American Studies</option>
                        <option value="52">Linguistics</option>
                        <option value="53">Management Engineering</option>
                        <option value="54">Marketing</option>
                        <option value="55">Materials Science</option>
                        <option value="56">Mathematics</option>
                        <option value="57">Mechanical Engineering</option>
                        <option value="58">Music</option>
                        <option value="59">Neuroscience</option>
                        <option value="60">Nursing</option>
                        <option value="61">Operations Research</option>
                        <option value="62">Other/Not Listed</option>
                        <option value="63">Petroleum Engineering</option>
                        <option value="64">Pharmacology</option>
                        <option value="65">Pharmacy</option>
                        <option value="66">Philosophy</option>
                        <option value="67">Physics</option>
                        <option value="68">Political Science</option>
                        <option value="69">Pre-dental</option>
                        <option value="70">Pre-law</option>
                        <option value="71">Pre-medical</option>
                        <option value="72">Product Design</option>
                        <option value="73">Psychology</option>
                        <option value="74">Public Policy</option>
                        <option value="75">Public Relations</option>
                        <option value="76">Religious Studies</option>
                        <option value="77">Robotics</option>
                        <option value="78">Sociology</option>
                        <option value="79">Software Engineering</option>
                        <option value="80">Sports Management</option>
                        <option value="81">Statistics</option>
                        <option value="82">Supply Chain Management</option>
                        <option value="83">Theatre</option>
                        <option value="84">Undeclared</option>
                        <option value="85">Urban Studies</option>
                        <option value="86">Veterinary Medicine</option>
                    </select>
                    </div>
                    <div class="col-sm-4 mb-3">
                    <h6 class="color-gray">Degree Type</h6>
                    <select class="form-control custom-select mt-2" id="education_degree_type_${idx}">
                        <option value="0">Bachelor's</option>
                        <option value="1">Master's</option>
                        <option value="2">MBA</option>
                        <option value="3">PhD</option>
                        <option value="4">PharMD</option>
                        <option value="5">Associate's</option>
                    </select>
                    </div>
                    <div class="col-sm-2 mb-3">
                    <h6 class="color-gray">GPA</h6>
                    <input type="number" class="form-control custom-input mt-2" id="education_gpa_${idx}" placeholder="GPA" />
                    </div>
                </div>
                <div class="row w-100 mb-6">
                    <div class="col-sm-4 mb-3">
                    <h6 class="color-gray">Start Month</h6>
                    <select class="form-control custom-select mt-2" id="education_start_month_${idx}">
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
                    <h6 class="color-gray">Start Year</h6>
                    <select class="form-control custom-select mt-2 select-year" id="education_start_year_${idx}"></select>
                    </div>
                    <div class="col-sm-4 mb-3">
                    <h6 class="color-gray">End Month</h6>
                    <select class="form-control custom-select mt-2" id="education_end_month_${idx}">
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
                    <h6 class="color-gray">End Year</h6>
                    <select class="form-control custom-select mt-2 select-year" id="education_end_year_${idx}"></select>
                    </div>
                </div>`;
        return html;
    },

    setRenderedFieldData: (educattionData) => {
        let count = parseInt(educattionData['education_state']);
        if (count > 0) {
            var dataArray = educattionData['education_data'];
            for (i = 1; i <= count; i++) {
                $("#education_school_name_" + i).val(dataArray[i - 1].education_school_name);
                $("#education_major_" + i).val(dataArray[i - 1].education_major);
                $("#education_degree_type_" + i).val(dataArray[i - 1].education_degree_type);
                $("#education_gpa_" + i).val(dataArray[i - 1].education_gpa);
                $("#education_start_month_" + i).val(dataArray[i - 1].education_start_month);
                $("#education_start_year_" + i).val(dataArray[i - 1].education_start_year);
                $("#education_end_month_" + i).val(dataArray[i - 1].education_end_month);
                $("#education_end_year_" + i).val(dataArray[i - 1].education_end_year);
            }
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
            await ExperiencePage.getCurrentSavedData();
            refreshTabButton();
            initSelectYear();
            ExperiencePage.initSetFlagCurrentlywork();
            checkValidatePage(false);
            hideLoading();

            $(".validate-input-form").change(function () {
                checkValidatePage(false);
            });

            $("#has_experience").change(function () {
                if (this.checked) {
                    $("#experience_panel").html("<p class='mb-3 ft-20'><i>You've come to the right place! Simplify has helped thousands of students land their first job.</i></p>")
                    $("#btn_add").hide();
                } else {
                    $("#btn_add").show();
                    $("#experience_panel").html(ExperiencePage.makeRenderTemplate(1));
                }
                initSelectYear();
                ExperiencePage.initSetFlagCurrentlywork();
                checkValidatePage(false);
            });

            $("#btn_add").click(function () {
                var idx = $(".experience-content").length + 1;
                $("#experience_panel").append(ExperiencePage.makeRenderTemplate(idx));
                initSelectYear();
                ExperiencePage.initSetFlagCurrentlywork();
                checkValidatePage(false);
            });
        });
    },
    checkValidate: () => {
        return true;
    },
    getSaveData: () => {
        var experience_array = [];
        var count = $(".experience-content").length;
        for (var i = 1; i <= count; i++) {
            experience_array.push({
                experience_company: $(`#experience_company_${i}`).val(),
                experience_location: $(`#experience_location_${i}`).val(),
                experience_position_title: $(`#experience_position_title_${i}`).val(),
                experience_type: $(`#experience_type_${i}`).val(),
                experience_start_month: $(`#experience_start_month_${i}`).val(),
                experience_start_year: $(`#experience_start_year_${i}`).val(),
                experience_end_month: $(`#experience_end_month_${i}`).val(),
                experience_end_year: $(`#experience_end_year_${i}`).val(),
                experience_work_currently_state: $(`#work_currently_${i}`).attr("value"),
                experience_description: $(`#experience_description_${i}`).val(),
            });
        }
        return {
            experience_state: count,
            experience_data: experience_array
        }
    },
    getCurrentSavedData: async () => {
        const key = pageName[currentPageIndex];
        const result = await chrome.storage.local.get(key);
        if (chrome.runtime.lastError) {
            console.log('Error getting');
        }
        else if (result && result.Experience) {  // if there is saved any data
            var experienceData = result.Experience;
            ExperiencePage.renderExperienceField(experienceData);
            ExperiencePage.setRenderedFieldData(experienceData);
        } else { // if there is no saved
            $("#experience_panel").append(ExperiencePage.makeRenderTemplate(1));
        }
    },

    initSetFlagCurrentlywork: () => {
        $(".work-currently").change(function () {
            let id = parseInt($(this).attr("data"));
            if (id >= 0) {
                if (this.checked) {
                    $(`#experience_end_month_${id}`).prop('disabled', true);
                    $(`#experience_end_year_${id}`).prop('disabled', true);
                    $(this).attr("value", "1");
                } else {
                    $(`#experience_end_month_${id}`).prop('disabled', false);
                    $(`#experience_end_year_${id}`).prop('disabled', false);
                    $(this).attr("value", "0");
                }
            }
        });
    },

    renderExperienceField: (experienceData) => {
        var experience_count = -1;
        if (experienceData['experience_state'] >= 0) {
            experience_count = parseInt(experienceData['experience_state']);
        }

        if (experience_count == -1) {
            // saved no data or unchecked no experience check box
            $("#experience_panel").append(ExperiencePage.makeRenderTemplate(1));
        } else if (experience_count == 0) {
            // checked no experience check box
            $("#experience_panel").html("<p class='mb-3 ft-20'><i>You've come to the right place! Simplify has helped thousands of students land their first job.</i></p>")
            $("#has_experience").prop('checked', true);
            $("#btn_add").hide();
        }
        else if (experience_count > 0) {
            var dataArray = experienceData['experience_data'];
            for (i = 1; i <= experience_count; i++) {
                $("#experience_panel").append(ExperiencePage.makeRenderTemplate(i));
            }
        }
    },

    makeRenderTemplate: (idx) => {
        var html = "";
        html += `<div class="row w-100 col-sm-12 experience-content">
                        <h3>Work Experience ${idx}</h3>
                        </div>
                        <div class="row w-100">
                        <div class="col-sm-6 mb-3">
                            <h6 class="color-gray">Company</h6>
                            <input type="text" id="experience_company_${idx}" class="form-control custom-input mt-2 validate-input-form"
                            placeholder="Company" />
                        </div>
                        <div class="col-sm-6 mb-3">
                            <h6 class="color-gray">Location</h6>
                            <input type="text" id="experience_location_${idx}" class="form-control custom-input mt-2 validate-input-form"
                            placeholder="Location" />
                        </div>
                        </div>
                        <div class="row w-100">
                        <div class="col-sm-6 mb-3">
                            <h6 class="color-gray">Position Title</h6>
                            <input type="text" id="experience_position_title_${idx}" class="form-control custom-input mt-2 validate-input-form"
                            placeholder="Position Title" />
                        </div>
                        <div class="col-sm-6 mb-3">
                            <h6 class="color-gray">Experience Type</h6>
                            <select class="form-control custom-select mt-2" id="experience_type_${idx}">
                            <option value="Internship" selected>Internship</option>
                            <option value="Full-Time">Full-Time</option>
                            <option value="Part-Time">Part-Time</option>
                            </select>
                        </div>
                        </div>
    
                        <div class="row w-100 mb-3">
                        <div class="col-sm-4 mb-3">
                            <h6 class="color-gray">Start Month</h6>
                            <select class="form-control custom-select mt-2" id="experience_start_month_${idx}">
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
                            <h6 class="color-gray">Start Year</h6>
                            <select class="form-control custom-select mt-2 select-year" id="experience_start_year_${idx}"></select>
                        </div>
                        <div class="col-sm-4 mb-3">
                            <h6 class="color-gray">End Month</h6>
                            <select class="form-control custom-select mt-2" id="experience_end_month_${idx}">
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
                            <h6 class="color-gray">End Year</h6>
                            <select class="form-control custom-select mt-2 select-year" id="experience_end_year_${idx}"></select>
                        </div>
                        <div class="col-sm-12 mb-3">
                            <input type="checkbox" class="w-5 mr-2 work-currently" name="check-box" data=${idx} id="work_currently_${idx}" /> <span
                            class="text-base font-medium text-gray-700">I currently work here</span>
                        </div>
                        <div class="col-sm-12 mb-3">
                            <h6 class="color-gray">Description</h6>
                            <textarea id="experience_description_${idx}" class="form-control custom-input mt-2 validate-input-form"
                            placeholder="A couple sentences about your role" ></textarea>
                        </div>
                    </div>`;
        return html;
    },

    setRenderedFieldData: (experienceData) => {
        let count = parseInt(experienceData['experience_state']);
        if (count > 0) {
            var dataArray = experienceData['experience_data'];
            for (i = 1; i <= count; i++) {
                $("#experience_company_" + i).val(dataArray[i - 1].experience_company);
                $("#experience_location_" + i).val(dataArray[i - 1].experience_location);
                $("#experience_position_title_" + i).val(dataArray[i - 1].experience_position_title);
                $("#experience_type_" + i).val(dataArray[i - 1].experience_type);
                $("#experience_start_month_" + i).val(dataArray[i - 1].experience_start_month);
                $("#experience_start_year_" + i).val(dataArray[i - 1].experience_start_year);
                $("#experience_end_month_" + i).val(dataArray[i - 1].experience_end_month);
                $("#experience_end_year_" + i).val(dataArray[i - 1].experience_end_year);
                if (parseInt(dataArray[i - 1].experience_work_currently_state) == 1) {
                    $("#work_currently_" + i).prop("checked", true);
                    $(`#experience_end_month_${i}`).prop('disabled', true);
                    $(`#experience_end_year_${i}`).prop('disabled', true);
                } else {
                    $("#work_currently_" + i).prop("checked", false);
                    $(`#experience_end_month_${i}`).prop('disabled', false);
                    $(`#experience_end_year_${i}`).prop('disabled', false);
                }

                $("#experience_description_" + i).val(dataArray[i - 1].experience_description);
            }
        }
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
// const EEOPage = {
//     init: () => {
//         $(".edit-show").show();
//         showLoading();
//         $("#edit_content").load('./pages/EEO/index.html', async () => {
//             updatePieChart(0);
//             customRadioButton.init("disability_radio");
//             customRadioButton.init("vertain_radio");
//             customRadioButton.init("lgbtq_radio");
//             customRadioButton.init("gender_radio");
//             await EEOPage.getCurrentSavedData();
//             checkValidatePage(false);
//             refreshTabButton();
//             hideLoading();
//             $(".validate-input-form").change(function () {
//                 checkValidatePage(false);
//             })
//         });
//     },
//     checkValidate: () => {
//         return true;
//     },
//     getSaveData: () => {
//         return {
//             disability: customRadioButton.getValue("disability_radio"),
//             vertain: customRadioButton.getValue("vertain_radio"),
//             lgbtq: customRadioButton.getValue("lgbtq_radio"),
//             gender: customRadioButton.getValue("gender_radio"),
//             ethnicity: $("#ethnicity").val(),
//         }
//     },
//     getCurrentSavedData: async () => {
//         const key = pageName[currentPageIndex];
//         const result = await chrome.storage.local.get(key);
//         if (chrome.runtime.lastError) {
//             console.log('Error getting');
//         }
//         else if (result && result.EEO) {
//             var eeoData = result.EEO;
//             customRadioButton.setValue("disability_radio", eeoData['disability']);
//             customRadioButton.setValue("vertain_radio", eeoData['vertain']);
//             customRadioButton.setValue("lgbtq_radio", eeoData['lgbtq']);
//             customRadioButton.setValue("gender_radio", eeoData['gender']);
//             $("#ethnicity").val(eeoData['ethnicity']);
//         }
//     }
// }

// function to load the skills page todo
const SkillsPage = {
    init: () => {
        $(".edit-show").show();
        showLoading();
        $("#edit_content").load('./pages/skills/index.html', async () => {
            updatePieChart(0);
            checkValidatePage(false);
            refreshTabButton();
            await SkillsPage.initSkillSelectData();
            customSelect.init("skills-select", SkillsPage.clickSkillsSelectEventListner); 
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
    initSkillSelectData: async () => {
        await $.getJSON("./assets/json/skills.json", function (resp) {
            if (resp && resp.items) {
                var items = resp.items;
                // var countries = [];
                for (var i = 0; i < items.length; ++i) {
                    var skill = items[i];
                    // countries.push({ text: country.text, value: country.value });
                    $(".skills-select .options-container").append(
                        `<div class="option">
                            <input type="radio" value="${skill.name}" class="radio mt-1" data-id="${skill.id.toLowerCase()}" id="${skill.id.toLowerCase()}" name="category" />
                            <label for="${skill.name.toLowerCase()}">${skill.name}</label>
                        </div>`
                    );
                }

            }
        });
    },
    clickSkillsSelectEventListner: () => {
        let id = $(".skills-select").attr("data-value");
        // alert($("#" + id).attr("value"));
        let value = $("#" + id).attr("value");
        $("#skills-list").append(`<input type="button" class="btn btn-info rounded ft-24 mb-2 mr-2 skill-item" value="${value}" />`)
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
        else if (result && result.Skills) {
            var skillsData = result.Skills;
            // customRadioButton.setValue("disability_radio", skillsData['disability']);
            // customRadioButton.setValue("vertain_radio", skillsData['vertain']);
            // customRadioButton.setValue("lgbtq_radio", skillsData['lgbtq']);
            // customRadioButton.setValue("gender_radio", skillsData['gender']);
            // $("#ethnicity").val(skillsData['ethnicity']);
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
            $("#save_button_title").text("Done");
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

var pageList = [RolesPage, PersonalPage, EducationPage, ExperiencePage, WorkauthPage, SkillsPage, ResumePage];
