1. // 上拉刷新
$(document).scroll(function (event) {
   var scroolHeight = $(document).height() - $(window).height();
   if ($(this).scrollTop() == scroolHeight) {
       // pageIndex++;
       // app.getList();
   }
});
// ===============================================================
2. // 列表项增加操作
bindSwipe: function (objItem) {
      var startX, // 开始位置
          moveX; // 移动位置

      $(page).on('touchstart mousedown', objItem + ' li.can-action-item', function (e) {
            e.preventDefault();
            startX = e.pageX;
            var $self = $(this),
		$allContentItem = $(page).find('.item-inner'),
		$allBtnItem = $(page).find('.item-btn'),
		$contentItem = $self.find('.item-inner'),
		$btnItem = $self.find('.item-btn');

                    //$allContentItem.css('transform', 'translateX(0)');
                    //$allBtnItem.hide();

                $(this).on('touchmove mousemove', function (m) {
                      m.preventDefault();
                      moveX = m.pageX;

                      if (startX > moveX) { // 向左
                            $contentItem.css('transform', 'translateX(-4rem)');
                            $btnItem.show();
                      }
                      else if (startX < moveX) { // 向右
                            $contentItem.css('transform', 'translateX(0)');
                            $btnItem.hide();
                      }

                });
       });

       $(page).on('touchend mouseup', objItem + ' li.can-action-item', function (e) {
                    e.preventDefault();
                    $(this).off('touchmove mousemove');
       });
}
// ====================================================================================
3. // js（jQuery）打开新窗口
// 1)
var win = window.open("https://baidu.com");

if (!win) {
       layer.msg("新窗口打开被阻止");
}
// 2)
<a href="https://baidu.com" target="_blank" id="linkTest">test</a>
$("#linkTest").get(0).click();
// ====================================================================================
4. // js url 回调函数
window["callFun"]();
// ====================================================================================
5. // 重写 jquery.validate 的showErrors函数
	$.extend($.validator.prototype, {
	    showErrors: function () {
	        var $errorElement = "";

	        // 成功
	        $.each(this.successList, function (i,o) {
	            $errorElement = $(o);
	            $errorElement.removeClass("input-validation-error").tooltip("destroy");
	        });

            // 错误
	        $.each(this.errorList, function (i,o) {
	            $errorElement = $(o.element);
	            $errorElement.addClass("input-validation-error");
	            $errorElement.data("title", o.message).tooltip("show");
	        });
	    }
	});
// =====================================================================================
6. //js 字符串格式化
String.format = function () {
        var str = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
            str = str.replace(RegExp("\\{" + (i - 1) + "\\}", "gm"), arguments[i]);
        }
        return str;
};
// =====================================================================================
