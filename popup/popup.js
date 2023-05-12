/**
 * popup.js
 * created by 8KLancer@gmail.com
 * 07/05/2023
 */

var pageName = ["Roles", "Personal", "Education", "Experience", "Workauth", "EEO", "Skills", "Resume"];

document.addEventListener("DOMContentLoaded", function () {

    checkSavedProfile()

    var new_profile = document.querySelector("#new_profile");
    if (!new_profile) return;
    new_profile.addEventListener('click', function () {
        showOptionPanel();
    });

    var edit_profile = document.querySelector("#edit_profile");
    if (!edit_profile) return;
    edit_profile.addEventListener('click', function () {
        showOptionPanel();
    });

    var auto_fill = document.querySelector("#auto_fill");
    if (!auto_fill) return;
    auto_fill.addEventListener('click', function () {
        AutoFillPage();
    });
});

/**
 * funtion to open the option page
 */
const showOptionPanel = () => {
    chrome.runtime.sendMessage({ message: "open edit page" });
}

const checkSavedProfile = async () => {
    const result = await chrome.storage.local.get("profile_saved");
    if (chrome.runtime.lastError) {
        console.log('Error getting');
    }
    else if (result && result.profile_saved) {
        var state = result.profile_saved;
        if (state) {
            $("#content_title").text(`Simply click the "Edit" button and you'll be able to make changes to your profile in no time.`);
            $("#new_profile").hide();
            $("#edit_profile").show();
            $("#auto_fill").show();
        } else {

        }
    }
}

// Check page and Auto Fill Data to input.
const AutoFillPage = () => {
    getProfileDataFromDatabase();
    getInputAllTagCurrentPage();
}

let profileDataArray = {};

// get Profile data from Database
const getProfileDataFromDatabase = async () => {

    // "Roles", "Personal", "Education", "Experience", "Workauth", "EEO", "Skills", "Resume"
    showLoading("Getting Profile Data from Database... 0%");

    for (let i = 0; i < pageName.length - 1; i++) {
        await getDataEachPage(i);
    }
    showLoading("Getting Profile Data from Database successfully.");
}

const getDataEachPage = async (idx) => {
    let key = pageName[idx];
    showLoading(`Getting Profile Data from Database... ${idx * 12}%`);
    const result = await chrome.storage.local.get(key);
    if (chrome.runtime.lastError) {
        console.log('Error getting');
    }
    else if (result) {
        switch (key) {
            case "Roles": {
                if (result.Roles) {
                    var Roles = result.Roles;
                    profileDataArray[key] = Roles;
                    break;
                } else {
                    profileDataArray[key] = {};
                }
            }
            case "Personal": {
                if (result.Personal) {
                    var Personal = result.Personal;
                    profileDataArray[key] = Personal;
                    break;
                } else {
                    profileDataArray[key] = {};
                }
            }
            case "Education": {
                if (result.Education) {
                    var Education = result.Education;
                    profileDataArray[key] = Education;
                    break;
                } else {
                    profileDataArray[key] = {};
                }
            }
            case "Experience": {
                if (result.Experience) {
                    var Experience = result.Experience;
                    profileDataArray[key] = Experience;
                    break;
                } else {
                    profileDataArray[key] = {};
                }
            }
            case "Workauth": {
                if (result.Workauth) {
                    var Workauth = result.Workauth;
                    profileDataArray[key] = Workauth;
                    break;
                } else {
                    profileDataArray[key] = {};
                }
            }
            case "EEO": {
                if (result.EEO) {
                    var EEO = result.EEO;
                    profileDataArray[key] = EEO;
                    break;
                } else {
                    profileDataArray[key] = {};
                }
            }
            case "Skills": {
                if (result.Skills) {
                    var Skills = result.Skills;
                    profileDataArray[key] = Skills;
                    break;
                } else {
                    profileDataArray[key] = {};
                }
            }
            case "Resume": {
                if (result.Resume) {
                    var Resume = result.Resume;
                    profileDataArray[key] = Resume;
                    break;
                } else {
                    profileDataArray[key] = {};
                }
            }
        }
    }
}

// get Input tags in the current Pages 
const getInputAllTagCurrentPage = () => {
    chrome.runtime.sendMessage(
        {
            message: "auto-fill",
            data: profileDataArray
        }, () => {
            window.close();
            chrome.runtime.lastError;
        }
    );
}