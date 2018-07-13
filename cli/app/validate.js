const config = require('./config');

function checkType(value, type) {
    switch (type) {
        case 'string':
            return typeof value === 'string' && value;
        case 'array':
            return Array.isArray(value);
        default:
            return true;
    }
}

function checkAppValidator(value, validate) {
    if (typeof validate !== 'function') {
        return true;
    }

    return validate(value);
}

function args() {
    const incorrect = Object.keys(config.schema).reduce((incorrect, key) => {
        const schema = config.schema[key];

        if (!schema.appRequired) {
            return incorrect;
        }

        const value = config.get(key);
        if (checkType(value, schema.type)) {
            if (checkAppValidator(value, schema.appValidate)) {
                return incorrect;
            }
        }

        incorrect.push(key);

        return incorrect;
    }, []);

    if (incorrect.length) {
        throw new Error(`Missing required or incorrect arguments: ${incorrect.join(', ')}. Run "ov-reporter-cli -h" for help.`);
    }
}

module.exports = {
    args,
};
