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
    jsonData = convertJSON(jsonData);
    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
    var userInfo = data.user_info;
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
            Android.loadURL(JSON.stringify(webViewData));
        }else if(iOS){
            appData.method = "NBPublicWebViewController";
            iOS.callHandler('openWindow', JSON.stringify(appData), function (response) {});
        }else {
            console.error("APP未注册JavaScript方法，跳转地址："+webViewData.url);
        }
    });
    $("#raiseMoney").click(function(){
        var SHARE_URL = "https://open.weixin.qq.com/connect/oauth2/authorize";
        //testwdtwap193.wowotuan.com
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
    initTitleImage(userInfo.dreamBackPicList);
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
//初始化头部背景图
var titleImgIndex = 0;
function initTitleImage(dreamBackPicList){
    if(dreamBackPicList && dreamBackPicList.length > 0){
        var imgUrl = dreamBackPicList[titleImgIndex%dreamBackPicList.length].picUrl;
        titleImgIndex++;
        console.log(imgUrl);
        $("#title_image").css({
            opacity: 0,
            "background-image": 'url('+imgUrl+')'
        });
        if(dreamBackPicList.length > 1){
            $("#title_image").animate({
                opacity: 1
            }, "slow", function(){
                setTimeout(function(){
                    $("#title_image").animate({
                        opacity: 0
                    }, "slow", function(){
                        initTitleImage(dreamBackPicList);
                    });
                }, 3000);
            });
        }
    }
}
