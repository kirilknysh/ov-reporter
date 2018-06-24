// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(() => {
    // Replace all rules
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    // With a new rule
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { hostEquals: 'www.ov-chipkaart.nl', schemes: ['https'] },
                    css: ['.list-group-item.cs-card.active', '#dateFilter[checked]'],
                }),
            ],
            // And shows the extension's page action.
            actions: [ new chrome.declarativeContent.ShowPageAction() ],
        }]);
    });
});
