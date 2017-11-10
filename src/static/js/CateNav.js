jQuery.CateNav = function(elem1, elem2) {
    //添加目录
    var disTop = 140; // 计算offset().top时候距离顶部的距离
    var currObj;
    var offsetTop = 0;
    var h2List = new Array(),
        h3List = new Array();
    var addNav = function() {
        var i1 = 0,
            i2 = 0,
            n1 = 0,
            n2 = 0;
        var temp = '<dl style="display:none">';
        $(elem2).html('');
        var cateList = $(elem1).html().match(/(<h[2-3][^>]*>.*?<\/h[2-3]>)/ig);
        if (!cateList) {
            return;
        }
        for (var i = 0; i < cateList.length; i++) {
            if (/(<h2[^>]*>.*?<\/h2>)/ig.test(cateList[i])) {
                n1++;
                n2 = 0;
                temp += '<dd class="cate-item1"><span>' + n1 + '</span><a href="#' + n1 + '">' + cateList[i].replace(/<[^>].*?>/g, "") + '</a></dd>';
                h2List[i1] = n1;
                i1++;
            } else {
                n2++;
                temp += '<dd class="cate-item2"><span>' + n1 + '.' + n2 + '</span><a href="#' + n1 + '_' + n2 + '">' + cateList[i].replace(/<[^>].*?>/g, "") + '</a></dd>';
                h3List[i2] = n1 + '_' + n2;
                i2++;
            }
        }
        temp += '</dl>';
        $(elem2).append(temp);
    };
    //添加锚点
    var addPoint = function() {
        var i1 = 0,
            i2 = 0;
        $(elem1).find('h2').each(function() {
            $(this).prepend('<a name="' + h2List[i1] + '"></a>');
            i1++;
        });
        $(elem1).find('h3').each(function() {
            $(this).prepend('<a name="' + h3List[i2] + '"></a>');
            i2++;
        });
    };
    //点击锚点，跳转制定位置
    var clickPoint = function() {
        $(elem2 + ' a').click(function(e) {
            e.preventDefault();
            currObj = $("[name='" + $(this).attr('href').replace(/#/, '') + "']");
            var offsetTop = currObj.offset().top - disTop;
            $('html,body').animate({
                scrollTop: offsetTop
            }, 300, 'swing');
        });
    };
    $(window).on('resize', function() {
        setAnchorPosi();
    });
    var mainRight = $('.main-right');
    var mrWidth = mainRight.width();
    var mroffsetLeft = mainRight.offset().left;
    setTimeout(function() {
        setAnchorPosi();
        $(elem2 + ' dl').show();
    }, 0);
    // 设置锚点模块位置
    function setAnchorPosi() {
        var winW = window.innerWidth;
        var winH = $(window).height();
        if (winH >= 620) {
            winH = 620;
        }
        // $('.article-anchor').css({
        //     'max-height': winH - disTop
        // });
        $('.anchor-box').css({
            'max-height': winH - disTop
        });
        if (winW <= (1200 + 204)) { // 在1404px之下
            var ml = 1404 - winW;
            if (winW <= 1300) { // 在1300px之下
                // 锚点栏下放
                $(elem2 + ' dl').parents('.article-anchor').css({ 'margin-left': 0 }).addClass('no-fixed');
                // 父级盒子宽度自适应
                $('.main-right').css({ 'margin-right': 0 });
            } else { // 1300px <  x  < 1404px  除了计算锚点栏left值，为了防止浏览器宽度减小，看不见锚点栏，设置相应元素进行位移
                // 锚点栏悬浮且左移动，适应浏览器横向宽度变化
                $(elem2 + ' dl').parents('.article-anchor').css({ 'margin-left': -ml }).removeClass('no-fixed');
                // 父级盒子设置间距
                $('.main-right').css({ 'margin-right': ml + 102 });
                mrWidth = mainRight.width() + ml;
                mroffsetLeft = mainRight.offset().left;
                $(elem2 + ' dl').parents('.article-anchor').css({ 'left': mroffsetLeft + mrWidth });
            }
        } else { // 超过1404px，则只计算锚点栏left值，其他都重置为原始值，或者设置为不影响left作用的值
            $(elem2 + ' dl').parents('.article-anchor').css({
                'margin-left': 0
            }).removeClass('no-fixed');
            $('.main-right').css({
                'margin-right': 102
            });
            mroffsetLeft = mainRight.offset().left;
            $(elem2 + ' dl').parents('.article-anchor').css({
                'left': mroffsetLeft + mrWidth
            });
        }
    }
    //屏幕滚动，显示并选中锚点
    var scrollWin = function() {
        var windowTop = 0;
        var winH = $(window).height();
        if (winH >= 620) {
            winH = 620;
        }
        // $('.article-anchor').css({
        //     'max-height': winH - disTop
        // });
        $(window).scroll(function() {
            windowTop = $(window).scrollTop();
            $(elem2 + ' a').each(function() {
                currObj = $("[name='" + $(this).attr('href').replace(/#/, '') + "']");
                offsetTop = currObj.offset().top - disTop - 20;
                if (windowTop >= offsetTop) {
                    $(elem2 + ' dd').removeClass('active');
                    $(this).parent('dd').addClass('active');
                    return;
                }
            });
        });
    };

    var init = function() {
        addNav();
        addPoint();
        clickPoint();
        scrollWin();
    };
    init();
};