// /**
//  * JS for the option page
//  */
// var currentOptionIndex = 0;
// var optionPagesList = ["roles_page", "personal_page", "education_page", "experience_page"];

// $(document).ready(function () {
//     // $("#education_page").fadeIn();
//     $("#roles_page").fadeIn();
//     $(".main-tab-btn").click(function () {
//         var selectPageIndex = parseInt($(this).attr("data"));
//         if (currentOptionIndex + 1 == selectPageIndex || selectPageIndex < currentOptionIndex) {
//             $(".main-tab-btn").removeClass("active");
//             activeOptionTab(selectPageIndex);
//         }
//     })

//     $(".main-tab-btn-before").click(function () {
//         $(".main-tab-btn").removeClass("active");
//         currentOptionIndex--;
//         if (currentOptionIndex < 0) currentOptionIndex = 0;
//         activeOptionTab(currentOptionIndex);
//     })

//     $(".continue-button").click(function () {
//         nextProfilePage();
//     });

//     hideLoading();
// })


// // change the content page when save button clicked
// const nextProfilePage = () => {
//     currentOptionIndex++;
//     if (currentOptionIndex < optionPagesList.length) {
//         activeOptionTab(currentOptionIndex);
//     }
// }

// // change the content page 
// const activeOptionTab = (pageIdx) => {
//     currentOptionIndex = pageIdx;
//     var pageTag = optionPagesList[pageIdx];
//     $(".main-tab-btn").removeClass("active");
//     $("#" + pageTag + "_link").addClass("active");
//     $(".content-page").hide();
//     $("#" + pageTag).fadeIn("300");
// }


$(document).ready(() => {
    loadHelloPage();
});

const loadHelloPage = () => {
    showLoading();
    $(".main-content").load('./pages/hello/index.html', () => {
        hideLoading();
    });
} 