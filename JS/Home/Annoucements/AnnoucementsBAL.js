$(document).ready(function () {
    $('#lblIntranetSolBirthday').empty();
    GetAnnouncements(GetAnnouncementsSuccess, GetAnnouncementsFailure);
});


function GetAnnouncementsSuccess(data) {
    if (data.length > 0) {
        var tempAnnouncementsHtml = '';
        for (var i = 0; i < data.length; i++) {

            tempAnnouncementsHtml += '<li class="d-flex" style="float:left;">' +
                '<div class="max_img_18 mr_10">' +
                '<img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/Icon/information.png" alt="" style="height: 15px"/>' +
                '</div>' +
                '<p class="text_13 text_bld  ml_5 mt_4">' + data[i].Title + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </p>' +
                '</li>';
        }
        $('#lblIntranetSolBirthday').empty().append(tempAnnouncementsHtml);
        InitializeBirthdayTicker();
    }
}

function GetAnnouncementsFailure() {
}

function InitializeBirthdayTicker() {

    $('#lblIntranetSolBirthday').marquee({

        enable: true,

        // scroll direction
        // 'vertical' or 'horizontal'
        direction: 'horizontal',

        // children items
        itemSelecter: 'li',

        // animation delay
        delay: 0,

        // animation speed
        speed: 1,

        // animation timing
        timing: 20,

        // mouse hover to stop the scroller
        mouse: true
        //duplicated: false
    });
}









