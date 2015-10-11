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
        bridge.registerHandler('initRecommendLabel', function (data, responseCallback) {
            initRecommendLabel(data);
        });
        bridge.registerHandler('initUserList', function (data, responseCallback) {
            initUserList(data);
        });
        bridge.registerHandler('addFavoriteUser', function (data, responseCallback) {
            addFavoriteUser(data);
        });
        bridge.registerHandler('delFavoriteUser', function (data, responseCallback) {
            delFavoriteUser(data);
        });
    });
});
//初始化
function initJS(){
    getRecommendLabel();
}

function getRecommendLabel(){
    var METHOD_URL = AJAX_URL+"recommendLabel.do";
    var CALL_BACK = "initRecommendLabel";
    var data = {
        page: 1,
        size: SIZE
    };
    if(window.Android){
        Android.getData(METHOD_URL, GET, JSON.stringify(data), CALL_BACK);
    }else if(iOS){
        iOS.callHandler('getData',
            {url: METHOD_URL, method: GET, params: JSON.stringify(data), callBack: CALL_BACK},
            function (response) {});
    }else {
        console.error("Android iOS 没有实现getData接口！");
    }
}
//初始化 梦想项目
function initRecommendLabel(jsonData){
    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
    var dataList = data.list;
    $('#labelList').empty();
    if(dataList && dataList.length > 0){
        dataList.forEach(function(elem, index){
            var $dom =$('#label_a').clone().appendTo('#labelList');
            $dom.find(".h4").html(elem.labelTitle);
            $dom.click(function(){
                $dom.siblings().removeClass("active");
                $dom.addClass("active");
                currentType = elem;
                getUserListData();
            });
            if(index == 0){
                $dom.addClass("active");
                currentType = elem;
                getUserListData();
            }else if(index == 3){
                $('#label_more_a').clone().appendTo('#labelList');
            }
        });
    }
}
//初始化 达人列表
var currentType;
function getUserListData(){
    var data = typeof currentType == 'string' ? JSON.parse(currentType) : currentType;
    var METHOD_URL = AJAX_URL+"recommendUser.do";
    var CALL_BACK = "initUserList";
    var data = {
        labelId: data.labelId,
        page: 1,
        size: 999
    };
    if(window.Android){
        Android.getData(METHOD_URL, GET, JSON.stringify(data), CALL_BACK);
    }else if(iOS){
        iOS.callHandler('getData', {url: METHOD_URL, method: GET, params: JSON.stringify(data), callBack: CALL_BACK}, function (response) {});
    }
}

//初始化 达人列表
var dataUserList;
function initUserList(jsonData){
    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
    dataUserList = data;
    var dataList = data.list;
    $('#userList').empty();
    if(dataList && dataList.length > 0){
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
            $dom.find("#ifFavorite0").click(function(){
                var params = {};
                params.userIds = elem.userId;
                params.version = VERSION;
                var METHOD_URL = AJAX_URL+"addFavoriteUser.do";
                var CALL_BACK = "addFavoriteUser";
                if(window.Android){
                    Android.getData(METHOD_URL, GET, JSON.stringify(params), CALL_BACK);
                }else if(iOS){
                    iOS.callHandler('getData', {
                        url: METHOD_URL,
                        method: GET,
                        params: JSON.stringify(params),
                        callBack: CALL_BACK
                    }, function (response) {

                    });
                }
                window.addFavoriteUser = function(jsonData){
                    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
                    console.log(data);
                    if(data.status == 100){
                        $dom.find("#ifFavorite0").hide();
                        $dom.find("#ifFavorite1").show();
                    }else {
                        alert(data.message);
                    }
                }
            });
            $dom.find("#ifFavorite1").click(function(){
                var params = {};
                params.userId = elem.userId;
                params.version = VERSION;
                var METHOD_URL = AJAX_URL+"delFavoriteUser.do";
                var CALL_BACK = "delFavoriteUser";
                if(window.Android){
                    Android.getData(METHOD_URL, GET, JSON.stringify(params), CALL_BACK);
                }else if(iOS){
                    iOS.callHandler('getData', {
                        url: METHOD_URL,
                        method: GET,
                        params: JSON.stringify(params),
                        callBack: CALL_BACK
                    }, function (response) {

                    });
                }
                window.delFavoriteUser = function(jsonData){
                    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
                    console.log(data);
                    if(data.status == 100){
                        $dom.find("#ifFavorite1").hide();
                        $dom.find("#ifFavorite0").show();
                    }else {
                        alert(data.message);
                    }
                }
            });
            var imageList = elem.images;
            $dom.find('.imageList').empty();
            if(imageList && imageList.length > 0){
                imageList.forEach(function(userImage){
                    var $imageA =$('#user_image_a').clone().appendTo($dom.find('.imageList'));
                    $imageA.find("img").attr("src", userImage.smallImage);
                    $imageA.click(function(){
                        var appData = {};
                        appData.data = userImage;
                        if(window.Android){
                            appData.method = "com.uplady.teamspace.home.DynamicDetailAcitity";
                            Android.openWindow(JSON.stringify(appData));
                        }else if(iOS){
                            appData.method = "NBDynamicDetailsViewController";
                            iOS.callHandler('openWindow', JSON.stringify(appData), function (response) {});
                        }else {
                            console.error("APP未注册JavaScript方法 openWindow");
                        }
                    });
                });
            }
        });
    }
}