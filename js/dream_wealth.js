/**
 * Created by liang on 2015/9/27.
 */
document.write("<script src='js/config.js'></script>");
$(document).ready(function(){
    //注册iOS方法
    connectWebViewJavascriptBridge(function (bridge) {
        iOS = bridge;
        bridge.init(function (message, responseCallback) {
            var data = { 'Javascript Responds': 'Wee!' }
            responseCallback(data);
        });
        bridge.registerHandler('initJS', function (data, responseCallback) {
            initJS();
        });
        bridge.registerHandler('initDreamHelpTotal', function (data, responseCallback) {
            initDreamHelpTotal(data);
        });
        bridge.registerHandler('initDreamList', function (data, responseCallback) {
            initDreamList(data);
        });
    });
});

//初始化
function initJS(){
    var METHOD_URL = AJAX_URL+"dreamHelpTotal.do";
    var CALL_BACK = "initDreamHelpTotal";
    var data = {};
    if(window.Android){
        Android.getData(METHOD_URL, GET, JSON.stringify(data), CALL_BACK);
    }else if(iOS){
        iOS.callHandler('getData',
            {url: METHOD_URL, method: GET, params: JSON.stringify(data), callBack: CALL_BACK},
            function (response) {});
    }else {
        console.error("Android iOS 没有实现getData接口！");
    }
    METHOD_URL = AJAX_URL+"dreamList.do";
    CALL_BACK = "initDreamList";
    data = {
        page: 1,
        size: 999
    };
    if(window.Android){
        Android.getData(METHOD_URL, GET, JSON.stringify(data), CALL_BACK);
    }else if(iOS){
        iOS.callHandler('getData',
            {url: METHOD_URL, method: GET, params: JSON.stringify(data), callBack: CALL_BACK},
            function (response) {});
    }
}
//初始化 梦想基金筹集按钮
function initDreamList(jsonData){
    jsonData = convertJSON(jsonData);
    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
    var userInfo = data.user_info;
    $(".dream_list_opts_wrap").click(function(){
        var SHARE_URL = "https://open.weixin.qq.com/connect/oauth2/authorize";
        var redirect_uri = BASE_URL+"dream_detail.html?userId=";
        //var redirect_uri = "http://www.uplady.cn/nbsc/html/dream_detail.html?userId=";
        var response_type = "code";
        var scope = "snsapi_userinfo";

        redirect_uri = encodeURIComponent(redirect_uri+userInfo.userId);
        var url = SHARE_URL;
        url += "?appid="+appid;
        url += "&redirect_uri="+redirect_uri;
        url += "&response_type="+response_type;
        url += "&scope="+scope;
        url += "#wechat_redirect";

        var shareData = {};
        shareData.url = url;
        shareData.logo = userInfo.userIcon;
        shareData.title = userInfo.userName+"的梦想清单";
        shareData.content = userInfo.dreamWord;

        if(window.Android){
            Android.share(JSON.stringify(shareData));
        }else if(iOS){
            iOS.callHandler('share', JSON.stringify(shareData), function (response) {});
        }else {
            console.error("APP未注册JavaScript方法：分享");
        }
    });
}
//初始化梦想助力统计
function initDreamHelpTotal(jsonData){
    jsonData = convertJSON(jsonData);
    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
    if(data && data.status == 100){
        var feeValue = formatNumber(data.feeValue, ",");
        $(".total").html(feeValue);
    }else {
        $(".total").html(0);
    }
}
//格式化金额，添加千位分隔符
function formatNumber(n, j) {
    var s = n + "";
    var l = s.length;
    var m = l % 3;
    if (m==l) return s;
    else if(m==0) return (s.substring(m).match(/\d{3}/g)).join(j);
    else return [s.substr(0,m)].concat(s.substring(m).match(/\d{3}/g)).join(j);
}