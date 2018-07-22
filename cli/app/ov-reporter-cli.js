#!/usr/bin/env node

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
    let facade;

    try {
        validate.args();

        facade = await ovFacade();

        await facade.openHistory();
        await facade.selectCard();
        await facade.selectMonth();
        await facade.markDays();
        await facade.saveReport();
        await facade.close();
        facade = null;

        logger.done();
    } catch (e) {
        logger.fatal(e.message);
        logger.verbose(e.stack);
    } finally {
        facade && facade.close();
    }
}

main();
