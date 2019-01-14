exports.convertMonth = function (month, now = new Date()) {
    const nowMonth = now.getMonth();
    const nowYear = now.getFullYear();
    const beginDate = new Date();
    const endDate = new Date();

    if (month > nowMonth) {
        beginDate.setFullYear(nowYear, nowMonth, 1);
        endDate.setFullYear(nowYear, nowMonth, now.getDate());
    } else {
        beginDate.setFullYear(nowYear, month - 1, 1);
        endDate.setFullYear(nowYear, month, 0);
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
