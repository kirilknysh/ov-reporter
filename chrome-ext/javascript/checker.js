/* global ovReporter */
ovReporter.last = false;

const rows = document.querySelectorAll('.known-transaction');
rows.forEach((row) => {
    const price = row.children[2].textContent.trim();

    if (!price) {
        // skip incomes, auto-charge, etc
        return;
    }

    const dateParts = row.children[0].childNodes[0].textContent.trim().split('-');
    const checkbox = {
        container: row.children[3],
        node: row.children[3].children[0],
    };

    const date = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
    const day = date.getDay() -1;

    if (ovReporter.weekdays[day]) {
        checkbox.container.classList.add('checked');
        checkbox.node.checked = true;
    } else {
        checkbox.container.classList.remove('checked');
        checkbox.node.checked = false;
    }
});

const buttons = document.querySelectorAll('.transaction-pagination button');

if (buttons.length < 1) {
    ovReporter.last = true;
} else {
    const lastButton = buttons[buttons.length - 1];
    if (lastButton.classList.contains('tlsBtn')) {
        ovReporter.last = true;
    }
}

if (!ovReporter.last) {
    const lastButton = buttons[buttons.length - 1];
    setTimeout(() => {
        lastButton.click();
    }, 0);
}

ovReporter.last
