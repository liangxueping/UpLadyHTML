/**
 * Created by liang on 2015/10/16.
 */

(function(window, document, undefined) {
    var interval = 800;
    var closeDelay = 200;
    var index = 0;
    var couponLinks;
    var getCoupon = function() {
        if (index >= couponLinks.length) {
            console.log("��ȡ���");
            return;
        }
        var coponLink = couponLinks[index];
        coponLink.click(); index++;
        console.log("��ȡ ��" + index + " ��");
        setTimeout(getCoupon, interval);
        setTimeout(function() {
            var close = document.querySelector('.mui-dialog-close');
            if (close != null) close.click();
        }, closeDelay);
    }
    var _scrollTop = 0;
    var _scrollStep = document.documentElement.clientHeight;
    var _maxScrollTop = document.body.clientHeight - document.documentElement.clientHeight;
    var autoScrollDown = setInterval(function() {
        _scrollTop += _scrollStep;
        if (_scrollTop > _maxScrollTop) {
            clearInterval(autoScrollDown);
            couponLinks = document.querySelectorAll('.mui-act-item-yhqbtn');
            console.log("�ܹ���" + couponLinks.length + "�����Ż�ȯ����ȡ...");
            getCoupon();
        } else {
            document.body.scrollTop = _scrollTop;
        }
    }, 500);
}) (window, document);