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
//var BASE_URL = "http://www.uplady.cn/nbsc/html/";
var BASE_URL = "http://192.168.1.7:8080/UpLady/";
//�ӿڷ��ʵ�ַ
var AJAX_URL = ROOT_RUL+'nbsc/';
//ģ�����ʱʹ�õ���ʱTOKEN
var TOKEN = "247f1b652ccb1d1e6f238ea9be9f4eb4";
//����汾
var VERSION = "1.0.0";
//�ӿ�ͳ�����ͣ��Զ��壩
var TYPE = "HTML";
//�����ύ����
var GET = 'GET';
var POST = 'POST';
//ÿҳ��ʾ��¼��
var SIZE = 10;
//��ȡ΢������ʹ�õĶ���
var WX_URL = "https://api.weixin.qq.com/sns/";
var METHOD_ACCESS_TOKEN = "oauth2/access_token";
var METHOD_USER_INFO = "userinfo";
var appid = "wx0ab8f7d944794bc5";
var secret = "54a8e016069ef9923ea12c28317360cf";
var grant_type = "authorization_code";
var lang = "zh_CN";
var ACCESS_SOURCE = 1;

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
//��ȡurl�еĲ���
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //����һ������Ŀ�������������ʽ����
    var r = window.location.search.substr(1).match(reg);  //ƥ��Ŀ�����
    if (r != null) return unescape(r[2]); return null; //���ز���ֵ
}