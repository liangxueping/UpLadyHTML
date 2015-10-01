/**
 * Created by liang on 2015/9/27.
 */
/**
 * http://123.56.226.201/upLadyTest/
 */
var BASE_URL = "http://192.168.1.103:8080/UpLady/";
var AJAX_URL = 'http://www.uplady.cn/nbsc/';
var TOKEN = "e88a33d910378c7dcb32ce8b3eef2afb";
var VERSION = "1.0.0";
var TYPE = "HTML";
var GET = 'GET';
var POST = 'POST';
var iOS;
function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge)
    } else {
        document.addEventListener('WebViewJavascriptBridgeReady', function() {
            callback(WebViewJavascriptBridge)
        }, false)
    }
}
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
        bridge.registerHandler('initActivityDetail', function (data, responseCallback) {
            initActivityDetail(data);
        });
    });
});
//初始化
var params;
function initJS(){
    var METHOD_URL = AJAX_URL+"activityDetail.do";
    var CALL_BACK = "initActivityDetail";
    var data = {};
    if(window.Android){
        params = Android.getParams();
        params = typeof params == 'string' ? JSON.parse(params) : params;
        data.userId = params.clubId;
        Android.getData(METHOD_URL, GET, JSON.stringify(data), CALL_BACK);
        METHOD_URL = AJAX_URL+"userInfo.do";
        CALL_BACK = "initUserInfo";
        Android.getData(METHOD_URL, GET, JSON.stringify(data), CALL_BACK);
    }else if(iOS){
        iOS.callHandler('getParams', {}, function (response) {
            params = response;
            params = typeof params == 'string' ? JSON.parse(params) : params;
            data.userId = params.clubId;
            iOS.callHandler('getData', {URL: METHOD_URL, method: GET, params: JSON.stringify(data), callBack: CALL_BACK}, function (response) {});
            METHOD_URL = AJAX_URL+"userInfo.do";
            CALL_BACK = "initUserInfo";
            iOS.callHandler('getData', {URL: METHOD_URL, method: GET, params: JSON.stringify(data), callBack: CALL_BACK}, function (response) {});
        });
    }else {
        console.error("Android iOS 没有实现getData接口！");
        params = {
            "clubId": 7,
            "clubName": "丛老湿",
            "clubLogo": "http://182.92.243.56:8080/nbsc_image/images/avatar/7_1437496517075.jpg",
            "fansNum": 26
        };
        $.ajax({
            type: GET,
            url: AJAX_URL+"userInfo.do",
            data: {
                token: TOKEN,
                userId: params.clubId,
                version: "1.1.1"
            },
            dataType : 'JSON',
            success: function(result){
                initUserInfo(result);
            },
            error:function(msg) { console.log(msg)}
        });
        $.ajax({
            type: GET,
            url: AJAX_URL+"dynamicImageList.do",
            data: {
                token: TOKEN,
                userId: params.clubId,
                type: TYPE,
                version: "1.1.1"
            },
            dataType : 'JSON',
            success: function(result){
                initDynamicImageList(result);
            },
            error:function(msg) { console.log(msg)}
        });
    }
}
//初始化页面
var activityDetail;
function initActivityDetail(){
    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
    activityDetail = data.activity;

}
