/*
 *  description 在指定断点位置，执行刷新页面操作
 *  author jolin
 *  date 2017-11-1
 */
;(function($){
    function ResizeWidth(opt) {
        let _this = this;
        this.initw = window.innerWidth;
        this.reloadActive = false;
        this.opt = opt;
        
        $(window).resize(function(){
            _this.reloadActive = true;
        });

        setInterval(() => {
            if (_this.reloadActive) {
                _this.hasRefresh(_this.opt);
                _this.reloadActive = false;
            }
        }, opt.checkSpeed);

    }
    ResizeWidth.prototype.hasRefresh = function(opt){
        let curw = window.innerWidth;
        let bp = opt.breakPointPosition;
        // console.log(curw);
        if ((this.initw >= bp && curw < bp) || (this.initw <= bp && curw > bp)) {
            window.location.reload();
        }
        this.initw = curw;
    };
    
    let methods = {
        init: function(options) {
            let opt = $.extend({}, $.breakPointRefresh.defaults, options);
            new ResizeWidth(opt);
        }
    };
    $.breakPointRefresh = function(options) {
        if (methods[options]) { // 传进来的是字符串，检测是否存在该方法，存在则执行
            return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof options === 'object' || !options) { // 若是对象，或者不存在，则执行内部初始化init方法
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + options + 'does not exist on animate-move.js');
        }
    };
    // 配置项
    $.breakPointRefresh.defaults = {
        breakPointPosition: 1000, //  默认断点位置1000px
        checkSpeed: 250,        //  默认的计时器时间，该计时器用于 “执行” 检测浏览器宽度的 “函数”
    };
})(jQuery);