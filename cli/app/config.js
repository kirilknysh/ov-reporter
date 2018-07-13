const nconf = require('nconf');

let packageJson = {};
try {
    packageJson = require('../package.json'); /* eslint-disable-line global-require */
} catch (e) {
    console.error('Can not find package.json file'); /* eslint-disable-line no-console */
}

nconf.overrides({
    app: {
        name: packageJson.name,
        version: packageJson.version,
        description: packageJson.description,
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
        describe: 'Path to output file',
        type: 'string',
        appRequired: true,
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
        describe: 'Reporting month',
        type: 'string',
        appRequired: true,
    },
    'verbose': {
        alias: 'v',
        describe: 'Verbose logging',
    },
    'historyUrl': {
        describe: 'ov-chipkaart.nl URL to history page',
    },
};

const config = nconf
    .argv(schema)
    .file({
        file: 'config.json',
    });

config.defaults({
    historyUrl: 'https://www.ov-chipkaart.nl/mijn-ov-chip/mijn-ov-reishistorie.htm',
});

config.help = config.stores.argv.help; // TODO: make custom
config.schema = schema;

module.exports = config;
