exports.convertMonth = function (month, now = new Date()) {
    const nowMonth = now.getMonth();
    const beginDate = new Date();
    const endDate = new Date();

    if (month > nowMonth) {
        beginDate.setMonth(nowMonth, 1);
        endDate.setMonth(nowMonth, now.getDate());
    } else {
        beginDate.setMonth(month - 1, 1);
        endDate.setMonth(month, 0);
    }

    return { beginDate, endDate };
};

exports.formatDateAsSearchParam = function (date) {
    return [
        (date.getDate() + '').padStart(2, '0'),
        ((date.getMonth() + 1) + '').padStart(2, '0'),
        date.getFullYear() + '',
    ].join('-');
};
