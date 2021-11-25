const nconf = require('nconf');

let packageJson = {};
let configExample = {};
try {
    packageJson = require('../package.json'); /* eslint-disable-line global-require */
    configExample = require('../config.example.json'); /* eslint-disable-line global-require */
} catch (e) {
    console.error('Can not find package.json or config.example.json file'); /* eslint-disable-line no-console */
}

nconf.overrides({
    app: {
        name: packageJson.name,
        version: packageJson.version,
        description: packageJson.description,
        bin: Object.keys(packageJson.bin)[0],
    },
});

const schema = {
    'help': {
        alias: 'h',
        describe: 'Prints help information',
    },
    'username': {
        alias: 'u',
        describe: 'Username to log in into ov-chipcard',
        type: 'string',
        appRequired: true,
    },
    'password': {
        alias: 'p',
        describe: 'Password to log in into ov-chipcard',
        type: 'string',
        appRequired: true,
    },
    'output': {
        alias: 'o',
        describe: 'Directory the final report should be saved to',
        type: 'string',
        appRequired: true,
    },
    'format': {
        alias: 'f',
        describe: 'Array of formats to download (pdf,csv)',
        type: 'array',
        choices: [ 'pdf', 'csv' ],
        default: [ 'pdf' ]
    },
    'card': {
        alias: 'c',
        describe: 'OV chipcard number',
        type: 'string',
        appRequired: true,
    },
    'days': {
        alias: 'd',
        describe: 'Array of weekdays to be included into report',
        type: 'array',
        appRequired: true,
        appValidate: value => value.length === 7,
    },
    'month': {
        alias: 'm',
        describe: 'Reporting month (1 - January, 2 - February, etc)',
        type: 'number',
        appRequired: true,
        appValidate: value => value > 0 && value <= 12,
    },
    'config': {
        describe: 'Path to a config file',
        type: 'string',
    },
    'verbose': {
        alias: 'v',
        describe: 'Verbose logging',
    },
    'historyUrl': {
        describe: 'ov-chipkaart.nl URL to history page',
        type: 'string',
    },
};

const config = nconf.argv(schema);
config.file({
    file: config.get('config') || 'config.json',
});

config.defaults({
    historyUrl: 'https://www.ov-chipkaart.nl/mijn-ov-chip/mijn-ov-reishistorie.htm',
});

function help() {
    let result = 'Options:\n';
    const keys = Object.keys(schema);
    let longest = 0;

    // keys and aliase
    const params = keys.map((key) => {
        let param = schema[key].appRequired ? ' * ' : '   ';

        param += `--${key}`;

        if (schema[key].alias) {
            param += `, -${schema[key].alias}`;
        }

        longest = Math.max(longest, param.length);

        return param;
    });

    // description
    const keyLength = longest + 2;
    longest = 0;
    keys.forEach((key, index) => {
        params[index] = params[index].padEnd(keyLength) + (schema[key].describe || '');

        longest = Math.max(longest, params[index].length);
    });

    // type
    const descriptionLength = longest + 2;
    longest = 0;
    keys.forEach((key, index) => {
        params[index] = params[index].padEnd(descriptionLength);

        if (schema[key].type) {
            params[index] += `[${schema[key].type}]`;
        }

        longest = Math.max(longest, params[index].length);
    });

    result += params.join('\n');

    result += '\n\n';

    //example
    let example = 'Usage example:\n  ';
    example += `${config.get('app').bin} `;
    example += keys
        .filter(key => schema[key].appRequired)
        .map((key) => {
            let param = schema[key].alias ? `-${schema[key].alias} ` : `--${key}=`;
            switch (schema[key].type) {
                case 'array':
                    param += configExample[key].join(' '); // TODO: load config.example to a temporary config and use tempConfig.get()
                    break;
                default:
                    param += configExample[key];
                    break;
            }
            return param;
        })
        .join(' ');

    result += example;


    return result;
}

config.help = help;
config.schema = schema;

module.exports = config;
