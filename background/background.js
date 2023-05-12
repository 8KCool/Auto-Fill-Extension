
self.importScripts('autofill.js');

chrome.runtime.onMessage.addListener(function (request, sender, response) {
    let  message = request.message;
    if (message === 'open edit page') {
        chrome.tabs.create({ url: chrome.runtime.getURL('./option/option.html') });
    } else if (message == 'get-url') {
        response(sender.tab.url);
    }
});
