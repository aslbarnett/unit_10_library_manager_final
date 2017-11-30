module.exports.formatDate = (date) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return `${year}-${month}-${day}`;
};

module.exports.formatFutureDate = (date, daysInFuture) => {
    let getCurrentTime = date.getTime();
    let futureTime = getCurrentTime + (daysInFuture * 24 * 60 * 60 * 1000);
    let futureDate = new Date(futureTime);
    let year = futureDate.getFullYear();
    let month = futureDate.getMonth() + 1;
    let day = futureDate.getDate();
    return `${year}-${month}-${day}`;
};