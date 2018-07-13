/* eslint-disable no-console */

const logger = {
    verboseMode: false,

    init(verbose) {
        logger.verboseMode = verbose;
    },

    verbose(...args) {
        if (!logger.verboseMode) {
            return;
        }

        console.log('[verbose]', ...args);
    },

    fatal(...args) {
        console.error('💩  ', ...args);
    },

    help(app, configHelp) {
        console.log('\033[1m%s\x1b[0m@%s', app.name, app.version);
        console.log(app.description);
        console.log('');
        console.log(configHelp);
    },

    done() {
        console.log('🏁  ', 'Done!');
    },

    openHistory() {
        console.log('👤  ', 'Opening your history...');
    },

    login() {
        console.log('🔓  ', 'Log in');
    },

    selectCard() {
        console.log('💳  ', 'Select your card');
    },

    selectMonth() {
        console.log('🗓   ', 'Select month');
    },

    markDays() {
        console.log('✅  ', 'Marking days...');
    },

    saveReport() {
        console.log('📂  ', 'Saving the report...');
    },
};

module.exports = logger;
