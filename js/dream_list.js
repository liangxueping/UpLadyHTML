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
        bridge.registerHandler('initDreamList', function (data, responseCallback) {
            initDreamList(data);
        });
    });
});
//初始化
function initJS(){
    var METHOD_URL = AJAX_URL+"dreamList.do";
    var CALL_BACK = "initDreamList";
    var data = {
        page: 1,
        size: 999
    };
    if(window.Android){
        Android.getData(METHOD_URL, GET, JSON.stringify(data), CALL_BACK);
    }else if(iOS){
        iOS.callHandler('getData',
            {url: METHOD_URL, method: GET, params: JSON.stringify(data), callBack: CALL_BACK},
            function (response) {});
    }else {
        console.error("Android iOS 没有实现getData接口！");
        $.ajax({
            type: GET,
            url: METHOD_URL,
            data: {
                token: TOKEN,
                page: 1,
                size: 999,
                type: TYPE,
                version: "1.1.1"
            },
            dataType : 'JSON',
            success: function(result){
                console.log(result);
                initDreamList(result);
            },
            error:function(msg) { console.log(msg)}
        });
    }
}
//初始化 梦想项目
function initDreamList(jsonData){
    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;

    $("#addMore").click(function(){
        var params = {};
        var webViewData = {};
        //标题名
        webViewData.title = "项目";
        //WebView跳转的地址
        webViewData.url = BASE_URL+"home_what_more.html";
        //页面获取数据时使用的参数
        webViewData.params = params;
        //右侧按钮对象
        webViewData.rightButton = {};
        var appData = {};
        appData.data = webViewData;
        if(window.Android){
            appData.method = "com.uplady.teamspace.search.WebViewActivity";
            Android.openWindow(JSON.stringify(appData));
        }else if(iOS){
            appData.method = "NBPublicWebViewController";
            iOS.callHandler('openWindow', JSON.stringify(appData), function (response) {});
        }else {
            console.error("APP未注册JavaScript方法，跳转地址："+webViewData.url);
        }
    });
    var userInfo = data.user_info;
    $("#raiseMoney").click(function(){
        var shareData = {};
        shareData.url = BASE_URL+"dream_list_share.html?userId="+userInfo.userId;
        shareData.logo = userInfo.userIcon;
        shareData.title = userInfo.userName+"的梦想清单";
        shareData.content = userInfo.dreamWord;

        if(window.Android){
            Android.share(JSON.stringify(appData));
        }else if(iOS){
            iOS.callHandler('share', JSON.stringify(appData), function (response) {});
        }else {
            console.error("APP未注册JavaScript方法：分享");
        }
    });

    $(".avat").find("img").attr("src", userInfo.userIcon);
    $(".uname").html("我是"+userInfo.userName);
    $(".sign").html(userInfo.dreamWord);

    var dataList = data.list;
    $('#dreamList').empty();
    if(dataList && dataList.length > 0){
        dataList.forEach(function(elem){
            var $dom =$('#dream_a').clone().appendTo('#dreamList');
            $dom.find(".bg").css({
                "background-image": 'url('+elem.labelBgImg+')'
            });
            $dom.find(".title").html(elem.labelTitle);
            $dom.find(".sub_title").html(elem.labelDes);
            $dom.click(function(){
                var params = elem;
                var webViewData = {};
                //标题名
                webViewData.title = params.labelTitle;
                //WebView跳转的地址
                webViewData.url = BASE_URL+"home_what.html";
                //页面获取数据时使用的参数
                webViewData.params = params;
                //右侧按钮对象
                webViewData.rightButton = {};
                var appData = {};
                appData.data = webViewData;
                if(window.Android){
                    appData.method = "com.uplady.teamspace.search.WebViewActivity";
                    Android.openWindow(JSON.stringify(appData));
                }else if(iOS){
                    appData.method = "NBPublicWebViewController";
                    iOS.callHandler('openWindow', JSON.stringify(appData), function (response) {});
                }else {
                    console.error("APP未注册JavaScript方法，跳转地址："+webViewData.url);
                }
            });
        });
    }
}