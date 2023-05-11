/**
 * popup.js
 * created by 8KLancer@gmail.com
 * 07/05/2023
 */

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
});

/**
 * funtion to open the option page
 */
var showOptionPanel = () => {
    chrome.runtime.sendMessage({ message: "open edit page" });
}

var checkSavedProfile = async () => {
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