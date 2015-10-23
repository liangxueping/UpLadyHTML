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
        bridge.registerHandler('initRecommendLabel', function (data, responseCallback) {
            initRecommendLabel(data);
        });
        bridge.registerHandler('addFavoriteLabel', function (data, responseCallback) {
            addFavoriteLabel(data);
        });
        bridge.registerHandler('delFavoriteLable', function (data, responseCallback) {
            delFavoriteLable(data);
        });
    });

    $(window).scroll(function(){
        if(!nextpage || nextpage == 0){
            return;
        }
        var bodyHeight = $("body").height();
        var bodyTop = $("body").scrollTop();
        var clientHeight = document.documentElement.clientHeight;
        if(bodyHeight > clientHeight && bodyHeight - bodyTop <= clientHeight){
            page++;
            initJS();
        }
    })
});
//初始化
var page = 1;
var nextpage;
function initJS(){
    var METHOD_URL = AJAX_URL+"getLabels.do";
    var CALL_BACK = "initRecommendLabel";
    var data = {
        type: 2,
        page: page,
        size: SIZE
    };
    if(window.Android){
        Android.getData(METHOD_URL, GET, JSON.stringify(data), CALL_BACK);
    }else if(iOS){
        iOS.callHandler('getData',
            {url: METHOD_URL, method: GET, params: JSON.stringify(data), callBack: CALL_BACK},
            function (response) {});
    }else {
        console.error("Android iOS 没有实现getData接口！");
        //$.ajax({
        //    type: GET,
        //    url: METHOD_URL,
        //    data: data,
        //    dataType : 'JSON',
        //    success: function(result){
        //        initRecommendLabel(result);
        //    },
        //    error:function(msg) { console.log(msg)}
        //});
    }
}
//初始化 梦想项目
function initRecommendLabel(jsonData){
    jsonData = convertJSON(jsonData);
    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
    var dataList = data.list;
    nextpage = data.nextpage;
    if(page == 1){
        $('#labelList').empty();
    }
    if(dataList && dataList.length > 0){
        dataList.forEach(function(elem){
            var $dom =$('#label_a').clone().appendTo('#labelList');
            $dom.find(".bg").css({
                "background-image": 'url('+elem.labelBgImg+')'
            });
            $dom.find(".title").html(elem.labelTitle);
            $dom.find(".sub_title").html(elem.labelDes);
            var $dreaming = $dom.find(".dreaming");
            if(elem.ifDreamList == 1){
                $dreaming.addClass("active").html('<i class="i iA iA_pass iA_black"></i>已添加');
            }else {
                $dreaming.removeClass("active").html('<i class="i iC iC_small iC_white"></i>添加梦想');
            }
            var isDreaming = false;
            $dreaming.click(function(){
                isDreaming = true;
                var params = {
                    labelId: elem.labelId
                };
                var METHOD_URL = AJAX_URL+"dreamAdd.do";
                var CALL_BACK;
                if(elem.ifDreamList != 1){
                    CALL_BACK = "addFavoriteLabel";
                    params.type = 1;
                    window.addFavoriteLabel = function (jsonData){
                        jsonData = convertJSON(jsonData);
                        var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
                        if(data.status == 100){
                            console.log("添加关注梦想项目成功！");
                            $dreaming.addClass("active").html('<i class="i iA iA_pass iA_black"></i>已添加');
                            elem.ifDreamList = 1;
                        }else {
                            console.error("添加关注梦想项目失败！");
                        }
                    }
                }else {
                    CALL_BACK = "delFavoriteLable";
                    params.type = 0;
                    window.delFavoriteLable = function (jsonData){
                        jsonData = convertJSON(jsonData);
                        var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
                        if(data.status == 100){
                            console.log("删除关注梦想项目成功！");
                            $dreaming.removeClass("active").html('<i class="i iC iC_small iC_white"></i>添加梦想');
                            elem.ifDreamList = 0;
                        }else {
                            console.error("删除关注梦想项目失败！");
                        }
                    }
                }
                if(window.Android){
                    Android.getData(METHOD_URL, GET, JSON.stringify(params), CALL_BACK);
                }else if(iOS){
                    iOS.callHandler('getData', {url: METHOD_URL, method: GET, params: JSON.stringify(params), callBack: CALL_BACK}, function (response) {});
                }else{
                    console.log("Android iOS 没有实现getData接口，HTML自己获取数据！");
                }
                setTimeout(function(){ isDreaming = false;},200);
            });
            $dom.click(function(){
                if(isDreaming){
                    return;
                }
                var params = elem;
                var webViewData = {};
                //标题名
                webViewData.title = params.labelTitle;
                //WebView跳转的地址
                webViewData.url = BASE_URL+"home_what.html";
                //页面获取数据时使用的参数
                webViewData.params = params;
                //右侧按钮对象
                webViewData.rightButton = {
                    title: params.labelTitle,
                    icon: 3,
                    eventType: 3,
                    url: "",
                    params: params,
                    rightButton: {}
                };
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