const puppeteer = require('puppeteer');

const config = require('./config');
const logger = require('./logger');

async function login(page) {
    logger.verbose('Type username');
    await page.type('input#username', config.get('username'));

    logger.verbose('Type password');
    await page.type('input#password', config.get('password'));

    logger.verbose('Click login');
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        page.click('input#btn-login'),
    ]);

    logger.verbose('Verify user menu');
    const userMenu = await page.$('#menu-user');
    if (!userMenu) {
        throw new Error('Unable to log in; Please check "username" and "password" parameters');
    }
}

async function openHistory(page) {
    logger.verbose('Go to historyUrl');
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        page.goto(config.get('historyUrl')),
    ]);

    logger.verbose('Login');
    await login(page);
    logger.verbose('Login done');
}

async function selectCard(page) {

}

module.exports = async function() {
    logger.verbose('Create browser');
    const browser = await puppeteer.launch({ headless: true });
    logger.verbose('Create page');
    const page = await browser.newPage();

    logger.verbose('Return facade');
    return {
        async openHistory() {
            logger.openHistory();

            await openHistory(page);

            logger.verbose('History open');
        },
        async selectCard() {
            logger.selectCard();

            await selectCard(page);

            logger.verbose('Card selected');
        },
        async selectMonth() {
            logger.selectMonth();
        },
        async markDays() {
            logger.markDays();
        },
        async saveReport() {
            logger.saveReport();
        },
        async close() {
            return browser.close();
        },
    };
};
