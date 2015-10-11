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
        bridge.registerHandler('initUserInfo', function (data, responseCallback) {
            initUserInfo(data);
        });
        bridge.registerHandler('initDynamicImageList', function (data, responseCallback) {
            initDynamicImageList(data);
        });
        bridge.registerHandler('initAddFavoriteUser', function (data, responseCallback) {
            initAddFavoriteUser(data);
        });
        bridge.registerHandler('initDelFavoriteUser', function (data, responseCallback) {
            initDelFavoriteUser(data);
        });
        bridge.registerHandler('initFansList', function (data, responseCallback) {
            initFansList(data);
        });
        bridge.registerHandler('initActivityList', function (data, responseCallback) {
            initActivityList(data);
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
var params;
function initJS(){
    var METHOD_URL = AJAX_URL+"dynamicImageList.do";
    var CALL_BACK = "initDynamicImageList";
    var data = {};
    if(window.Android){
        params = Android.getParams();
        params = typeof params == 'string' ? JSON.parse(params) : params;
        data.userId = params.clubId;
        Android.getData(METHOD_URL, GET, JSON.stringify(data), CALL_BACK);
        METHOD_URL = AJAX_URL+"userInfo.do";
        CALL_BACK = "initUserInfo";
        Android.getData(METHOD_URL, GET, JSON.stringify(data), CALL_BACK);
    }else if(iOS){
        iOS.callHandler('getParams', {}, function (response) {
            params = response;
            params = typeof params == 'string' ? JSON.parse(params) : params;
            data.userId = params.clubId;
            iOS.callHandler('getData', {url: METHOD_URL, method: GET, params: JSON.stringify(data), callBack: CALL_BACK}, function (response) {});
            METHOD_URL = AJAX_URL+"userInfo.do";
            CALL_BACK = "initUserInfo";
            iOS.callHandler('getData', {url: METHOD_URL, method: GET, params: JSON.stringify(data), callBack: CALL_BACK}, function (response) {});
        });
    }else {
        console.error("Android iOS 没有实现getData接口！");
        //params = {
        //    "clubId": 7,
        //    "clubName": "丛老湿",
        //    "clubLogo": "http://182.92.243.56:8080/nbsc_image/images/avatar/7_1437496517075.jpg",
        //    "fansNum": 26
        //};
        //$.ajax({
        //    type: GET,
        //    url: AJAX_URL+"userInfo.do",
        //    data: {
        //        token: TOKEN,
        //        userId: params.clubId,
        //        version: "1.1.1"
        //    },
        //    dataType : 'JSON',
        //    success: function(result){
        //        initUserInfo(result);
        //    },
        //    error:function(msg) { console.log(msg)}
        //});
        //$.ajax({
        //    type: GET,
        //    url: AJAX_URL+"dynamicImageList.do",
        //    data: {
        //        token: TOKEN,
        //        userId: params.clubId,
        //        type: TYPE,
        //        version: "1.1.1"
        //    },
        //    dataType : 'JSON',
        //    success: function(result){
        //        initDynamicImageList(result);
        //    },
        //    error:function(msg) { console.log(msg)}
        //});
    }
}
//初始化 title
function initUserInfo(jsonData){
    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
    console.log("初始化Title：");
    console.log(data);
    var userData = data.user_info;

    $("#userinfo").find(".bg").css({
        'background-image': 'url('+userData.userIcon+')'
    });
    $("#userinfo").find("img").attr("src", userData.userIcon);
    $("#userinfo").find(".uname").html(userData.userName);
    $("#userinfo").find(".sign").html(userData.userDes);

    $("#album").find(".des").html(userData.photoNum);
    $("#fans").find(".des").html(userData.fansNum);
    $("#event").find(".des").html(userData.activityNum);

    if(data.ifFavorite == 1){
        $("#follow_on").removeClass("switch_hide");
        $("#follow_off").addClass("switch_hide");
    }else {
        $("#follow_on").addClass("switch_hide");
        $("#follow_off").removeClass("switch_hide");
    }

    $("#follow_off").on('click',function(){
        var METHOD_URL = AJAX_URL+"addFavoriteUser.do";
        var CALL_BACK = "initAddFavoriteUser";
        var params = {
            userIds: userData.userId
        };
        if(window.Android){
            Android.getData(METHOD_URL, GET, JSON.stringify(params), CALL_BACK);
        }else if(iOS){
            iOS.callHandler('getData', {url: METHOD_URL, method: GET, params: JSON.stringify(params), callBack: CALL_BACK}, function (response) {});
        }else{
            console.log("Android iOS 没有实现getData接口，HTML自己获取数据！");
        }
    })
    $("#follow_on").on('click',function(){
        var METHOD_URL = AJAX_URL+"delFavoriteUser.do";
        var CALL_BACK = "initDelFavoriteUser";
        var params = {
            userId: userData.userId
        };
        if(window.Android){
            Android.getData(METHOD_URL, GET, JSON.stringify(params), CALL_BACK);
        }else if(iOS){
            iOS.callHandler('getData', {url: METHOD_URL, method: GET, params: JSON.stringify(params), callBack: CALL_BACK}, function (response) {});
        }else{
            console.log("Android iOS 没有实现getData接口，HTML自己获取数据！");
        }
    })

    $("#album").click(function(){
        $(".box_mid").addClass("hide");
        $(".box_right").addClass("hide");
        $(".box_left").removeClass("hide");
        $("#album").addClass("current").siblings().removeClass("current");;
        if(!dynamicImageList){
            var METHOD_URL = AJAX_URL+"dynamicImageList.do";
            var CALL_BACK = "initDynamicImageList";
            var data = {};
            data.userId = params.clubId;
            if(window.Android){
                Android.getData(METHOD_URL, GET, JSON.stringify(data), CALL_BACK);
            }else if(iOS){
                iOS.callHandler('getData', {url: METHOD_URL, method: GET, params: JSON.stringify(data), callBack: CALL_BACK}, function (response) {});
            }
        }
    });
    $("#fans").click(function(){
        $(".box_left").addClass("hide");
        $(".box_right").addClass("hide");
        $(".box_mid").removeClass("hide");
        $("#fans").addClass("current").siblings().removeClass("current");
        if(!fansList){
            var METHOD_URL = AJAX_URL+"fansList.do";
            var CALL_BACK = "initFansList";
            var data = {};
            data.userId = params.clubId;
            if(window.Android){
                Android.getData(METHOD_URL, GET, JSON.stringify(data), CALL_BACK);
            }else if(iOS){
                iOS.callHandler('getData', {url: METHOD_URL, method: GET, params: JSON.stringify(data), callBack: CALL_BACK}, function (response) {});
            }
        }
    });
    $("#event").click(function(){
        $(".box_mid").addClass("hide");
        $(".box_left").addClass("hide");
        $(".box_right").removeClass("hide");
        $("#event").addClass("current").siblings().removeClass("current");
        if(!activityList){
            var METHOD_URL = AJAX_URL+"activityList.do";
            var CALL_BACK = "initActivityList";
            var data = {
                page: 1,
                size: 9999
            };
            data.clubId = params.clubId;
            //data.clubId = 3;
            if(window.Android){
                Android.getData(METHOD_URL, GET, JSON.stringify(data), CALL_BACK);
            }else if(iOS){
                iOS.callHandler('getData', {url: METHOD_URL, method: GET, params: JSON.stringify(data), callBack: CALL_BACK}, function (response) {});
            }
        }
    });

}
//初始化 用户相册列表
var dynamicImageList;
function initDynamicImageList(jsonData){
    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
    console.log("初始化相册：");
    console.log(data);
    var dataList = data.list;
    dynamicImageList = dataList;
    $('#box_left').empty();
    if(dataList && dataList.length > 0){
        dataList.forEach(function(elem){
            var imageList = elem.images;
            imageList.forEach(function(images){
                $album = $("#album_a").clone().appendTo("#box_left");
                $album.find("img").attr("src", images.smallImage);
                $album.click(function(){
                    var appData = {};
                    appData.data = images;
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
        });
    }
}
//初始化 添加关注用户
function initAddFavoriteUser(jsonData){
    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
    if(data.status == 100){
        console.log("添加关注成功！");
        $("#follow_on").removeClass("switch_hide");
        $("#follow_off").addClass("switch_hide");
    }else {
        console.error("添加关注失败！");
    }
}
//初始化 取消关注用户
function initDelFavoriteUser(jsonData){
    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
    if(data.status == 100){
        console.log("删除关注成功！");
        $("#follow_on").addClass("switch_hide");
        $("#follow_off").removeClass("switch_hide");
    }else {
        console.error("删除关注失败！");
    }
}
//初始化 粉丝
var fansList;
function initFansList(jsonData){
    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
    console.log("初始化粉丝：");
    console.log(data);
    var dataList = data.list;
    fansList = dataList;
    $('#box_mid').empty();
    if(dataList && dataList.length > 0) {
        dataList.forEach(function (elem) {
            $fans = $("#fans_div").clone().appendTo("#box_mid");
            $fans.find(".uname").html(elem.userName);
            $fans.find("#title").html(elem.userTitle);
            $fans.find("#des").html(elem.userDes);

            if(elem.ifFavorite == 1){
                $fans.find("#ifFavorite0").hide();
                $fans.find("#ifFavorite1").show();
            }else {
                $fans.find("#ifFavorite1").hide();
                $fans.find("#ifFavorite0").show();
            }
            $fans.find("#ifFavorite0").click(function(){
                $(this).hide();
                $(this).siblings().show();
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
                }
            });
            $fans.find("#ifFavorite1").click(function(){
                $(this).hide();
                $(this).siblings().show();
                elem.ifFavorite = 0;
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
                }
            });
            $fans.find("img").attr("src", elem.userIcon).click(function(){
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

        });
    }
}
//初始化 活动
var activityList;
function initActivityList(jsonData){
    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
    console.log("初始化活动：");
    console.log(data);
    var dataList = data.list;
    activityList = dataList;
    $('#box_right').empty();
    if(dataList && dataList.length > 0) {
        dataList.forEach(function (elem) {
            $activity = $("#activity_a").clone().appendTo("#box_right");
            $activity.find(".bg").css({
                'background-image': 'url('+elem.activityLogo+')'
            });
            $activity.find(".title").html(elem.activityName);
            $activity.find(".fense").html(elem.activityPrice);
            $activity.find(".tip").html("");
            $activity.click(function(){
                var params = elem;
                var webViewData = {};
                //标题名
                webViewData.title = "活动详情";
                //WebView跳转的地址
                webViewData.url = BASE_URL+"activity.html";
                //页面获取数据时使用的参数
                webViewData.params = params;
                //右侧按钮对象
                webViewData.rightButton = {
                    title:"活动详情",
                    icon:1,
                    eventType:2,
                    url:ROOT_RUL,
                    content: params.activityName,
                    logo:params.activityLogo
                };
                if(window.Android){
                    Android.loadURL(JSON.stringify(webViewData));
                }else if(iOS){
                    iOS.callHandler('loadURL', JSON.stringify(webViewData), function (response) {});
                }else {
                    console.error("APP未注册JavaScript方法，跳转地址："+webViewData.url);
                }
            });
        });
    }
}

