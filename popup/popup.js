/**
 * popup.js
 * created by 8KLancer@gmail.com
 * 07/05/2023
 */

document.addEventListener("DOMContentLoaded", function() {
    var optionButton = document.querySelector(".option-link");
    if(!optionButton) return;
    optionButton.addEventListener('click', function() {
        showOptionPanel();
    });
});

/**
 * funtion to open the option page
 */
var showOptionPanel = () => {
    chrome.runtime.sendMessage({message: "open edit page"});
}