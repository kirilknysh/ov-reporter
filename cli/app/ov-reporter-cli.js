const config = require('./config');
const logger = require('./logger');
const validate = require('./validate');

logger.init(config.get('verbose'));
logger.verbose('Start');

try {
    if (config.get('help')) {
        return logger.help();
    }
    validate.args();
} catch (e) {
    logger.fatal(e.message);
    logger.verbose(e.stack);
}

