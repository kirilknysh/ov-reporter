const loadingSplash = {
    node: null,
    init: () => {
        loadingSplash.node = document.getElementById('loading-splash');
    },
    show: () => {
        loadingSplash.node.classList.remove('-hidden');
    },
    hide: () => {
        loadingSplash.node.classList.add('-hidden');
    },
};

function waitForComplete(tabId, done) {
    chrome.tabs.onUpdated.addListener(function onUpdated(updatedTabId, changeInfo) {
        if (updatedTabId !== tabId) {
            return;
        }

        if (changeInfo.status !== 'complete') {
            return;
        }

        chrome.tabs.onUpdated.removeListener(onUpdated);
        done();
    });
}

function runExporter(tabId, imExport) {
    chrome.tabs.executeScript(tabId, { file: 'javascript/create-declaration.js' }, () => {
        waitForComplete(tabId, () => {
            loadingSplash.hide();

            if (!imExport) {
                return;
            }

            chrome.tabs.executeScript(tabId, { file: 'javascript/download-pdf.js' });
        });
    });
}

function setWeekday(tabId, weekdays, done) {
    chrome.tabs.executeScript(tabId, {
        code: `
            if (typeof ovReporter === 'undefined') {
                ovReporter = {};
            }
            ovReporter.weekdays = ${JSON.stringify(weekdays)};
        `,
    }, done);
}

function runChecker(tabId, weekdays, imExport) {
    setWeekday(tabId, weekdays, () => {
        chrome.tabs.executeScript(tabId, { file: 'javascript/checker.js' }, ([isLast]) => {
            if (isLast) {
                return runExporter(tabId, imExport);
            }

            waitForComplete(tabId, () => runChecker(tabId, weekdays, imExport));
        });
    });
}

function startReport(weekdays, imExport) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs[0].id;

        runChecker(tabId, weekdays, imExport);
    });
}

function init() {
    loadingSplash.init();

    document.getElementById('makeReportBtn').addEventListener('click', () => {
        loadingSplash.show();

        const weekdays = (new Array(7)).fill(false);
        document.querySelectorAll('.weekdays-container input[type="checkbox"]')
            .forEach((element, index) => {
                weekdays[index] = !!element.checked;
            });

        const imExport = document.getElementById('make-report-im-export').checked;

        startReport(weekdays, imExport);
    });
}

document.addEventListener('DOMContentLoaded', init);
