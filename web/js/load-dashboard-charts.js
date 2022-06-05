let url = baseUrl + 'site/get-top3-officers-this-year';
let officer_types = ['sdo_id', 'xen_id', 'se_id'];
setTimeout(function () {
    officer_types.forEach(function (officer_type, index, array) {
        getTopOfficer(url, officer_type);
    });

}, 1000);

$(function () {

    setTimeout(function () {
        regionStats();
        revenueTargetComparison();
        lossTargetComparison();
        revenueRealizedComparison();
        lossesComparison();
    }, 1000);

})