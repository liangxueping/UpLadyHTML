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
        bridge.registerHandler('initClubDetail', function (data, responseCallback) {
            initClubDetail(data);
        });
    });
});
//初始化
var params;
function initJS(){
    var METHOD_URL = AJAX_URL+"clubDetail.do";
    var CALL_BACK = "initClubDetail";
    if(window.Android){
        params = Android.getParams();
        params = typeof params == 'string' ? JSON.parse(params) : params;
        var data = {
            clubId: params.clubId
        };
        Android.getData(METHOD_URL, GET, JSON.stringify(data), CALL_BACK);
    }else if(iOS){
        iOS.callHandler('getParams', {}, function (response) {
            params = response;
            params = typeof params == 'string' ? JSON.parse(params) : params;
            var data = {
                clubId: params.clubId
            };
            iOS.callHandler('getData', {url: METHOD_URL, method: GET, params: JSON.stringify(data), callBack: CALL_BACK}, function (response) {});
        });
    }else {
        console.log("Android iOS 没有实现接口，HTML自己获取数据！");
        //params = {
        //    "clubId": 9,
        //    "clubName": "鹤掌门",
        //    "clubLogo": "http://182.92.243.56:8080/nbsc_image/images/avatar/8_1438333374615.jpg",
        //    "fansNum": 27
        //}
        //$.ajax({
        //    type: GET,
        //    url: AJAX_URL+"clubDetail.do",
        //    data: {
        //        token: TOKEN,
        //        clubId: params.clubId
        //    },
        //    dataType : 'JSON',
        //    success: function(result){
        //        console.log(result);
        //        initClubDetail(result);
        //    },
        //    error:function(msg) { console.log(msg)}
        //});
    }
}
//初始化 详情内容
function initClubDetail(jsonData){
    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
    $(".btn_home").click(function(){
        var webViewData = {};
        //标题名
        webViewData.title = params.clubName+"的主页";
        //WebView跳转的地址
        webViewData.url = BASE_URL+"club.html";
        //页面获取数据时使用的参数
        webViewData.params = params;
        //右侧按钮对象
        webViewData.rightButton = {
            title: "帐号信息",
            icon: 0,
            eventType: 0,
            url: BASE_URL+"club_info.html",
            params: params,
            rightButton: {}
        };

        if(window.Android){
            Android.loadURL(JSON.stringify(webViewData));
        }else if(iOS){
            iOS.callHandler('loadURL', JSON.stringify(webViewData), function (response) {});
        }else {
            console.error("APP未注册JavaScript方法，跳转地址："+webViewData.url);
        }
    });
    if(!data.clubDetail){
        return;
    }
    var clubDetail = data.clubDetail;
    $(".bg").css({
        'background-image': 'url('+clubDetail.clubLogo+')'
    });
    $("#clubLogo").attr("src", clubDetail.clubLogo);
    $(".uname").html(clubDetail.clubName);

    $("#introduction").html(clubDetail.introduction);
    $("#company").html(clubDetail.company);
    $("#sales").html(clubDetail.sales);
    $("#serviceFeature").html(clubDetail.serviceFeature);
    $("#discount").html(clubDetail.discount);

    $(".tel_zone").html('<i class="ico_tel"></i>'+clubDetail.phone).click(function(){
        if(window.Android){
            Android.callPhone(clubDetail.phone);
        }else if(iOS){
            iOS.callHandler('callPhone', clubDetail.phone, function (response) {});
        }else {
            console.error("APP未注册JavaScript方法，callPhone");
        }
    });

    var service = clubDetail.service;
    if(service){
        var serviceList = service.split(",");
        var $ul;
        serviceList.forEach(function(elem, index){
            if(index % 5 == 0){
                $ul = $('<ul class="tags_info">');
            }
            var $li = $('<li>'+elem+'</li>');
            $li.clone().appendTo($ul);

            if(index == 0){
                $ul.addClass("mt");
            }
            if(index == serviceList.length - 1){
                $ul.addClass("mb");
            }
            if((index+1) % 5 == 0 || index == serviceList.length - 1){
                $ul.clone().appendTo("#content");
            }
        });
    }
}