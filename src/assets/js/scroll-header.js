var scrollHeader = function(limitHeightParam, isProductParam) {
    // 设置头部滚动隐藏效果
    let didScroll;
    let lastScrollTop = 0;
    let delta = 0;
    let window_height = $(window).height();
    let limitHeight = limitHeightParam ? limitHeightParam : window_height;
    let isProduct = isProductParam ? isProductParam : false;
    // console.log(limitHeight)

    $(window).resize(function() {
        window_height = $(window).height();
    });

    $(window).scroll(function() {
        didScroll = true;
        let scrollDis = $(window).scrollTop();
        if (scrollDis > 5) {
            $('.header-top').addClass('is-scroll');
        } else {
            $('.header-top').removeClass('is-scroll');
        }
        // 控制产品页tab切换吸顶效果
        if (scrollDis > (limitHeight + 60)) {
            $('#column').addClass('column-fixed');
        } else {
            $('#column').removeClass('column-fixed');
        }
    });

    setInterval(function() {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    }, 250);

    function hasScrolled() {
        var st = $(this).scrollTop();
        // console.log('lastScrollTop = ',lastScrollTop)
        // console.log('st = ', st)
        // var touch_bottom = $(document).height() - window_height - 120;

        // Make sure they scroll more than delta
        if (Math.abs(lastScrollTop - st) <= delta)
            return;

        // If they scrolled down and are past the navbar, add class .nav-up.
        // This is necessary so you never see what is "behind" the navbar.
        if (st > lastScrollTop && st > limitHeight) {
            // Scroll Down
            if (isProductParam) {
                $('.header-top').addClass('is-hide');
            }

            // 当页面接近底部的動作
            // if ( st > touch_bottom ) {
            //   $('.header-top').removeClass('is-hide');
            // }
        } else {
            // Scroll Up

            // 向上滚动时，显示header
            if (isProduct) { // 如果是产品页
                if (st < limitHeight) {
                    $('.header-top').removeClass('is-hide');
                }
            } else {
                if (st + window_height < $(document).height()) {
                    $('.header-top').removeClass('is-hide');
                }
            }
        }
        // 当滚动还沒超出一个画面的高度的時候
        // if (st < window_height) {
        //   $('.back-to-top').removeClass('is-scroll');
        // }

        lastScrollTop = st;
    }
};

module.exports = scrollHeader;