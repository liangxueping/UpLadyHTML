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
    $imgZoomer = $('<div>').css({
        'position': 'absolute',
        'top': '0',
        'left': '0',
        'width': '100%',
        'height': '100%',
        'background': 'rgba(0,0,0,0.5)',
        'display': 'none',
        'z-index':999
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
        getUserListData(params);
    }else if(iOS){
        iOS.callHandler('getParams', {}, function (response) {
            params = response;
            params = typeof params == 'string' ? JSON.parse(params) : params;
            var data = {
                labelId: params.labelId,
                ifSubject: 1,
                type: TYPE
            };
            getUserListData(params);
            iOS.callHandler('getData', {url: METHOD_URL, method: GET, params: JSON.stringify(data), callBack: CALL_BACK}, function (response) {});
        });
    }else{
        console.log("Android iOS 没有实现接口，HTML自己获取数据！");
        //params = {
        //    "labelId": 3,
        //    "labelTitle": "攀岩",
        //    "labelImg": "http://www.uplady.cn:8080/nbsc_image/images/label/5/1436085778801.jpg",
        //    "labelBgImg": "http://www.uplady.cn:8080/nbsc_image/images/label/5/1436085778801.jpg",
        //    "labelDes": "攀岩标签",
        //    "fansNum": 11,
        //    "ifFavorite": false
        //};
        //$.ajax({
        //    type: GET,
        //    url: AJAX_URL+"labelDetail.do",
        //    data: {
        //        token: TOKEN,
        //        labelId: params.labelId,
        //        ifSubject: 1,
        //        type: TYPE,
        //        version: "1.1.1"
        //    },
        //    dataType : 'JSON',
        //    success: function(result){
        //        console.log(result);
        //        initLabelDetail(result);
        //    },
        //    error:function(msg) { console.log(msg)}
        //});
        //getUserListData(params);
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
        //$.ajax({
        //    type: GET,
        //    url: AJAX_URL+"recommendUser.do",
        //    data: {
        //        token: TOKEN,
        //        labelId: params.labelId,
        //        page: 1,
        //        size: 999,
        //        version: "1.1.1"
        //    },
        //    dataType : 'JSON',
        //    success: function(result){
        //        console.log("获取达人数据：");
        //        console.log(result);
        //        initUserList(result);
        //    },
        //    error:function(msg) { console.log(msg)}
        //});
    }
}
//获取 活动列表数据
function getActivityListData(){
    $("#userList").fadeOut();
    $("#clubList").fadeIn();
    $("#activityList").fadeIn();
    if(dataActivityList){
        initActivityList(dataActivityList);
    }else {
        var METHOD_URL = AJAX_URL+"activityList.do";
        var CALL_BACK = "initActivityList";
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
        //$.ajax({
        //    type: GET,
        //    url: AJAX_URL+"activityList.do",
        //    data: {
        //        token: TOKEN,
        //        labelId: params.labelId,
        //        page: 1,
        //        size: 999,
        //        version: "1.1.1"
        //    },
        //    dataType : 'JSON',
        //    success: function(result){
        //        console.log("获取活动数据：");
        //        console.log(result);
        //        initActivityList(result);
        //    },
        //    error:function(msg) { console.log(msg)}
        //});
    }
    if(dataClubList){
        initClubList(dataClubList);
    }else {
        var METHOD_URL = AJAX_URL+"clubList.do";
        var CALL_BACK = "initClubList";
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
        //$.ajax({
        //    type: GET,
        //    url: AJAX_URL+"clubList.do",
        //    data: {
        //        token: TOKEN,
        //        labelId: params.labelId,
        //        page: 1,
        //        size: 999,
        //        version: "1.1.1"
        //    },
        //    dataType : 'JSON',
        //    success: function(result){
        //        console.log("获取俱乐部数据：");
        //        console.log(result);
        //        initClubList(result);
        //    },
        //    error:function(msg) { console.log(msg)}
        //});
    }
}

//初始化 标题头
function initLabelDetail(jsonData){
    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;

    $("#what_user_a").click(function (){
        if(!$("#what_user_a").hasClass("active")){
            $("#what_activity_a").removeClass("active");
            $("#what_user_a").addClass("active");
            getUserListData();
        }
    });
    $("#what_activity_a").click(function (){
        if(!$("#what_activity_a").hasClass("active")){
            $("#what_user_a").removeClass("active");
            $("#what_activity_a").addClass("active");
            getActivityListData();
        }
    });

    if(!data.labelDetail){
        return;
    }
    console.log("获取梦想标签：");
    console.log(data);
    $("#labelTitle").html(data.labelDetail.labelTitle);
    $("#labelDes").html(data.labelDetail.labelDes);
    $("#userNum").html(data.labelDetail.userNum);
    $("#activityNum").html(data.labelDetail.activityNum);
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

        var METHOD_URL;
        var CALL_BACK = "initDreaming";
        if(labelDetail.ifDream != 1){
            METHOD_URL = AJAX_URL+"dreamAdd.do";
        }else {
            return;
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
                        $imgZoomer.find('img').attr('src',userImage.middleImage);
                        $imgZoomer.fadeIn();
                    });
                });
            }
        });
    }
}
//初始化 活动列表
var dataActivityList;
function initActivityList(jsonData){
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
    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
    dataClubList = data;
    var dataList = data.list;
    if(dataList && dataList.length > 0){
        var data = [];
        var $div = $('<div id="tempDiv"></div>');
        //dataList = dataList.concat(dataList);
        //dataList = dataList.concat(dataList);
        dataList.forEach(function(elem, index){
            if(index % 6 == 0){
                $div.empty();
                $div.append($('<div class="club_list cfix"></div>'));
            }
            var $club = $('#club_a').clone().appendTo($div.find(".club_list"));
            $club.find("img").attr("src", elem.clubLogo);
            $club.find(".uname").html(elem.clubName);
            $club.find(".popular").html(elem.fansNum+"人关注");
            $club.attr("onclick", "clickClub('"+JSON.stringify(elem)+"')");

            if((index+1) % 6 == 0 || index == dataList.length - 1){
                data.push({
                    content: $div.clone().html()
                });
            }
        });
        $div.remove();
        if(dataList.length > 3){
            $(".club_list_slider").find(".slider").css({
                height: "266px"
            });
        }
        var html = '';
        for (var i = 0; i < data.length; i++) {
            html += '<i' + (i == 0 ? ' class="current"' : '') + '>' + (i + 1) + '</i>';
        }
        $('#club_list_slider_pages').html(html);
        if (data.length === 1) {
            $('#club_list_slider_pages').hide();
        }
        $('#club_list_slider_content').html("");
        // api: http://be-fe.github.io/iSlider/index.html
        var islider = new iSlider({
            dom: $('#club_list_slider_content')[0],
            data: data,
            type: 'dom',
            isLooping: true,
            isAutoplay: true,
            duration: 3000,
            onslidechange: function(current) {
                $('#club_list_slider_pages').find('i').removeClass('current');
                $($('#club_list_slider_pages').find('i').get(current)).addClass('current');
            }
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