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
        bridge.registerHandler('initLabelDetail', function (data, responseCallback) {
            initLabelDetail(data);
        });
        bridge.registerHandler('initUserList', function (data, responseCallback) {
            initUserList(data);
        });
        bridge.registerHandler('initActivityList', function (data, responseCallback) {
            initActivityList(data);
        });
        bridge.registerHandler('initClubList', function (data, responseCallback) {
            initClubList(data);
        });
        bridge.registerHandler('initDreaming', function (data, responseCallback) {
            initDreaming(data);
        });
        bridge.registerHandler('addFavoriteUser', function (data, responseCallback) {
            addFavoriteUser(data);
        });
        bridge.registerHandler('delFavoriteUser', function (data, responseCallback) {
            delFavoriteUser(data);
        });


    });
});
//App 通知 HTML 初始化的方法
var params;
function initJS(){
    var METHOD_URL = AJAX_URL+"labelDetail.do";
    var CALL_BACK = "initLabelDetail";
    if(window.Android){
        params = Android.getParams();
        params = typeof params == 'string' ? JSON.parse(params) : params;
        var data = {
            labelId: params.labelId,
            ifSubject: 1,
            type: TYPE
        };
        Android.getData(METHOD_URL, GET, JSON.stringify(data), CALL_BACK);
        getClubListData(params);
    }else if(iOS){
        iOS.callHandler('getParams', {}, function (response) {
            params = response;
            params = typeof params == 'string' ? JSON.parse(params) : params;
            var data = {
                labelId: params.labelId,
                ifSubject: 1,
                type: TYPE
            };
            getClubListData(params);
            iOS.callHandler('getData', {url: METHOD_URL, method: GET, params: JSON.stringify(data), callBack: CALL_BACK}, function (response) {});
        });
    }else{
        console.log("Android iOS 没有实现接口，HTML自己获取数据！");
        params = {
            "labelId": 4,
            "labelTitle": "攀岩",
            "labelImg": "http://www.uplady.cn:8080/nbsc_image/images/label/5/1436085778801.jpg",
            "labelBgImg": "http://www.uplady.cn:8080/nbsc_image/images/label/5/1436085778801.jpg",
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
                type: TYPE,
                version: "1.1.1"
            },
            dataType : 'JSON',
            success: function(result){
                console.log(result);
                initLabelDetail(result);
            },
            error:function(msg) { console.log(msg)}
        });
        getClubListData(params);
    }
    $("#what_club_a").click(function (){
        if(!$("#what_club_a").hasClass("active")){
            $("#what_user_a").removeClass("active");
            $("#what_activity_a").removeClass("active");
            $("#what_club_a").addClass("active");
            getClubListData();
        }
    });
    $("#what_user_a").click(function (){
        if(!$("#what_user_a").hasClass("active")){
            $("#what_club_a").removeClass("active");
            $("#what_activity_a").removeClass("active");
            $("#what_user_a").addClass("active");
            getUserListData();
        }
    });
    $("#what_activity_a").click(function (){
        if(!$("#what_activity_a").hasClass("active")){
            $("#what_club_a").removeClass("active");
            $("#what_user_a").removeClass("active");
            $("#what_activity_a").addClass("active");
            getActivityListData();
        }
    });
}
//获取 俱乐部列表数据
function getClubListData(){
    $("#userList").fadeOut();
    $("#activityList").fadeOut();
    $("#clubList").fadeIn();
    if(dataClubList){
        initClubList(dataClubList);
    }else {
        var METHOD_URL = AJAX_URL+"clubList.do";
        var CALL_BACK = "initClubList";
        var data = {
            labelId: 3,
            page: 1,
            size: 999
        };
        if(window.Android){
            Android.getData(METHOD_URL, GET, JSON.stringify(data), CALL_BACK);
        }else if(iOS){
            iOS.callHandler('getData', {url: METHOD_URL, method: GET, params: JSON.stringify(data), callBack: CALL_BACK}, function (response) {});
        }else {
            $.ajax({
                type: GET,
                url: METHOD_URL,
                data: data,
                dataType : 'JSON',
                success: function(result){
                    initClubList(result);
                },
                error:function(msg) { console.log(msg)}
            });
        }
    }
}
//获取 达人列表数据
function getUserListData(){
    $("#clubList").fadeOut();
    $("#activityList").fadeOut();
    $("#userList").fadeIn();
    if(dataUserList){
        initUserList(dataUserList);
    }else {
        var METHOD_URL = AJAX_URL+"recommendUser.do";
        var CALL_BACK = "initUserList";
        var data = {
            labelId: params.labelId,
            page: 1,
            size: 999
        };
        if(window.Android){
            Android.getData(METHOD_URL, GET, JSON.stringify(data), CALL_BACK);
        }else if(iOS){
            iOS.callHandler('getData', {url: METHOD_URL, method: GET, params: JSON.stringify(data), callBack: CALL_BACK}, function (response) {});
        }
    }
}
//获取 活动列表数据
var queryAllActivityList = false;
function getActivityListData(){
    $("#userList").fadeOut();
    $("#clubList").fadeOut();
    $("#activityList").fadeIn();
    if(dataActivityList){
        initActivityList(dataActivityList);
    }else {
        var METHOD_URL = AJAX_URL+"activityList.do";
        var CALL_BACK = "initActivityList";
        var data = {
            page: 1,
            size: 999
        };
        if(!queryAllActivityList){
            data.labelId = params.labelId;
        }
        if(window.Android){
            Android.getData(METHOD_URL, GET, JSON.stringify(data), CALL_BACK);
        }else if(iOS){
            iOS.callHandler('getData', {url: METHOD_URL, method: GET, params: JSON.stringify(data), callBack: CALL_BACK}, function (response) {});
        }else {
            $.ajax({
                type: GET,
                url: METHOD_URL,
                data: data,
                dataType : 'JSON',
                success: function(result){
                    initActivityList(result);
                },
                error:function(msg) { console.log(msg)}
            });
        }
    }
}

//初始化 标题头
function initLabelDetail(jsonData){
    jsonData = convertJSON(jsonData);
    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;

    if(!data.labelDetail){
        return;
    }
    console.log("获取梦想标签：");
    console.log(data);

    $("#labelBackground").css({
        "background-image": 'url('+data.labelDetail.labelBgImg+')'
    });
    $("#labelTitle").html(data.labelDetail.labelTitle);
    $("#labelDes").html(data.labelDetail.labelDes);
    $("#userNum").html(data.labelDetail.userNum);
    if(!data.labelDetail.activityNum || data.labelDetail.activityNum == 0){
        queryAllActivityList = true;
        $("#what_activity_a").find(".h4").html("推荐活动");
        $("#activityNum").html(" ");
    }else {
        queryAllActivityList = false;
        $("#what_activity_a").find(".h4").html("活动");
        $("#activityNum").html(data.labelDetail.activityNum);
    }
    labelDetail = data.labelDetail;
    if(labelDetail.ifDream == 1){
        $(".dreaming").addClass("active");
        $(".dreaming").html('<i class="i iA iA_pass iA_black"></i>已添加');
    }else {
        $(".dreaming").removeClass("active");
        $(".dreaming").html('<i class="i iC iC_small iC_white"></i>添加梦想');
    }
    $(".dreaming").click(function (){
        var params = {
            labelId: labelDetail.labelId
        };

        var METHOD_URL = AJAX_URL+"dreamAdd.do";
        var CALL_BACK = "initDreaming";
        if(labelDetail.ifDream != 1){
            params.type = 1;
        }else {
            params.type = 0;
        }
        if(window.Android){
            Android.getData(METHOD_URL, GET, JSON.stringify(params), CALL_BACK);
        }else if(iOS){
            iOS.callHandler('getData', {url: METHOD_URL, method: GET, params: JSON.stringify(params), callBack: CALL_BACK}, function (response) {});
        }else{
            console.log("Android iOS 没有实现getData接口，HTML自己获取数据！");
        }
    });
}
//初始化 添加梦想
var labelDetail;
function initDreaming(jsonData){
    jsonData = convertJSON(jsonData);
    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;

    if(data.status == 100){
        if(labelDetail.ifDream == 0){
            $(".dreaming").addClass("active");
            $(".dreaming").html('<i class="i iA iA_pass iA_black"></i>已添加');
            labelDetail.ifDream = 1;
        }else {
            $(".dreaming").removeClass("active");
            $(".dreaming").html('<i class="i iC iC_small iC_white"></i>添加梦想');
            labelDetail.ifDream = 0;
        }
    }
}
//初始化 达人列表
var dataUserList;
function initUserList(jsonData){
    jsonData = convertJSON(jsonData);
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
                    jsonData = convertJSON(jsonData);
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
                    jsonData = convertJSON(jsonData);
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
                    var bigImageSize = userImage.bigImageSize;
                    if(!bigImageSize){
                        $imageA.remove();
                        return;
                    }
                    var w = Number(bigImageSize.split("*")[0]);
                    var h = Number(bigImageSize.split("*")[1]);
                    var wCss = 0;
                    var hCss = 0;
                    if(w < h){
                        wCss = 100;
                        hCss = h/w*100;
                    }else {
                        hCss = 100;
                        wCss = w/h*100;
                    }
                    var divW = $imageA.find(".img").width();
                    $imageA.find(".img").css({
                        "height": divW+"px",
                        "background-image": 'url('+userImage.smallImage+')',
                        "background-size": wCss+"% "+hCss+"%"
                    });
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
//初始化 活动列表
var dataActivityList;
function initActivityList(jsonData){
    jsonData = convertJSON(jsonData);
    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
    dataActivityList = data;
    var dataList = data.list;
    $("#activityContent").empty();
    if(dataList && dataList.length > 0){
        dataList.forEach(function(elem){
            console.log("活动：");
            console.log(elem);
            var $activity = $("#activity").clone().appendTo("#activityContent");
            var $club = $activity.find("img").attr("src", elem.clubLogo);
            $activity.find(".uname").html(elem.clubName);

            $activity.find(".title").html(elem.activityName);
            $activity.find(".fense").html(elem.activityPrice);
            //$activity.find(".tip").html(elem.clubName);
            $activity.find(".bg").css({
                "background-image": 'url('+elem.activityLogo+')'
            });
            $activity.find(".club_owner").click(function(event){
                clickClub(elem);
            });
            $activity.find(".activity_brand").click(function(){
                var params = elem;
                var webViewData = {};
                //标题名
                webViewData.title = "活动详情";
                //WebView跳转的地址
                webViewData.url = BASE_URL+"activity.html";
                //页面获取数据时使用的参数
                webViewData.params = params;
                //右侧按钮对象
                webViewData.rightButton = {};
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
//初始化 俱乐部列表
var dataClubList;
function initClubList(jsonData){
    jsonData = convertJSON(jsonData);
    var params = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
    dataClubList = params;
    var dataList = params.list;
    $("#clubListContent").empty();
    $("#clubNum").html(dataList.length);
    if(dataList && dataList.length > 0){
        $("#clubNum").html(dataList.length);
        $("#clubList").show();
        dataList.forEach(function(elem){
            var $club = $("#club_a").clone().appendTo("#clubListContent");
            $club.find("img").attr("src", elem.clubLogo);
            $club.find(".uname").html(elem.clubName);
            $club.find(".popular").html(elem.fansNum+"人关注");
            $club.click(function(event){
                clickClub(elem);
            });
        });
    }else {
        $("#clubList").hide();
    }
}
//点击俱乐部头像
function clickClub(jsonData){
    var data = jsonData = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
    var webViewData = {};
    //标题名
    webViewData.title = data.clubName+"的主页";
    //WebView跳转的地址
    webViewData.url = BASE_URL+"club.html";
    //页面获取数据时使用的参数
    webViewData.params = data;
    //右侧按钮对象
    webViewData.rightButton = {};

    if(window.Android){
        Android.loadURL(JSON.stringify(webViewData));
    }else if(iOS){
        iOS.callHandler('loadURL', JSON.stringify(webViewData), function (response) {});
    }else {
        console.error("APP未注册JavaScript方法，跳转地址："+webViewData.url);
    }
}