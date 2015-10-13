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
        bridge.registerHandler('initLabel', function (data, responseCallback) {
            initLabel(data);
        });
    });
});
//App 通知 HTML 初始化的方法
function initJS(){
    var params = {
        type: 1,
        page: 1,
        size: 999
    };
    if(window.Android){
        Android.getData(AJAX_URL+"getLabels.do", GET, JSON.stringify(params), 'initLabel');
    }else if(iOS){
        iOS.callHandler('getData', {
            url: AJAX_URL+"getLabels.do",
            method: GET,
            params: JSON.stringify(params),
            callBack: 'initLabel'
        }, function (response) {});
    }else{
        console.log("Android iOS 没有实现接口，HTML自己获取数据！");
        //$.ajax({
        //    type: GET,
        //    url: AJAX_URL+"getLabels.do",
        //    data: params,
        //    dataType : 'JSON',
        //    success: function(result){
        //        initLabel(result);
        //    },
        //    error:function(msg) { console.log(msg)}
        //});
    }
}
//初始化 热门标签
function initLabel(jsonData){
    jsonData = convertJSON(jsonData);
    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
    var labels = data.list;
    if(!labels || labels.length == 0){
        $('.home_label').hide();
    }else {
        $('#home_label_content').empty();
        labels.forEach(function(elem){
            var $label =$('#home_label_content_a').clone().appendTo($('#home_label_content'));
            $label.find('img').attr('src', elem.labelImg);
            $label.find('.title').html(elem.labelTitle);
            $label.click(function(){
                var appData = {};
                appData.data = elem;
                if(window.Android){
                    appData.method = "com.uplady.teamspace.mine.LabelDetailActivity";
                    Android.openWindow(JSON.stringify(appData));
                }else if(iOS){
                    appData.method = "NBLabelDetailsViewController";
                    iOS.callHandler('openWindow', JSON.stringify(appData), function (response) {});
                }else {
                    console.error("APP未注册JavaScript方法 openWindow");
                }
            });
        });
    }
}