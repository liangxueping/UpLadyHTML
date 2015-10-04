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
var BASE_URL = "http://192.168.1.103:8080/UpLady/";
//接口访问地址
var AJAX_URL = ROOT_RUL+'nbsc/';
//模拟操作时使用的临时TOKEN
var TOKEN = "e4a75df3d09442301272636ede164cdb";
//软件版本
var VERSION = "1.0.0";
//接口统计类型（自定义）
var TYPE = "HTML";
//数据提交类型
var GET = 'GET';
var POST = 'POST';
//获取微信数据使用的对象
var WX_URL = "https://api.weixin.qq.com/sns/";
var METHOD_ACCESS_TOKEN = "oauth2/access_token";
var METHOD_USER_INFO = "userinfo";
var appid = "wxd44769f1ded9fa98";
var secret = "5a248f5cca273304f0835e6451c30e88";
var grant_type = "authorization_code";
var lang = "zh_CN";

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