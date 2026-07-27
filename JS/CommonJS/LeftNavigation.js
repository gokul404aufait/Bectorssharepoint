$(document).ready(function () {
    /*$(".custom-left-navigation>div>ul li ul").hide();
	
    $('.custom-left-navigation>div>ul> li').click(function() {
        $(this).children('ul').slideToggle(400); //the toggle shows or hides depending on previous state
        $(this).siblings('li').children('ul').hide(400); // hide all other nodes
    });
	
    $('.custom-left-navigation>div>ul a.static*').click(function(e){ e.stopPropagation(); });*/
    $(".custom-left-navigation>div>ul li ul").hide();

    $('.custom-left-navigation>div>ul> li').click(function () {

        if (!$(this).children('ul').hasClass('isvisible')) {
            $('.custom-left-navigation ul.isvisible').each(function () {
                $(this).removeClass('isvisible');
            });

            $('.custom-left-navigation>div>ul> li').each(function () {
                $(this).find('.swith-nav-btn-red').hide();
                $(this).find('.swith-nav-btn-black').show();
                $(this).find('.menu-item-text:first').css('color', 'black');
            });
        }




        $(this).find('.swith-nav-btn-black').show();
        $(this).find('.menu-item-text:first').css('color', 'black');

        $(this).children('ul').slideToggle(400, function () {
            $(this).toggleClass('isvisible', $(this).is(':visible'));

        }); //the toggle shows or hides depending on previous state
        $(this).siblings('li').children('ul').hide(400); // hide all other nodes

        if ($(this).children('ul').hasClass('isvisible')) {

            $(this).find('.swith-nav-btn-red').hide();
            $(this).find('.swith-nav-btn-black').show();
            $(this).find('.menu-item-text:first').css('color', 'black');

        }
        else {
            $(this).find('.swith-nav-btn-black').hide();
            $(this).find('.swith-nav-btn-red').show();
            $(this).find('.menu-item-text:first').css('color', 'red');


        }




    });



    $('.custom-left-navigation>div>ul a.static*').click(function (e) { e.stopPropagation(); });




    console.log(WebAbsoluteUrl);
    //$(".menu-item-text").before("<img class='menu-item-img' src='https://aufaitcloud.sharepoint.com/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/location-on-road1.png'/>");
    $("li.static:first-child span.static.menu-item").append("<div class=swith-btn><img src='" + WebAbsoluteUrl + "/BectorsSourceCode/Images/right.png' class='swith-btn-img' ></div>");
    /*$(".swith-btn-img").click(function(){
    $("#sideNavBox").css("width","10px");
    $(".menu-item-text").css("display","none");
    $(".ms-metadata.ms-verticalAlignMiddle").css("display","none");
    $(".root.ms-core-listMenu-root.static li").css("display","none");
    $(".root.ms-core-listMenu-root.static li:first-child").css("display","block");
    $("li.static a.static.menu-item").css("display","none");
    $("#contentBox").css("margin-left","30px");
    $(".swith-btn").css("text-align","center");
    $("#sideNavBox li.static:first-child span").css("padding-left","0");
    $(".swith-btn img").css("transform","rotate(0deg)")*/

    //initiateSwitchimg();
    //initiateSwitchToggle()

    //$("span.ms-navedit-linkNode span.ms-navedit-flyoutArrow").prepend("<div class=forwordarrow><img src='"+WebAbsoluteUrl+"/BectorsSourceCode/Images/right.png' class='swith-nav-btn-black' ><img src='"+WebAbsoluteUrl+"/BectorsSourceCode/Images/down.png' class='swith-nav-btn-red' ></div>");
    //$("li.static:first-child span.static.menu-item").append("<div class=swith-btn><img src='"+WebAbsoluteUrl+"/BectorsSourceCode/Images/right.png' class='swith-btn-img' ></div>");








    if ($(window).width() < 650) {
        $("#sideNavBox").css("width", "90%");
        $("#sideNavBox").css("float", "none");
        $("#contentBox").css("margin-left", "20px");
        $("#sideNavBox ").css("margin-top", "0");
        $(".daily-graph .dGraph").css("max-width", "100%");
    }

    $("span.ms-navedit-linkNode span.ms-navedit-flyoutArrow").prepend("<div class=forwordarrow><img src='" + WebAbsoluteUrl + "/BectorsSourceCode/Images/right.png' class='swith-nav-btn-black' ><img src='" + WebAbsoluteUrl + "/BectorsSourceCode/Images/down.png' class='swith-nav-btn-red' ></div>");
    $("#sideNavBox").css("width", "10px");
    $(".menu-item-text").css("display", "none");
    $(".ms-metadata.ms-verticalAlignMiddle").css("display", "none");
    $(".root.ms-core-listMenu-root.static li").css("display", "none");
    $(".root.ms-core-listMenu-root.static li:first-child").css("display", "block");
    $("li.static a.static.menu-item").css("display", "none");
    $("#contentBox").css("margin-left", "30px");
    $(".swith-btn").css("text-align", "center");
    $("#sideNavBox li.static:first-child span").css("padding-left", "0");
    $(".swith-btn img").css("transform", "rotate(0deg)");
    $(".swith-btn").css("display", "none");
    $(".forwordarrow").css("display", "none");
    $(".daily-graph .dGraph").css("overflow-x", "auto");
    $("#sideNavBox li.static span.static.menu-item ").css("height", "36px");
    $("#sideNavBox li.static:first-child span.static.menu-item").css("min-height", "auto");
    $("#sideNavBox").css("padding-right", "10px");
    $("<div class=\"swith-btn-toggle\"><img src='" + WebAbsoluteUrl + "/BectorsSourceCode/Images/right.png' class='swith-btn-img-toggle' ></div>").insertAfter(".swith-btn");
    $(".swith-btn").remove();

    //initiateSwitchToggle()
    InitSwitchFunction();

});

function initiateSwitchimg() {
    //$(".swith-btn-img").mouseleave(function(){
    $("#sideNavBox").css("width", "10px");
    $(".menu-item-text").css("display", "none");
    $(".ms-metadata.ms-verticalAlignMiddle").css("display", "none");
    $(".root.ms-core-listMenu-root.static li").css("display", "none");
    $(".root.ms-core-listMenu-root.static li:first-child").css("display", "block");
    $("li.static a.static.menu-item").css("display", "none");
    $("#contentBox").css("margin-left", "30px");
    $(".swith-btn").css("text-align", "center");
    $("#sideNavBox li.static:first-child span").css("padding-left", "0");
    $(".swith-btn img").css("transform", "rotate(0deg)");
    $(".swith-btn").css("display", "none");
    $(".forwordarrow").css("display", "none");

    $("#sideNavBox").css("padding-right", "10px");
    $(".daily-graph .dGraph").css("max-width", "100%");
    $("#sideNavBox li.static span.static.menu-item ").css("height", "36px");
    $("#sideNavBox li.static:first-child span.static.menu-item").css("min-height", "auto");
    //$("li.static:first-child span.static.menu-item").empty().append("<div class=swith-btn-toggle><img src='https://aufaitcloud.sharepoint.com/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/right.png' class='swith-btn-img-toggle' ></div>");	
    $("<div class=\"swith-btn-toggle\"><img src='" + WebAbsoluteUrl + "/BectorsSourceCode/Mrs_Bectors_PTMS/Images/right.png' class='swith-btn-img-toggle' ></div>").insertAfter(".swith-btn");
    $(".swith-btn").remove();

    //initiateSwitchToggle()
    InitSwitchFunction();
    //});
}

function InitSwitchFunction() {

    $(".swith-btn-toggle").click(function () {
        if ($(window).width() > 650 && $('#tourChart').length > 0) {

            $('#tourChart').empty();
            bindDropdownofDate();
            searchMonthGraph();
        }
        initiateSwitchToggle();
    });
    /*
    $(".swith-btn-toggle").mouseenter(function(){
        initiateSwitchToggle();
    });
    */



}

function initiateSwitchToggle() {
    $("#sideNavBox").css("width", "180px");
    $(".menu-item-text").css("display", "block");
    $(".swith-btn img").css("transform", "rotate(180deg)");
    $(".ms-metadata.ms-verticalAlignMiddle").css("display", "block");
    $(".root.ms-core-listMenu-root.static li").css("display", "block");
    $("<div class=\"swith-btn\"><img src='" + WebAbsoluteUrl + "/BectorsSourceCode/Images/right.png' class='swith-btn-img' ></div>").insertAfter(".swith-btn-toggle");
    $("#sideNavBox li.static:first-child span.static.menu-item").css("min-height", "36px");
    $(".swith-btn-toggle").remove();
    //$("li.static:first-child span.static.menu-item").empty().append("<div class=swith-btn><img src='https://aufaitcloud.sharepoint.com/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/login.png' class='swith-btn-img' ></div>");
    $(".swith-btn-toggle").css("display", "none");
    $("li.static a.static.menu-item").css("display", "block");
    $("#contentBox").css("margin-left", "220px");
    $(".swith-btn").css("text-align", "right");
    $("#sideNavBox li.static:first-child span.menu-item-text").css("padding-left", "20px");
    $("ul.static ul.static").css("display", "none");
    $(".forwordarrow").css("display", "block");
    //$(".daily-graph .dGraph").css("max-width","87.5%");
    //$(".daily-graph .dGraph").css("max-width","95%");
    $("#sideNavBox").css("padding-right", "0px");
    $("#sideNavBox li.static span.static.menu-item ").css("height", "50px");
    $(".custom-left-navigation li.static:after").css("height", "1px");
    //initiateSwitchimg();
    //$(".custom-left-navigation").mouseleave(function(){
    if ($(window).width() < 650) {
        $("#sideNavBox").css("width", "90%");
        $("#sideNavBox").css("float", "none");
        $("#contentBox").css("margin-left", "20px ");
        $("#sideNavBox").css("margin-top", "0");
        // $(".daily-graph .dGraph").css("max-width","100%");
        $("#sideNavBox").css("padding-right", "0px");
    }



    $(".swith-btn img").click(function () {
        if ($(window).width() > 650 && $('#tourChart').length > 0) {

            $('#tourChart').empty();
            bindDropdownofDate();
            searchMonthGraph();
        }

        initiateSwitchimg();
    });
}

$('#sideNavBox').hide();