const config = require('./config');

function args() {
    const incorrect = [];

    if (!config.get('username')) {
        incorrect.push('username');
    }

    if (!config.get('password')) {
        incorrect.push('password');
    }

    if (!config.get('output')) {
        incorrect.push('output');
    }

    if (!config.get('card')) {
        incorrect.push('card');
    }

    const days = config.get('days');
    if (!days || !Array.isArray(days) || days.length !== 7) {
        incorrect.push('days');
    }

    if (!config.get('month')) {
        incorrect.push('month');
    }

    if (incorrect.length) {
        throw new Error(`Missing required or incorrect arguments: ${incorrect.join(', ')}. Run "ov-reporter-cli -h" for help.`);
    }
}

module.exports = {
    args,
};
