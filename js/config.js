/**
 * Created by liang on 2015/9/27.
 */
/**
 * 服务器HTML应用的访问地址
 * http://123.56.226.201/upLadyTest/
 */
//访问地址根目录
var ROOT_RUL = "http://www.uplady.cn/";
//HTML应用的访问地址
var BASE_URL = "http://www.uplady.cn/nbsc/html/";
//var BASE_URL = "http://192.168.1.7:8080/UpLady/";
//接口访问地址
var AJAX_URL = ROOT_RUL+'nbsc/';
//模拟操作时使用的临时TOKEN
var TOKEN = "247f1b652ccb1d1e6f238ea9be9f4eb4";
//软件版本
var VERSION = "1.0.0";
//接口统计类型（自定义）
var TYPE = "HTML";
//数据提交类型
var GET = 'GET';
var POST = 'POST';
//每页显示记录数
var SIZE = 10;
//获取微信数据使用的对象
var WX_URL = "https://api.weixin.qq.com/sns/";
var METHOD_ACCESS_TOKEN = "oauth2/access_token";
var METHOD_USER_INFO = "userinfo";
var appid = "wx0ab8f7d944794bc5";
var secret = "54a8e016069ef9923ea12c28317360cf";
var grant_type = "authorization_code";
var lang = "zh_CN";
var ACCESS_SOURCE = 1;

//ios设备，接口回调对象
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
//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
//转换非法字符
function convertJSON(jsonData){
    while(typeof jsonData == 'string' && jsonData.indexOf("\r") != -1){
        jsonData = jsonData.replace("\r", "");
    }

    while(typeof jsonData == 'string' && jsonData.indexOf("\n") != -1){
        jsonData = jsonData.replace("\n", "");
    }

    while(typeof jsonData == 'string' && jsonData.indexOf("\t") != -1){
        jsonData = jsonData.replace("\t", "");
    }
    return jsonData;
}