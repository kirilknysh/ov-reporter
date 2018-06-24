function init() {
    document.querySelectorAll('[data-localize]').forEach((element) => {
        const key = element.dataset.localize;
        const message = chrome.i18n.getMessage(key);

        element.innerText = message || `[[${key}]]`;
    });
}

document.addEventListener('DOMContentLoaded', init);
