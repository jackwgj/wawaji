require('@scss/common/common.scss');
require('@scss/common/header.scss');
require('@scss/common/apply.scss');

require('@scss/index/common.scss');
require('@scss/index/banner.scss');
require('@scss/index/datashow.scss');
require('@scss/index/main-product.scss');
require('@scss/index/advantage.scss');
require('@scss/index/industry-demo.scss');
require('@scss/index/partner-customer.scss');
require('@scss/index/news.scss');
require('@scss/index/whycan.scss');
require('@scss/index/free-trial.scss');

require('@scss/common/footer.scss');

let scrollHeader = require('@assets/js/scroll-header.js');
require('@assets/js/main.js');

$(function() {
    let indexTimer = null;
    // 数字滚动
    $('.counter1').countUp({
        delay: 10,
        time: 100
    });
    $('.counter2').countUp();
    $('.counter3').countUp();
    $('.counter4').countUp({
        delay: 10,
        time: 1000
    });


    // 1、banner的滚动
    new Swiper('.swiper-banner', {
        pagination: '.banner-swiper-pagination',
        paginationClickable: true,
        autoplay: 6000,
        autoplayDisableOnInteraction: false, // 用户操作后是否停止
        loop: true
    });
    $(window).resize(function() {
        if (indexTimer) {
            clearTimeout(indexTimer);
        }
        indexTimer = setTimeout(function() {
            initIndexOperate();
        }, 500);
    });

    function initIndexOperate() {
        if (window.innerWidth <= 1000) {
            // 2、核心产品线
            $('.product-list .list-item').off('mouseenter').off('mouseleave').off('click').on('click', function() {
                $(this).toggleClass('hover');
                $(this).siblings().removeClass('hover');
            });
        } else {
            // 0、导航的滚动逻辑
            scrollHeader();

            // banner连线循环动画
            setInterval(function(){
                $('.star-circle').removeClass('star-circle');
                setTimeout(function(){
                    $('.animate-line').addClass('star-circle');
                }, 1000);
            }, 8000);

            // 2、核心产品线
            $('.product-list .list-item').off('mouseenter').off('mouseleave').hover(function() {
                $(this).addClass('hover').siblings().removeClass('hover');
            });
        }
    }
    initIndexOperate();

    // 5、客户及合作伙伴
    function partnerSwiper(selector, paginationType) {
        var swiperPagination = '';
        if (paginationType) {
            swiperPagination = '.swiper-pagination-' + paginationType;
        } else {
            swiperPagination = null;
        }
        new Swiper(selector, {
            pagination: swiperPagination,
            paginationClickable: true,
            calculateHeight: true
        });
    }
    partnerSwiper('.swiper-partner-fanyule.m', 'm');
    partnerSwiper('.swiper-partner-fanyule.pc', 'pc');
});