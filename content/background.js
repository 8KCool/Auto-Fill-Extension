chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === "open edit page") {
        chrome.tabs.create({ url: chrome.runtime.getURL('./option/option.html') });
    }
});
