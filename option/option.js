/**
 * JS for the option page
 */

$(document).ready(function () {
    $("#education_page").fadeIn();
    // $("#roles_page").fadeIn();
    $(".main-tab-btn").click(function () {
        $(".main-tab-btn").removeClass("active");
        $(this).addClass("active");
        activeOptionTab($(this).attr("data"));
    })
})


// change the content page 
const activeOptionTab = (pageTag) => {
    $(".content-page").hide();
    $("#" + pageTag).fadeIn("300");
}