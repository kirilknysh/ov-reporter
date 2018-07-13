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

    help() {
        console.log('HELP');
    },
};

module.exports = logger;
