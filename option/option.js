/**
 * JS for the option page
 */

$(document).ready(function() {
    $(".main-tab-btn").click(function() {
        $(".main-tab-btn").removeClass("active");
        $(this).addClass("active");
        activeOptionTab($(this).attr("data"));
    })
})


// change the content page 
const activeOptionTab = (pageTag) => {

}