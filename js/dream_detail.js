/**
 * Created by liang on 2015/9/27.
 */
document.write("<script src='js/config.js'></script>");
var code;
var access_token;
var openid;
var wxUserInfo;
$(document).ready(function(){
    if(wxUserInfo){
        return;
    }
    var userId = getUrlParam("userId");
    code = getUrlParam("code");
    if(code){
        getAccessToken();
    }
    //获取梦想活动列表
    $.ajax({
        type: GET,
        url: AJAX_URL+"dreamList.do",
        data: {
            userId: userId,
            page: 1,
            size: 999
        },
        dataType : 'JSON',
        success: function(result){
            initDreamList(result);
        },
        error:function(msg) { console.log(msg)}
    });
    //获取梦想助力列表
    $.ajax({
        type: GET,
        url: AJAX_URL+"dreamHelpList.do",
        data: {
            userId: userId,
            page: 1,
            size: 999
        },
        dataType : 'JSON',
        success: function(result){
            initHelpers(result);
        },
        error:function(msg) { console.log(msg)}
    });
    //获取梦想助力统计信息
    $.ajax({
        type: GET,
        url: AJAX_URL+"dreamHelpTotal.do",
        data: {
            userId: userId
        },
        dataType : 'JSON',
        success: function(result){
            initDreamHelpTotal(result);
        },
        error:function(msg) { console.log(msg)}
    });
});
//获取微信认证权限access_token
function getAccessToken(){
    var params = "";
    params += "appid="+appid;
    params += "&secret="+secret;
    params += "&code="+code;
    params += "&grant_type="+grant_type;

    $.ajax({
        type: POST,
        url: AJAX_URL+"doPostWx.do?callback=?",
        data: {
            url: WX_URL+METHOD_ACCESS_TOKEN,
            params: params
        },
        dataType : 'JSONP',
        success: function(result){
            getUserInfo(result);
        },
        error:function(msg) {
            console.log(msg);
            alert("错误："+JSON.stringify(msg));
        }
    });
}
function getUserInfo(jsonData){
    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
    if(data.errmsg){
        alert("错误："+data.errmsg);
        return;
    }
    access_token = data.access_token;
    openid = data.openid;
    var params = "";
    params += "access_token="+access_token;
    params += "&openid="+openid;
    params += "&lang="+lang;

    $.ajax({
        type: POST,
        url: AJAX_URL+"doPostWx.do?callback=?",
        data: {
            url: WX_URL+METHOD_USER_INFO,
            params: params
        },
        dataType : 'JSONP',
        success: function(result){
            wxUserInfo = typeof result == 'string' ? JSON.parse(result) : result;
        },
        error:function(msg) {
            console.log(msg);
            alert("错误："+JSON.stringify(msg));
        }
    });
}
//初始化 梦想项目
function initDreamList(jsonData){
    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
    var userInfo = data.user_info;
    $("#help").click(function(){
        //获取梦想活动列表
        $.ajax({
            type: POST,
            url: AJAX_URL+"dreamHelpAdd.do",
            data: {
                userId: userId,
                openid: wxUserInfo.openid,
                wxUserName: wxUserInfo.nickname,
                wxUserIcon: wxUserInfo.headimgurl
            },
            dataType : 'JSON',
            success: function(jsonData){
                var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
                if(data){
                    if(data.status == 100){
                        alert("助力成功！");
                    }else {
                        alert("助力失败："+data.message);
                    }
                }
            },
            error:function(msg) { console.log(msg)}
        });
    });
    $("#play").click(function(){
        window.location = ROOT_RUL;
    });

    $("#userinfo").find("img").attr("src", userInfo.userIcon);
    $(".uname").html("我是"+userInfo.userName);
    $(".sign").html(userInfo.dreamWord);

    var dataList = data.list;
    $('#dreamList').empty();
    if(dataList && dataList.length > 0){
        dataList.forEach(function(elem){
            var $dom =$('#dream_a').clone().appendTo('#dreamList');
            $dom.find(".bg").css({
                "background-image": 'url('+elem.labelBgImg+')'
            });
            $dom.find(".title").html(elem.labelTitle);
            $dom.find(".sub_title").html(elem.labelDes);
        });
    }
}
//初始化 助力列表
function initHelpers(jsonData){
    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
    var dataList = data.list;
    $('#dreamListHelpers').empty();
    if(dataList && dataList.length > 0){
        dataList.forEach(function(elem){
            var $dom =$('#dream_list_helper').clone().appendTo('#dreamListHelpers');
            $dom.find("img").attr("src", elem.wxUserIcon);
            var feeValue = "";
            var feeValueClass = "";
            if(elem.feeValue > 0){
                feeValueClass = "plus";
                feeValue = "+"+elem.feeValue;
            }else if(elem.feeValue < 0){
                feeValueClass = "minus";
                feeValue = "-"+elem.feeValue;
            }
            $dom.find(".info").html(elem.wxUserName+'助力<span class="'+feeValueClass+'">'+feeValue+'梦想币</span>');
            $dom.find(".desc").html(elem.helpWord);
        });
    }else {
        $('#dreamListHelpers').hide();
    }
}
//初始化 助力统计
function initDreamHelpTotal(jsonData){
    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
    if(data.userNum && data.userNum > 0){
        var feeValue = "";
        var feeValueClass = "";
        if(data.feeValue > 0){
            feeValueClass = "plus";
            feeValue = "+"+data.feeValue;
        }else if(data.feeValue < 0){
            feeValueClass = "minus";
            feeValue = "-"+data.feeValue;
        }
        $(".total_info").html('共有'+data.userNum+'人帮李鹤助力了<span class="plus">'+feeValue+'梦想币</span>');
    }else {
        $(".total_info").hide();
    }
}