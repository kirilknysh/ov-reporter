const url = require('url');
const path = require('path');
const fs = require('fs/promises');
const axios = require('axios').default;

const puppeteer = require('puppeteer');

const config = require('./config');
const logger = require('./logger');

const { convertMonth, formatDateAsSearchParam } = require('./helpers');

async function login(page) {
    const username = config.get('username');
    logger.verbose('Type username:', username);
    await page.type('input#username', username);

    logger.verbose('Type password');
    await page.type('input#password', config.get('password'));

    logger.verbose('Click login');
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        page.click('input#btn-login'),
    ]);

    logger.verbose('Verify user menu');
    const userMenu = await page.$('#menu-user');
    if (!userMenu) {
        throw new Error('Unable to log in; Please check "username" and "password" parameters');
    }
}

async function openHistory(page) {
    const historyUrl = config.get('historyUrl');
    logger.verbose('Go to historyUrl:', historyUrl);
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        page.goto(historyUrl),
    ]);

    logger.verbose('Login');
    await login(page);
    logger.verbose('Login done');
}

async function acceptCookies(page) {
    const acceptButton = await page.$('#cookieConsentOK');

    if (!acceptButton) {
        logger.verbose('No cookies accept button');
        return;
    }

    logger.verbose('Click cookies accept');
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        page.click('#cookieConsentOK'),
    ]);
}

async function selectCard(page) {
    const card = config.get('card');
    logger.verbose('Card to select:', card);
    const selector = await page.$$eval('.cs-card-number', (cardNumberNodes, card) => {
        const node = cardNumberNodes.find(cardNumberNode => cardNumberNode.innerText === card);

        if (!node) {
            return '';
        }

        const customClass = '--ov-reporter-cli-card';
        node.classList.add(customClass);
        return `.${customClass}`;
    }, card);

    logger.verbose('Card selector:', selector);
    if (!selector) {
        throw new Error(`Can't find the card "${card}"`);
    }

    logger.verbose('Click on selected card');
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        page.click(selector),
    ]);
}

async function selectMonth(page) {
    const pageUrl = page.url();
    logger.verbose('Current page URL:', pageUrl);
    const pageUrlObj = new url.URL(pageUrl);

    const month = config.get('month');
    logger.verbose('Month to select:', month);
    const { beginDate, endDate } = convertMonth(month);

    pageUrlObj.searchParams.set('begindate', formatDateAsSearchParam(beginDate));
    pageUrlObj.searchParams.set('enddate', formatDateAsSearchParam(endDate));

    const periodUrl = pageUrlObj.toString();
    logger.verbose('Period page URL:', periodUrl);

    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        page.goto(periodUrl),
    ]);
}

async function markDays(page) {
    logger.verbose('Mark page');
    const days = config.get('days');
    logger.verbose('Days to mark:', days);

    const isLast = await page.$$eval('.known-transaction', (rows, days) => {
        rows.forEach((row) => {
            const price = row.children[2].textContent.trim();

            if (!price) {
                // skip incomes, auto-charge, etc
                return;
            }

            const dateParts = row.children[0].childNodes[0].textContent.trim().split('-');
            const checkbox = {
                container: row.children[3],
                node: row.children[3].children[0],
            };
            const date = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
            const day = date.getDay() -1;

            if (days[day]) {
                checkbox.container.classList.add('checked');
                checkbox.node.checked = true;
            } else {
                checkbox.container.classList.remove('checked');
                checkbox.node.checked = false;
            }
        });

        const buttons = document.querySelectorAll('.transaction-pagination button');
        if (buttons.length < 1) {
            return true;
        }
        const lastButton = buttons[buttons.length - 1];
        if (lastButton.classList.contains('tlsBtn')) {
            return true;
        }
        return false;
    }, days);

    if (isLast) {
        return;
    }

    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        page.$$eval('.transaction-pagination button', (buttons) => {
            const lastButton = buttons[buttons.length - 1];
            lastButton.click();
        }),
    ]);

    await markDays(page);
}

async function saveReport(page) {
    logger.verbose('Click Create expenses overview');

    const isDisabled = await page.$eval('input#selected-card', (node) => {
        node.scrollIntoView(false);

        return node.disabled
    });
    logger.verbose('Click Create expenses is disabled:', isDisabled);
    if (isDisabled) {
        throw new Error('"Create expense overview" is disabled. Ensure the correct month is passed.');
    }

    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        page.click('input#selected-card'),
    ]);

    const output = config.get('output');
    const format = config.get('format');
    const downloadPath = path.resolve(process.cwd(), output);
    logger.verbose('Download path:', downloadPath);

    const requestParams = await page.$eval('#content form', formReplica);
    const cookies = await page.cookies();

    await Promise.allSettled(format.map(async (type) => {
        const fields = { ...requestParams.fields, documentFormat: type };
        const response = await performRequest({ ...requestParams, fields, cookies });
        const filename = extractFilename(response.headers)
        if(!filename) console.warn(`Filename not found, using default.${type}`)
        await fs.writeFile(path.join(downloadPath, filename || `default.${type}`), response.data)
    }));
}

function formReplica(f) {
    return {
        fields: Object.fromEntries(new FormData(f)),
        url: f.action,
        method: f.method,
    }
}

function makeCookieHeader(cookies) {
    return cookies.map(
        c => `${encodeURIComponent(c.name)}=${encodeURIComponent(c.value)}`,
    ).join('; ');
}

function extractFilename(headers) {
    const filenameRe = /(^|;) ?filename=(?<filename>.*)(;|$)/;
    const { groups: { filename } = {}} = filenameRe.exec(headers['content-disposition']) || {};
    return filename;
}

function performRequest({ fields, url, method, cookies }) {
    const cookieHeader = makeCookieHeader(cookies);
    const data = new URLSearchParams(fields).toString();
    // TODO: figure out what more we need to do so ov-chipkaart won't block connections because of "unusual" traffic.
    const headers = {
        "Accept": "*/*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": cookieHeader,
    };
    return axios.request({ url, method, headers, data, responseType: 'arraybuffer' });
}

module.exports = async function() {
    logger.verbose('Create browser');
    const browser = await puppeteer.launch({ devtools: false });
    logger.verbose('Create page');
    const page = await browser.newPage();

    logger.verbose('Return facade');
    return {
        async openHistory() {
            logger.openHistory();

            await openHistory(page);

            logger.verbose('History open');
        },
        async acceptCookies() {
            logger.acceptCookies();

            await acceptCookies(page);

            logger.verbose('Cookies accepted');
        },
        async selectCard() {
            logger.selectCard();

            await selectCard(page);

            logger.verbose('Card selected');
        },
        async selectMonth() {
            logger.selectMonth();

            await selectMonth(page);

            logger.verbose('Month selected');
        },
        async markDays() {
            logger.markDays();

            await markDays(page);

            logger.verbose('Days marked');
        },
        async saveReport() {
            logger.saveReport();

            await saveReport(page);

            logger.verbose('Report saved');
        },
        async close() {
            return browser.close();
        },
    };
};
