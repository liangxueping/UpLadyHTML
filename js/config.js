/**
 * Created by liang on 2015/9/27.
 */
/**
 * ������HTMLӦ�õķ��ʵ�ַ
 * http://123.56.226.201/upLadyTest/
 */
//���ʵ�ַ��Ŀ¼
var ROOT_RUL = "http://www.uplady.cn/";
//HTMLӦ�õķ��ʵ�ַ
var BASE_URL = "http://192.168.1.103:8080/UpLady/";
//�ӿڷ��ʵ�ַ
var AJAX_URL = ROOT_RUL+'nbsc/';
//ģ�����ʱʹ�õ���ʱTOKEN
var TOKEN = "e4a75df3d09442301272636ede164cdb";
//����汾
var VERSION = "1.0.0";
//�ӿ�ͳ�����ͣ��Զ��壩
var TYPE = "HTML";
//�����ύ����
var GET = 'GET';
var POST = 'POST';
//ios�豸���ӿڻص�����
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