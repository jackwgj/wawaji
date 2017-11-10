/*
 *  description 元素滚出屏幕一定距离后，添加类名，执行动画
 *  author jolin
 *  date 2017-07-24
 */
;(function($){
    let methods = {
        init: function(options) {
            return this.each(function(){
                let self = this;
                let objst, currentst, wh;
                self.opt = $.extend({}, $.fn.animateMove.defaults, options);

                let $activeHeight = self.opt.activeHeight;
                let $this = $(self);
                let $window = $(window);

                objst = $this.offset().top;
                wh = $window.height();

                $window.on('scroll', function(){
                    currentst = $window.scrollTop();
                    if (currentst + wh - objst > $activeHeight) {
                        $this.addClass(self.opt.activeClass);
                    }
                });
            });
        }
    };
    $.fn.animateMove = function(options) {
        if (methods[options]) { // 传进来的是字符串，检测是否存在该方法，存在则执行
            return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof options === 'object' || !options) { // 若是对象，或者不存在，则执行内部初始化init方法
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + options + 'does not exist on animate-move.js');
        }
    };
    // 配置项
    $.fn.animateMove.defaults = {
        activeClass: 'is-active', //  默认添加的活跃类名
        activeHeight: 280,        //  默认的超过屏幕底部280px高度则添加类名
    };
})(jQuery);