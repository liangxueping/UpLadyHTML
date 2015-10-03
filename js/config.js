/**
 * Created by liang on 2015/9/27.
 */
/**
 * http://123.56.226.201/upLadyTest/
 */
var BASE_URL = "http://192.168.1.103:8080/UpLady/";
var AJAX_URL = 'http://www.uplady.cn/nbsc/';
var TOKEN = "d8ac0fa2cf1f20cbbed03b569b98a89e";
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