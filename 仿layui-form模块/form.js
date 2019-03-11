$(function() {
  /**
   * 属性介绍
   * lay-filter 用于过滤元素（作用类似 class 或 id )
   * lay-verify 校验规则，多个规则之间用 | 隔开
   *
   */
  var ELEM = ".layui-form",
    form = {
      render: function() {}
    },
    $dom = $(document),
    $win = $(window);

  //表单reset重置渲染
  $dom.on("reset", ELEM, function() {
    var filter = $(this).attr("lay-filter");
    debugger;
    setTimeout(function() {
      form.render(null, filter);
    }, 50);
  });

  //表单提交事件
  $dom
    .on("submit", ELEM, function(e) {
      submit.bind(this)();
      e.preventDefault();
    })
    .on("click", "*[lay-submit]", function(e) {
      submit.bind(this)();
      e.preventDefault();
    });
});

var submit = function() {
  var btn = $(this);
  var ELEM = ".layui-form";
  var DANGER_Class = 'layui-form-danger';

  // 默认的校验规则，每项规则可以是正则也可以是函数
  var verify = {
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
  formElem = btn.parents(ELEM);
  verifyElem = formElem.find("*[lay-verify]"); //获取需要校验的元素

  // 遍历需要校验的元素
  verifyElem.each(function(index, item) {
    var othis = $(this);
    var vers = othis.attr("lay-verify").split("|");
    var verType = othis.attr("lay-verType");
    var value = othis.val();

    // 遍历该元素需要校验的规则
    $(vers).each(function(index, thisVer) {
      var isTrue //是否命中校验
      var errorText = ''; //错误提示文本
      var rule = verify[thisVer];
      var isFn = typeof rule === 'function';

      //匹配验证规则
      if(rule){
        if (isFn) {
          errorText = rule(value, item);
          isTrue = !!errorText;
        } else {
          errorText = rule[1];
          isTrue = !rule[0].test(value);
        };
        if (isTrue) {
          handleTips(errorText);
          othis.focus();
          othis.addClass(DANGER_Class);
          return stop = false;
        }
      }

    });

    if(!stop) return stop;
  });
  return false;
};

function handleTips(text) {
  console.log(text);
}