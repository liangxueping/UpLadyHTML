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