chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === "get-all-input-tags") {
        alert();
    }
});
