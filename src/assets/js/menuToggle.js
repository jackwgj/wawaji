/*
 *  description 菜单点击隐藏／显示
 *  author jolin
 *  date 2017-08-30
 */
;
(function($) {
    let methods = {
        init: function(options) {
            return this.each(function() {
                let self = this;
                self.opt = $.extend({}, $.fn.menuToggle.defaults, options);
                let $clickEle = $(self).find(self.opt.clickEle);
                let subMenuEle = self.opt.subMenuEle;
                let activeClass = self.opt.activeClass;

                $clickEle.off('click').on('click', function() {
                    let pl = $(this).parent();
                    pl.toggleClass(activeClass);
                    pl.siblings().removeClass(activeClass);
                    if (pl.hasClass(activeClass)) {
                        $(this).siblings(subMenuEle).slideDown(500);
                        pl.siblings().each(function() {
                            $(this).children(subMenuEle).slideUp(500);
                        });
                    } else {
                        $(this).siblings(subMenuEle).slideUp(500);
                        pl.siblings().each(function() {
                            $(this).children(subMenuEle).slideUp(500);
                        });
                    }
                });
            });
        }
    };
    $.fn.menuToggle = function(options) {
        if (methods[options]) { // 传进来的是字符串，检测是否存在该方法，存在则执行
            return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof options === 'object' || !options) { // 若是对象，或者不存在，则执行内部初始化init方法
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + options + 'does not exist on animate-move.js');
        }
    };
    // 配置项
    $.fn.menuToggle.defaults = {
        clickEle: '.menu-title', // 点击元素
        subMenuEle: '.sub-content', // 需要显示隐藏的元素
        activeClass: 'active', //  默认添加的活跃类名
        speed: 500, //  速度
    };
})(jQuery);