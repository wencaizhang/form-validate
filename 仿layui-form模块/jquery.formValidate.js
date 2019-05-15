/**
 * 属性介绍
 * lay-filter 用于过滤元素（作用类似 class 或 id )
 * lay-rules 校验规则，多个规则之间用 | 隔开
 *
 */

(function($, window, document, undefined) {
  var pluginName = "formValidate";
  /**
   *
   * 默认的校验规则，每项规则可以是正则也可以是函数
   * 如果使用正则校验，那么提供一个数组，数组第一项是正则，第二项是提示信息
   * 如果使用函数校验，当不符合校验规则时，请返回提示信息
   */
  var defaultRules = {
    required: [/[\S]+/, "必填项不能为空"],
    phone: [/^1\d{10}$/, "请输入正确的手机号"],
    email: [
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
      "邮箱格式不正确"
    ],
    url: [/(^#)|(^http(s*):\/\/[^\s]+\.[^\s]+)/, "链接格式不正确"],
    number: function(value) {
      if (!value || isNaN(value)) return "只能填写数字";
    },
    date: [
      /^(\d{4})[-\/](\d{1}|0\d{1}|1[0-2])([-\/](\d{1}|0\d{1}|[1-2][0-9]|3[0-1]))*$/,
      "日期格式不正确"
    ],
    identity: [/(^\d{15}$)|(^\d{17}(x|X|\d)$)/, "请输入正确的身份证号"]
  };

  function Plugin(ele, options) {
    // 此处 this 是 Plugin 的实例对象
    var self = this;
    self.ele = $(ele);
    self.options = $.extend(
      {
        DANGER_CLASS: "layui-form-danger",
        // 当某一规则校验不通过时，是否停止剩下的规则的校验
        validateFirst: true,
        // 预设的规则属性
        rulePropName: "lay-rules",
      },
      options,
      {
        rules: $.extend(defaultRules, options.rules || {})
      }
    );
    self.init();
  }

  Plugin.prototype = {
    //提示信息定位，传入参数（提示对象，提示信息内容）
    init: function(configObj) {
      var self = this;

      //表单提交事件
      self.ele
        .on("submit", function(e) {
          self.submit();
          e.preventDefault();
          return false;
        })
        .on("click", "*[lay-submit]", function(e) {
          self.submit();
          e.preventDefault();
          return false;
        });
    },

    submit: function() {
      var self = this;
      var validateEle = self.ele.find("*[" + self.options.rulePropName + "]"); //获取需要校验的元素

      // 遍历需要校验的元素
      validateEle.each(function(index, ele) {
        var othis = $(this);
        var ruleList = othis.attr(self.options.rulePropName).split("|");
        var value = othis.val();
        var validateStatus = true;

        // 遍历该元素需要校验的规则
        $.each(ruleList, function(index, thisRule) {
          var isTrue; //是否命中校验
          var errorText = ""; //错误提示文本
          var rule = self.options.rules[thisRule];
          var isFn = typeof rule === "function";

          //匹配验证规则
          if (rule) {
            if (isFn) {
              errorText = rule(value, ele);
              isTrue = !!errorText;
            } else {
              errorText = rule[1];
              isTrue = !rule[0].test(value);
            }
            if (isTrue) {
              var handleTips = self.options.handleTips || self.handleTips;
              handleTips(errorText, ele);
              othis.focus();
              othis.addClass(self.options.DANGER_CLASS);
            }
            if (isTrue && self.options.validateFirst) {
              return validateStatus = false;
            }
          }
        });

        // 跳出 jq 的 each 循环
        if (!validateStatus) return validateStatus;
      });
      // return false;
    },
    handleTips: function(text, ele) {
      console.log(text);
      console.log(ele);
    }
  };

  $.fn[pluginName] = function(options) {
    // 此处 this 是被 jquery 包装过的 dom 对象
    this.each(function() {
      new Plugin(this, options);
    });

    return this;
  };
})(jQuery, window, document);
