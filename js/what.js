/**
 * Created by liang on 2015/9/27.
 */
var BASE_URL = "http://127.0.0.1:8080/UpLady/";
var AJAX_URL = 'http://182.92.243.56/nbsc/';
var TOKEN = "e88a33d910378c7dcb32ce8b3eef2afb";
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
var isMove = false;
var $imgZoomer;
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
        bridge.registerHandler('initData', function (data, responseCallback) {
            initData(data);
        });
    });
    $imgZoomer = $('<div>').css({
        'position': 'absolute',
        'top': '0',
        'left': '0',
        'width': '100%',
        'height': '100%',
        'background': 'rgba(0,0,0,0.5)',
        'display': 'none'
    }).html('<div style="display: table;table-layout: fixed;width: 100%;height: 100%">' +
        '<div style="display: table-cell;vertical-align: middle;width: 100%;text-align: center;overflow: auto">' +
        '<img src="">' +
        '</div></div>').on('touchstart',function(){
        isMove = false;
    }).on('touchmove',function(){
        isMove = true;
    }).on('touchend',function(e){
        isMove || $(this).fadeOut();
        isMove = false;
    }).appendTo('body');
});
//App 通知 HTML 初始化的方法
function initJS(){
    var params;
    if(window.Android){
        params = Android.getParams();
    }else if(iOS){
        iOS.callHandler('getParams', {}, function (response) {
            params = response;
        });
    }else{
        console.log("Android iOS 没有实现接口，HTML自己获取数据！");
        params = {
            "labelId": 5,
            "labelTitle": "攀岩",
            "labelImg": "http://182.92.243.56:8080/nbsc_image/images/label/5/1436085778801.jpg",
            "labelBgImg": "http://182.92.243.56:8080/nbsc_image/images/label/5/1436085778801.jpg",
            "labelDes": "攀岩标签",
            "fansNum": 11,
            "ifFavorite": false
        };
        $.ajax({
            type: GET,
            url: AJAX_URL+"labelDetail.do",
            data: {
                token: TOKEN,
                labelId: params.labelId,
                ifSubject: 1,
                type: "HTML",
                version: "1.1.1"
            },
            dataType : 'JSON',
            success: function(result){
                initLabelDetail(result);
            },
            error:function(msg) { console.log(msg)}
        });
        $.ajax({
            type: GET,
            url: AJAX_URL+"recommendUser.do",
            data: {
                token: TOKEN,
                labelId: params.labelId,
                page: 1,
                size: 999,
                version: "1.1.1"
            },
            dataType : 'JSON',
            success: function(result){
                console.log("获取达人数据：");
                console.log(result);
                initUserList(result);
            },
            error:function(msg) { console.log(msg)}
        });
    }

    //initLabelDetail(params);
}
//初始化 标题头
function initLabelDetail(jsonData){
    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
    $("#labelTitle").html(data.labelDetail.labelTitle);
    $("#labelDes").html(data.labelDetail.labelDes);
    $("#userNum").html(data.labelDetail.userNum);
    $("#activityNum").html(data.labelDetail.activityNum);
}
//初始化 达人列表
function initUserList(jsonData){
    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
    var dataList = data.list;
    if(dataList && dataList.length > 0){
        $('#userList').empty();
        dataList.forEach(function(elem){
            var $dom =$('#user').clone().appendTo($('#userList'));
            $dom.find("#userIcon").attr("src", elem.userIcon);
            $dom.find("#userIcon").click(function(){
                var appData = {};
                appData.data = elem;
                if(window.Android){
                    appData.method = "com.uplady.teamspace.mine.PersonalHomePageAcitity";
                    Android.openWindow(JSON.stringify(appData));
                }else if(iOS){
                    appData.method = "NBUserDetailsViewController";
                    iOS.callHandler('openWindow', JSON.stringify(appData), function (response) {});
                }else {
                    console.error("APP未注册JavaScript方法 达人详情");
                }
            });
            $dom.find("#userName").html(elem.userName);
            $dom.find("#userTitle").html(elem.userTitle);
            $dom.find("#fansNum").html(elem.fansNum+"人关注");
            if(elem.ifFavorite == 1){
                $dom.find("#ifFavorite0").hide();
                $dom.find("#ifFavorite1").show();
            }else {
                $dom.find("#ifFavorite1").hide();
                $dom.find("#ifFavorite0").show();
            }
            var imageList = elem.images;
            $dom.find('.imageList').empty();
            if(imageList && imageList.length > 0){
                imageList.forEach(function(userImage){
                    var $imageA =$('#user_image_a').clone().appendTo($dom.find('.imageList'));
                    $imageA.find("img").attr("src", userImage.smallImage);
                    $imageA.click(function(){
                        $imgZoomer.find('img').attr('src',userImage.middleImage);
                        $imgZoomer.fadeIn();
                    });
                });
            }
        });
    }
}


//初始化方法
function initData(jsonData){
    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
    if(data == null || data.status != 100){
        return;
    }
    console.log(data);
}
