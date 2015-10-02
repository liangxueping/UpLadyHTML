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
        bridge.registerHandler('initActivityDetail', function (data, responseCallback) {
            initActivityDetail(data);
        });
    });
});
//初始化
var params;
var isComplate;
function initJS(){
    if(isComplate){
        return;
    }
    isComplate = true;
    var METHOD_URL = AJAX_URL+"activityDetail.do";
    var CALL_BACK = "initActivityDetail";
    var data = {};
    if(window.Android){
        params = Android.getParams();
        params = typeof params == 'string' ? JSON.parse(params) : params;
        data.activityId = params.activityId;
        Android.getData(METHOD_URL, GET, JSON.stringify(data), CALL_BACK);
    }else if(iOS){
        iOS.callHandler('getParams', {}, function (response) {
            params = response;
            params = typeof params == 'string' ? JSON.parse(params) : params;
            data.activityId = params.activityId;
            iOS.callHandler('getData', {url: METHOD_URL, method: GET, params: JSON.stringify(data), callBack: CALL_BACK}, function (response) {});
        });
    }else {
        console.error("Android iOS 没有实现getData接口！");
        //params = {
        //    "activityId": 1
        //};
        //$.ajax({
        //    type: GET,
        //    url: METHOD_URL,
        //    data: {
        //        token: TOKEN,
        //        activityId: params.activityId,
        //        version: "1.1.1"
        //    },
        //    dataType : 'JSON',
        //    success: function(result){
        //        initActivityDetail(result);
        //    },
        //    error:function(msg) { console.log(msg)}
        //});
    }
}
//初始化页面
var activityDetail;
function initActivityDetail(jsonData){
    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
    activityDetail = data.activity;
    console.log(activityDetail);
    $("#activity_title").find(".bg").css({
        'background-image': 'url('+activityDetail.clubLogo+')'
    });
    $("#activity_title").find(".title").html(activityDetail.clubName);
    $("#activity_title").find(".title").html(activityDetail.clubDes);
    $("#activity_title").click(function(){
        var webViewData = {};
        //标题名
        webViewData.title = activityDetail.clubName+"的主页";
        //WebView跳转的地址
        webViewData.url = BASE_URL+"club.html";
        //页面获取数据时使用的参数
        webViewData.params = activityDetail;
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

    $("#activityFeature").html(activityDetail.activityFeature);
    $("#activityDes").html(activityDetail.activityDes);
    var coachList = activityDetail.coachList;
    $("#coachList").empty();
    if(coachList && coachList.length > 0){
        coachList.forEach(function(elem, index){
            var $coach = $('#coach_a').clone().appendTo("#coachList");
            $coach.find("img").attr("src", elem.coachIcon);
            $coach.find(".title").html(elem.coachName);
            $coach.click(function(){
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

    $(".activity_detail_time").html("活动时间："+activityDetail.beginDate + "&nbsp;" + activityDetail.endDate);
    $(".activeFense").html('<span class="fense">'+activityDetail.activityPrice+'</span>');
    var priceInclude = activityDetail.priceInclude;
    if(priceInclude && priceInclude.length > 0){
        priceInclude.forEach(function(elem, index){
            $('<p>'+elem.priceContent+'</p>').appendTo($("#priceInclude"));
        });
    }else {
        $("#priceInclude").hide();
    }
    var priceNoInclude = activityDetail.priceNoInclude;
    if(priceNoInclude && priceNoInclude.length > 0){
        priceNoInclude.forEach(function(elem, index){
            $('<p>'+elem.priceContent+'</p>').appendTo($("#priceNoInclude"));
        });
    }else {
        $("#priceNoInclude").hide();
    }
    $("#activityContent").html(activityDetail.activityContent);
    //活动小提示
    var activityTip = activityDetail.activityTip;
    if(activityTip && activityTip.length > 0){
        activityTip.forEach(function(elem, index){
            $('<p>'+elem.tipContent+'</p>').appendTo($("#activityTip"));
        });
    }else {
        $("#activityTip").hide();
    }
    //活动注意事项
    var acctivityAttention = activityDetail.acctivityAttention;
    if(acctivityAttention && acctivityAttention.length > 0){
        acctivityAttention.forEach(function(elem, index){
            $('<p>'+elem.attentionContent+'</p>').appendTo($("#acctivityAttention"));
        });
    }else {
        $("#acctivityAttention").hide();
    }
    //装备
    var equipmentList = activityDetail.equipmentList;
    if(equipmentList && equipmentList.length > 0){
        equipmentList.forEach(function(elem, index){
            var $dom = $('#equipment_div').clone().appendTo($("#equipmentList"));
            $dom.find("img").attr("src", elem.equipmentLogo);
            $dom.find(".h4").html(elem.equipmentName);
            $dom.find("p").html(elem.equipmentDes);
        });
    }else {
        $("#equipmentList").hide();
    }
    //衣物
    var clothesList = activityDetail.clothesList;
    if(clothesList && clothesList.length > 0){
        clothesList.forEach(function(elem, index){
            var $dom = $('#clothes_div').clone().appendTo($("#clothesList"));
            $dom.find("img").attr("src", elem.clothesLogo);
            $dom.find(".h4").html(elem.clothesName);
            $dom.find("p").html(elem.clothesDes);
        });
    }else {
        $("#clothesList").hide();
    }

    //打电话
    $("#activityPhone").click(function(){
        if(window.Android){
            Android.callPhone(activityDetail.activityPhone);
        }else if(iOS){
            iOS.callHandler('callPhone', activityDetail.activityPhone, function (response) {});
        }else {
            console.error("APP未注册JavaScript方法，callPhone");
        }
    });
}
