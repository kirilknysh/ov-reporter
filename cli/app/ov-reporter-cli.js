const config = require('./config');
const logger = require('./logger');
const validate = require('./validate');
const ovFacade = require('./ov-facade');

logger.init(config.get('verbose'));
logger.verbose('Start');

if (config.get('help')) {
    return logger.help(config.get('app'), config.help());
}

async function main() {
    try {
        validate.args();

        const facade = await ovFacade();

        await facade.openHistory();
        await facade.selectCard();
        await facade.selectMonth();
        await facade.markDays();
        await facade.saveReport();

        logger.done();
    } catch (e) {
        logger.fatal(e.message);
        logger.verbose(e.stack);
    }
}

main();
