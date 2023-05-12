
const onCommand = () => {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, tabs => {
        tabs.forEach(async tab => {
            const target = {
                tabId: tab.id,
                allFrames: true
            };
            try {
                await chrome.scripting.executeScript({
                    target,
                    func: () => self.mode = 'insert'
                });
                await chrome.scripting.executeScript({
                    target,
                    files: ['/background/utils.js']
                });
                await chrome.scripting.executeScript({
                    target,
                    files: ['/background/defaults.js']
                });
                await chrome.scripting.executeScript({
                    target,
                    files: ['/background/regtools.js']
                });
                await chrome.scripting.executeScript({
                    target,
                    files: ['/inject/fill.js']
                });
            }
            catch (e) {
                // utils.notify(e.message);
            }
        });
    });
}

chrome.commands.onCommand.addListener(onCommand);


chrome.runtime.onMessage.addListener(request => {

    // if the auto fill button clicked
    if (request.message === 'auto-fill') {
        onCommand();
    }
});
