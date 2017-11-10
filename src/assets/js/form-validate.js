;(function ($) {
    var methods = {
        // 初始化
        init: function (options) {
            return this.each(function () {
                var self = this;
                this.opt = $.extend({}, $.fn.validation.defaults, options);
                // 合并之后的全部验证方法
                this.opt.ruleFunArr = $.extend({}, this.opt.ruleMethods, ruleMethods);
                // 调用当前插件的jq对象
                this.opt.$this = $(this);

                // 获取点击提交按钮 第一种情况，按钮不再表单中，从表单父级去获取按钮，否则直接根据按钮选择器获取类名
                this.opt.$submitBtn = (this.opt.$this.find(this.opt.submitBtn).length !== 0) ? this.opt.$this.find(this.opt.submitBtn) : $(this.opt.submitBtn);

                // 表单提交形式，针对表单提交和移动端通过输入法的回车键提交
                this.opt.$this.submit(function(e){
                    return methods.validationHandles.call(self,e,self.opt);
                });
                // 点击提交形式，针对ajax和表单点击提交
                this.opt.$submitBtn.off('click').on('click',function(e){
                    return methods.validationHandles.call(self,e,self.opt);
                });
            });
        },
        validationHandles: function(e,opt){
            // 获取所有被要求验证的input元素
            var requiredInput = opt.$this.find('[data-type]:visible,textarea[data-type]:visible,select[data-type]:visible,input.required,textarea.required,select.required');
            // 获取每个被要求验证的input的验证模式
            var validateRules = [];
            // 获取每个被要求验证的input的错误信息
            var validateErrorMsgs = [];
            requiredInput.each(function () {
                validateRules.push($(this).attr('data-type'));
                validateErrorMsgs.push($(this).attr('data-msg'));
            });
            var validateValues = [];
            requiredInput.each(function () {
                validateValues.push($(this).val());
            });

            var tempRuleArr = [];
            var tempErrorMsgArr = [];

            // debugger
            for (var i = 0, len = validateRules.length; i < len; i++) {
                tempRuleArr = validateRules[i].split('||');
                if (validateErrorMsgs[i]) {
                    tempErrorMsgArr = validateErrorMsgs[i].split('||');
                    if (private_methods.validateAction(tempRuleArr, validateValues[i], opt, requiredInput[i], tempErrorMsgArr) === false) {
                        return false;
                    }
                } else {
                    if (private_methods.validateAction(tempRuleArr, validateValues[i], opt, requiredInput[i]) === false) {
                        return false;
                    }
                }
            }
            if (opt.submitAction) {
                return opt.submitAction(opt.$this);
            } else {
                return false;
            }
        }
    };

    // 私有方法
    var private_methods = {
        // 当前input需要验证的多个方法tempRuleArr
        // validateValues 验证的input的值
        // opt配置项
        // requiredInput 当前要验证的input元素
        validateAction: function (tempRuleArr, validateValues, opt, requiredInput, tempErrorMsgArr) {
            for (var i = 0, len = tempRuleArr.length; i < len; i++) {
                var validateParm = tempRuleArr[i].split(':'); // 此处造成传递给验证方法的参数的不同  /*****重点******/
                var curRule = validateParm.shift();  // 去掉validateParm中的验证方法名称，并将该方法名称赋值给curRule
                var errorMsg;
                if (tempErrorMsgArr) {
                    if (tempErrorMsgArr[i]) {
                        errorMsg = tempErrorMsgArr[i]; // 错误信息
                    } else {
                        errorMsg = opt[curRule]; // 错误信息
                    }
                } else {
                    errorMsg = opt[curRule]; // 错误信息
                }
                var value = validateValues; // 传进入的当前要验证的input的值
                validateParm.unshift(errorMsg);
                validateParm.unshift(value);
                validateParm.push(requiredInput);

                // ruleFunArr 调用插件时自定义的方法和插件内置的方法的合并
                var curRuleFun = opt.ruleFunArr[curRule];   // 当前input要验证的多个方法中的一个
                if (curRuleFun) {
                    if (curRuleFun.apply(requiredInput, validateParm) === false) {
                        requiredInput.focus();
                        return false;
                    }
                } else {
                    $.error('不存在' + curRule + '验证方法！');
                }
            }
        },
        errorTip: function(judge, ele, errorMsg) {
            if (judge) {
                ele.addClass('error').find('p').remove();
                ele.append('<p>'+ errorMsg +'</p>');
                return false;
            } else {
                ele.removeClass('error').find('p').remove();
            }
        }
    };
    // 验证函数
    var ruleMethods = {
        startToend: function(value, errorMsg, el) {
            //验证 两个select控件 的开始时间和结束时间
            var startDateVal = $(el).find('.v-start').val();
            var endDateVal = $(el).find('.v-end').val();
            var d1 = new Date(startDateVal + '');
            var d2 = new Date(endDateVal + '');
            if ((d2 - d1) <= 0) {
                $(el).find('.v-end').focus();
                return false;
            }
        },
        isChecked: function (value, errorMsg, el) {
            // 验证radio，checkbox
            var ele = $(el);
            var judge = ele.find('input:checked').length == 0;
            return private_methods.errorTip(judge, ele, errorMsg);
        },
        isEmail: function (value, errorMsg, el) {
            //是否为邮箱
            var judge = !/(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/.test(value);
            var ele = $(el).parent();
            return private_methods.errorTip(judge, ele, errorMsg);
        },
        // 仅测试手机号码
        isOnlyPhone: function (value, errorMsg, el) {
            //是否为邮箱
            var judge = !/^1[0-9]{10}$/.test(value);
            var ele = $(el).parent();
            return private_methods.errorTip(judge, ele, errorMsg);
        },
        isMobile: function (value, errorMsg, el) {
            //是否为手机号码
            var firstValue = value.slice(0, 1);
            var len = value.length;
            if (value.length == 0) {
                alert('号码不能为空');
                return false;
            }
            if (value.match(/[\u4e00-\u9fa5]+|[A-z]|—/)) {
                alert('号码必须为数字或"-"或","');
                return false;
            }
            if (len == 11) {
                if (firstValue == '0') {  // 如果11位座机号码
                    if (!/^(0[0-9]{3}-[0-9]{6}|0[0-9]{2}-[0-9]{7})$/.test(value)) {
                        alert('座机号码必须加 "-"');
                        return false;
                    }
                } else if (firstValue == '1') {  // 如果是手机号码
                    if (!/^1[0-9]{10}$/.test(value)) {
                        alert('号码必须为数字或"-"或","');
                        return false;
                    }
                } else {
                    alert('号码必须为数字或"-"或","');
                    return false;
                }
            } else if (len <= 13) { // 如果是座机号码，座机号最大12位加横杆-一位  等于13位
                if (!/^(0[0-9]{3}-[0-9]{5,8}|0[0-9]{2}-[0-9]{5,8})$/.test(value)) {
                    alert('座机号码必须加 "-"');
                    return false;
                }
            } else if (len > 13 && len <= 26) {  // 如果是座机与手机共存，中间用逗号隔开，加上逗号总个数不得超出26个
                var phoneArr;
                if (value.indexOf(',') > -1) {
                    phoneArr = value.split(',');
                } else if (value.indexOf('，') > -1) {
                    phoneArr = value.split('，');
                } else {
                    alert('两个电话号码需要用逗号隔开');
                    return false;
                }
                for (var i = 0, len2 = phoneArr.length; i < len2; i++) {
                    if (phoneArr[i].slice(0, 1) == '0') {
                        if (!/^(0[0-9]{3}-[0-9]{5,8}|0[0-9]{2}-[0-9]{5,8})$/.test(phoneArr[i])) {
                            alert('座机号码必须加 "-"');

                            return false;
                        }
                    } else if (phoneArr[i].slice(0, 1) == '1') {
                        if (!/^1[0-9]{10}$/.test(phoneArr[i])) {
                            alert('两个电话号码需要用逗号隔开');
                            return false;
                        }
                    }
                }
            } else {
                alert('不得超过包含逗号在内的26个数字长度');
                return false;
            }
        },
        isOrganizationCode: function (value, errorMsg, el) {
            //是否为组织机构代码
            var judge = !/^(([A-z]|[0-9]){9}|(([A-z]|[0-9]){15})|(([A-z]|[0-9]){18}))$/.test(value);
            var ele = $(el).parent();
            return private_methods.errorTip(judge, ele, errorMsg);
        },
        isEmpty: function (value, errorMsg, el) {
            //是否为空
            var judge = value == '';
            var ele = $(el).parent();
            return private_methods.errorTip(judge, ele, errorMsg);
        },
        isNumber: function (value, errorMsg, el) {
            //是否数字
            var judge = !/(^\d+$)/.test(value);
            var ele = $(el).parent();
            return private_methods.errorTip(judge, ele, errorMsg);
        },
        between: function (value, errorMsg, range, el) {
            // v1 < x.length < v2   验证字符串的长度在某个区间范围内
            var min = parseInt(range.split('-')[0]),
                max = parseInt(range.split('-')[1]),
                value2 = value.toString().length,
                msg = '请输入' + min + '到' + max + '个字！';
            if (errorMsg) {
                msg = errorMsg;
            }
            var judge = value2 < min || value2 > max;
            var ele = $(el).parent();
            return private_methods.errorTip(judge, ele, msg);
        },
        rangeNumber: function (value, errorMsg, range, el) {
            // v1 < x < v2   验证数字的大小在某个区间范围内
            var min = parseInt(range.split('-')[0]),
                max = parseInt(range.split('-')[1]),
                value2 = parseInt(value),
                msg = '请输入' + min + '到' + max + '个字！';
            if (!value2) {
                return private_methods.errorTip(false, el, '请输入数字！');
            }
            if (errorMsg) {
                msg = errorMsg;
            }
            var judge = value2 < min || value2 > max;
            var ele = $(el).parent();
            return private_methods.errorTip(judge, ele, msg);
        }
    };
    // 合并参数
    $.fn.validation = function (method) {
        // 如果第一个是字符串，就查找是否存在该方法，找到就调用，如果是object对象，就调用init方法
        if (methods[method]) {
            // 如果存在该方法就调用

            // Array.prototype.slice.call(arguments,1)相当于arguments.slice(1)

            // methods[method].apply(this,Array.prototype.slice.call(arguments,1))
            // 相当于
            // this.methods[method](Array.prototype.slice.call(arguments,1))
            // apply第二个参数需要数组格式
            // call第二个参数没有规定要数组格式
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            // 如果传进来的是对象，就进行初始化操作
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + 'does not exist on yunqi-validation.js');
        }
    };
    // 默认参数
    $.fn.validation.defaults = {
        isEmail: '请输入正确的邮箱地址',
        isMobile: '请输入正确的电话号码',
        isOrganizationCode: '请输入组织机构代码',
        isEmpty: '内容不能为空',
        isNumber: '内容必须为数字',
        isOnlyPhone: '请输入正确的手机号码',
        between: '',
        rangeNumber: '',
        isChecked: '至少选择一个',
        startToend: '请输入正确的时间范围',
        submitBtn: '#submit',
        ruleMethods: {},
        submitAction: null, // 如果存在，则会在验证通过之后执行该函数
    };
})(jQuery);