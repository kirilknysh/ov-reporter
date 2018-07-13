const nconf = require('nconf');

const config = nconf
    .file({
        file: 'config.json',
    })
    .argv({
        'help': {
            alias: 'h',
            describe: 'Prints help information',
        },
        'username': {
            alias: 'u',
            describe: 'Username to log in into ov-chipcard',
        },
        'password': {
            alias: 'p',
            describe: 'Password to log in into ov-chipcard',
        },
        'output': {
            alias: 'o',
            describe: 'Path to output file',
        },
        'card': {
            alias: 'c',
            describe: 'OV chipcard number',
        },
        'days': {
            alias: 'd',
            describe: 'Array of weekdays to be included into report',
            type: 'array',
        },
        'month': {
            alias: 'm',
            describe: 'Reporting month',
        },
        'verbose': {
            alias: 'v',
            describe: 'Verbose logging',
        },
    });

config.defaults({
    historyUrl: 'https://www.ov-chipkaart.nl/mijn-ov-chip/mijn-ov-reishistorie.htm',
});

module.exports = config;
