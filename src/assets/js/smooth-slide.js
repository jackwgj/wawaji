/*
 *  description 点击tab栏元素，获取元素上的存有的id值，根据id值获取相应元素，继而滚动到浏览器顶部（不是文档顶部哦）
 *  author jolin
 *  date 2017-06-07
 */
;(function($){
    let methods = {
        init: function(options) {
            return this.each(function(){
                let self = this;
                self.opt = $.extend({}, $.fn.smoothSlide.defaults, options);

                let $this = $(self);
                let labelType = self.opt.clickLabel;
                let clickAble = true;

                // 获取需要点击时的相对应id元素滑动的元素
                let $slideElements = $this.find(labelType);
                $slideElements.off('click').on('click',function(e){
                    e.preventDefault();
                    if (clickAble) {
                        clickAble = false;
                        // 阻止默认事件，即点击a标签，href上有相对应的#id，点击之后浏览器默认会瞬间跳转到相应id元素位置
                        let $window = $(window);
                        let id = $(this).attr('href');
                        let scrollObj = $(id);
                        let objst = scrollObj.offset().top;
                        let currentst = $window.scrollTop();
                        let range = objst - currentst;
                        if (range === 0) {
                            clickAble = true;
                            return;
                        }

                        let timer = null,calcSymbol,addNum = 0,scrollNum = 0;
                        let intervalTime = 10;
                        let slideTime = self.opt.slideTime;

                        let speed = parseInt(Math.abs(range) / slideTime * intervalTime);
                        if (range > 0) { // 差值大于0，说明该元素距离浏览器顶部还有段距离
                            calcSymbol = 1;
                        } else { // 差值小于0，说明已经滚动到该元素下方
                            calcSymbol = -1;
                        }
                        timer = setInterval(function(){
                            addNum += speed * calcSymbol;
                            scrollNum = currentst + addNum;
                            $window.scrollTop(scrollNum);
                            if ((scrollNum >= (objst - speed) && calcSymbol > 0) || (scrollNum <= (objst + speed) && calcSymbol < 0)) {
                                clearInterval(timer);
                                $window.scrollTop(objst);
                                clickAble = true;
                            }
                        }, intervalTime);
                    }
                });

            });
        }
    };
    $.fn.smoothSlide = function(options) {
        if (methods[options]) { // 传进来的是字符串，检测是否存在该方法，存在则执行
            return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof options === 'object' || !options) { // 若是对象，或者不存在，则执行内部初始化init方法
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + options + 'does not exist on smooth-slide.js');
        }
    };
    // 配置项
    $.fn.smoothSlide.defaults = {
        clickLabel: 'a', // 点击的元素标签类型
        slideTime: 500, //  滑动到顶部所需要的时间
    };
})(jQuery);