require('../../scss/common/common.scss');
require('../../scss/common/header.scss');
require('../../scss/common/apply.scss');

require('../../scss/about/banner.scss');
require('../../scss/about/team.scss');

require('../../scss/common/footer.scss');

let scrollHeader = require('../../assets/js/scroll-header.js');
require('../../assets/js/main.js');

$(function() {
    // 0、导航的滚动逻辑
    scrollHeader();

    let mySwiper = new Swiper('.team-swiper-container', {
        loop: true,
        paginationClickable: true,
        onSlidePrev: function(swiper) {
            // console.log(swiper)
            let activeIndex = swiper.activeLoopIndex;
            switchImg(activeIndex);
        },
        onSlideNext: function(swiper) {
            let activeIndex = swiper.activeLoopIndex;
            switchImg(activeIndex);
        }
    });
    $('.arrow-left').on('click', function(e) {
        e.preventDefault();
        mySwiper.swipePrev();
    });
    $('.arrow-right').on('click', function(e) {
        e.preventDefault();
        mySwiper.swipeNext();
    });

    function switchImg(index) {
        $('.img-wrapper .lg-img').eq(index).addClass('show').siblings().removeClass('show');
    }

    $('.main-member .member-li').on('click', function() {
        let index = $(this).index();
        switchImg(index);
        mySwiper.swipeTo(index, 1000, false);
    });
});
