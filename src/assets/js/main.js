/*eslint-disable no-console */
require('./respond.js');
require('./form-validate.js');
require('./menuToggle.js');
$(function() {
    let commonTimer = null;
    let winW = window.innerWidth;

    // 优化因为rem单位计算而出现的初始加载时字体小，布局乱的问题
    $('body').removeClass('none');

    $(window).resize(function() {
        if (commonTimer) {
            clearTimeout(commonTimer);
        }
        commonTimer = setTimeout(function() {
            initCommonOperate();
        }, 500);
    });

    function initCommonOperate() {
        if (winW <= 1000) {
            // 顶部导航菜单开关按钮
            $('.m-header-wrapper .nav-btn').off('click').on('click', function() {
                $(this).toggleClass('active');
                let ht = $('.header-top');
                ht.toggleClass('active-m');
                if (ht.hasClass('active-m')) {
                    $('.m-header-wrapper .nav-wrapper').fadeIn(300);
                    $('.header-top .mask').fadeIn(500);
                } else {
                    $('.m-header-wrapper .nav-wrapper').fadeOut(300);
                    $('.header-top .mask').fadeOut(500);
                    $('.m-header-wrapper .sub-menu').slideUp(500);
                    $('.m-header-wrapper .menu-item').removeClass('active');
                }
            });
            $('.header-top .mask').off('click').on('click', function() {
                let ht = $('.header-top');
                ht.toggleClass('active-m');
                if (ht.hasClass('active-m')) {
                    $('.m-header-wrapper .nav-wrapper').fadeIn(500);
                    $(this).fadeIn(500);
                } else {
                    $('.m-header-wrapper .nav-wrapper').fadeOut(500);
                    $(this).fadeOut(500);
                    $('.m-header-wrapper .sub-menu').slideUp(500);
                    $('.m-header-wrapper .menu-item').removeClass('active');
                }
                $('.m-header-wrapper .nav-btn').toggleClass('active');
            });

            // 顶部导航菜单点击效果
            $('.m-header-wrapper').menuToggle({
                clickEle: '.menu-item-title',
                subMenuEle: '.sub-menu'
            });

            // 底部导航菜单点击效果
            $('.site-map').menuToggle({
                clickEle: '.map-item-title',
                subMenuEle: '.map-subcontent'
            });

            // 点击出现即构服务号／订阅号二维码
            $('.wx-img .m').off('click').on('click', function(){
                $(this).siblings('.m-img-box').show();
            });
            $('.m-img-box .m-mask, .m-img-box .m-img').off('click').on('click', function(){
                $(this).parent().hide();
            });

        } else {
            // 顶部导航菜单hover效果
            $('.nav-wrapper .menu-item').hover(function() {
                $('.header-top').addClass('hover-nav');
            }, function() {
                if ($(this).find('.sub-menu').length !== 0) {
                    setTimeout(function() {
                        $('.header-top').removeClass('hover-nav');
                    }, 400);
                } else {
                    $('.header-top').removeClass('hover-nav');
                }
            });
        }
    }
    initCommonOperate();

    // 申请流程相关逻辑开始
    // 关闭申请试用弹层
    $('.apply-trial .close-btn').on('click', function() {
        closeApplyProcess();
        if (winW <= 1000) {
            $('#app').fadeIn(0);
        }
    });
    // 打开申请试用弹层
    $('.apply-btn, .free-trial .trial-btn').on('click', function() {
        openApplyProcess();
    });

    // 检测哈希值，是否是从旧版官网跳过来的申请试用
    var winHash = window.location.hash.toString().slice(1);
    if (winHash && winHash == 'begin_to_try') {
        // 防止页面未加载完，弹出申请框后往上移动
        setTimeout(function() {
            openApplyProcess();
        }, 300);
    }
});

// 关闭申请流程，重置步骤
function closeApplyProcess() {
    $('.apply-trial').hide();
    $('.apply-table').show();
    $('.apply-sucess').hide();
    $('.apply-form')[0].reset();
    $('.apply-form .error').find('p').remove(); // 去掉前面的错误信息提示
    $('.apply-form .error').removeClass('error'); // 去掉前面的红框提示
    $('.link-ul .link-item').addClass('none'); // 默认添加none类名，隐藏
}
// 打开申请流程
function openApplyProcess() {
    $('.apply-trial').show();
    // 实例化验证表单
    $('.apply-form').validation({
        submitBtn: '.submit',
        submitAction: function() {
            let isAgree = $('.if-agree #is-agree').prop('checked');
            if (!isAgree) {
                alert('您未同意SDK试用协议！');
                return false;
            } else {
                let formData = $('.apply-form').serializeArray();
                let finalData = {};
                finalData['type'] = [];
                $('.choices input').each(function() {
                    let isChecked = $(this).prop('checked');
                    if (isChecked) {
                        finalData['type'].push($(this).val());
                    }
                });
                let showTypeList = [];
                finalData['type'].forEach((item) => {
                    console.log(item);
                    if (item == 1 || item == 2) {
                        showTypeList[0] = 'voice';
                    } else if (item == 3 || item == 4) {
                        showTypeList[1] = 'video';
                    } else if (item == 5) {
                        showTypeList[2] = 'live';
                    }
                });
                console.log(showTypeList);
                for (let x in formData) {
                    if (formData[x].name != 'type') {
                        finalData[formData[x].name] = formData[x].value;
                    }
                }
                console.log(finalData);
                $.ajax({
                    type: 'post',
                    url: 'https://www2.zego.im/api/trysdk',
                    // url: 'https://www2.zego.im/api/test',
                    data: finalData,
                    success: function(res) {
                        // console.log(res)
                        let statusCode = res[0];
                        if (statusCode === 0) {
                            $('.apply-table').hide();
                            $('.apply-sucess').show();
                            showTypeList.forEach((item) => {
                                $('.link-ul .' + item).removeClass('none');
                            });
                            $(window).scrollTop(0);
                        } else if (statusCode === 10) {
                            alert('传递参数错误！请联系网站管理员！');
                        } else if (statusCode === 20) {
                            console.log('服务器内部错误!');
                            for (let key in res[1]) {
                                console.log(key);
                                console.log($('input[name=' + key + ']'));
                                $('input[name=' + key + ']').parent().addClass('error').find('p').remove();
                                $('input[name=' + key + ']').parent().append('<p>' + res[1][key] + '</p>');
                            }
                        } else if (statusCode === 30) {
                            alert('邮件发送失败!');
                        }
                    },
                    error: function() {
                        alert('申请失败，请重试！');
                    }
                });
                return false;
            }
        }
    });
    // 设置计时器，让首页banner滚动js先执行
    setTimeout(function() {
        if (winW <= 1000) {
            $('#app').fadeOut(0);
            $(window).scrollTop(0);
        }
    }, 0);
}
// 申请流程相关逻辑结束