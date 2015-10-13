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
        bridge.registerHandler('initClubList', function (data, responseCallback) {
            initClubList(data);
        });
        bridge.registerHandler('initActivityList', function (data, responseCallback) {
            initActivityList(data);
        });
    });
});
//初始化
function initJS(){
    var METHOD_URL = AJAX_URL+"getLabels.do";
    var CALL_BACK = "initRecommendLabel";
    var data = {
        type: 2,
        page: 1,
        size: 999
    };
    if(window.Android){
        Android.getData(METHOD_URL, GET, JSON.stringify(data), CALL_BACK);
    }else if(iOS){
        iOS.callHandler('getData',
            {url: METHOD_URL, method: GET, params: JSON.stringify(data), callBack: CALL_BACK},
            function (response) {});
    }else {
        console.error("Android iOS 没有实现getData接口！");
        $.ajax({
            type: GET,
            url: METHOD_URL,
            data: data,
            dataType : 'JSON',
            success: function(result){
                initRecommendLabel(result);
            },
            error:function(msg) { console.log(msg)}
        });
    }
}
//初始化 梦想项目
function initRecommendLabel(jsonData){
    jsonData = convertJSON(jsonData);
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

                if($(this.parentNode).hasClass("expended")){
                    this.parentNode.classList.toggle('expended');
                }
                getActivityListData(elem);
            });
            if(index == 0){
                $dom.addClass("active");
                getActivityListData(elem);
            }else if(index == 3){
                $('#label_more_a').clone().appendTo('#labelList');
            }
        });
    }
}
//获取 活动列表数据
function getActivityListData(jsonData){
    var params = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;

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

    METHOD_URL = AJAX_URL+"activityList.do";
    CALL_BACK = "initActivityList";
    data = {
        labelId: params.labelId,
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
                initActivityList(result);
            },
            error:function(msg) { console.log(msg)}
        });
    }
}
//初始化 俱乐部列表
function initClubList(jsonData){
    jsonData = convertJSON(jsonData);
    var params = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
    var dataList = params.list;
    $('#club_list_slider_content').empty();
    if(dataList && dataList.length > 0){
        $("#clubList").show();
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
            //$club.attr("onclick", "clickClubById('"+elem.clubId+"')");

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
    webViewData.rightButton = {
        title: "帐号信息",
        icon: 0,
        eventType: 0,
        url: BASE_URL+"club_info.html",
        params: data,
        rightButton: {}
    };

    if(window.Android){
        Android.loadURL(JSON.stringify(webViewData));
    }else if(iOS){
        iOS.callHandler('loadURL', JSON.stringify(webViewData), function (response) {});
    }else {
        console.error("APP未注册JavaScript方法，跳转地址："+webViewData.url);
    }
}
//初始化 活动列表
function initActivityList(jsonData){
    jsonData = convertJSON(jsonData);
    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
    var dataList = data.list;
    $("#activityContent").empty();
    if(dataList && dataList.length > 0){
        $("#activityList").show();
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
                webViewData.rightButton = {
                    title:"活动详情",
                    icon:1,
                    eventType:2,
                    url: ROOT_RUL,
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
    }else {
        $("#activityList").hide();
    }
}