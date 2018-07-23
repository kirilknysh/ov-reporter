const helpers = require('./helpers');

describe('convertMonth', () => {
    test('create begin and end dates for the full previous month', () => {
        const now = new Date('2018/05/15');
        const month = 2;
        const { beginDate, endDate } = helpers.convertMonth(month, now);

        expect(beginDate.getFullYear()).toBe(2018);
        expect(beginDate.getMonth()).toBe(month - 1);
        expect(beginDate.getDate()).toBe(1);
        expect(endDate.getFullYear()).toBe(2018);
        expect(endDate.getMonth()).toBe(month - 1);
        expect(endDate.getDate()).toBe(28);
    });

    test('create begin and end dates for the current month', () => {
        const date = 15;
        const month = 11; // November
        const now = new Date(`2018/${month}/${date}`);
        const { beginDate, endDate } = helpers.convertMonth(month, now);

        expect(beginDate.getFullYear()).toBe(2018);
        expect(beginDate.getMonth()).toBe(month - 1);
        expect(beginDate.getDate()).toBe(1);
        expect(endDate.getFullYear()).toBe(2018);
        expect(endDate.getMonth()).toBe(month - 1);
        expect(endDate.getDate()).toBe(date);
    });

    test('create begin and end dates for the future month (coverts to current)', () => {
        const date = 15;
        const month = 12; // December
        const nowMonth = 10; // October
        const now = new Date(`2018/${nowMonth}/${date}`);
        const { beginDate, endDate } = helpers.convertMonth(month, now);

        expect(beginDate.getFullYear()).toBe(2018);
        expect(beginDate.getMonth()).toBe(nowMonth - 1);
        expect(beginDate.getDate()).toBe(1);
        expect(endDate.getFullYear()).toBe(2018);
        expect(endDate.getMonth()).toBe(nowMonth - 1);
        expect(endDate.getDate()).toBe(date);
    });
});

describe('formatDateAsSearchParam', () => {
    test('stringifies with "-" as a separator', () => {
        const date = new Date('2018/02/07');
        expect(helpers.formatDateAsSearchParam(date)).toBe('07-02-2018');
    });
});
