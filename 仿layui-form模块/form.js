$(function() {
  /**
   * 属性介绍
   * lay-filter 用于过滤元素（作用类似 class 或 id )
   * lay-rules 校验规则，多个规则之间用 | 隔开
   *
   */
  var ELEM = ".layui-form",
    form = {
      render: function() {}
    },
    $doc = $(document),
    $win = $(window);

  //表单reset重置渲染
  $doc.on("reset", ELEM, function() {
    var filter = $(this).attr("lay-filter");
    setTimeout(function() {
      form.render(null, filter);
    }, 50);
  });

  //表单提交事件
  $doc
    .on("submit", ELEM, function(e) {
      submit.bind(this)();
      e.preventDefault();
    })
    .on("click", "*[lay-submit]", function(e) {
      submit.bind(this)();
      e.preventDefault();
    });
});

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

var submit = function() {
  var btn = $(this);
  var ELEM = ".layui-form";
  var DANGER_Class = 'layui-form-danger';

  formElem = btn.parents(ELEM);
  verifyElem = formElem.find("*[lay-rules]"); //获取需要校验的元素

  // 遍历需要校验的元素
  verifyElem.each(function(index, ele) {
    var othis = $(this);
    var ruleList = othis.attr("lay-rules").split("|");
    var value = othis.val();

    // 遍历该元素需要校验的规则
    $(ruleList).each(function(index, thisVer) {
      var isTrue //是否命中校验
      var errorText = ''; //错误提示文本
      var rule = defaultRules[thisVer];
      var isFn = typeof rule === 'function';

      //匹配验证规则
      if(rule){
        if (isFn) {
          errorText = rule(value, ele);
          isTrue = !!errorText;
        } else {
          errorText = rule[1];
          isTrue = !rule[0].test(value);
        };
        if (isTrue) {
          handleTips(errorText);
          othis.focus();
          DANGER_Class && othis.addClass(DANGER_Class);
          return stop = false;
        }
      }
    });

    // 跳出 jq 的 each 循环
    if(!stop) return stop;
  });
  return false;
};

function handleTips(text) {
  console.log(text);
}