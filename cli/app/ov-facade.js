const logger = require('./logger');

module.exports = async function() {
    return {
        openHistory() {
            logger.openHistory();
        },
        selectCard() {
            logger.selectCard();
        },
        selectMonth() {
            logger.selectMonth();
        },
        markDays() {
            logger.markDays();
        },
        saveReport() {
            logger.saveReport();
        },
    };
};
