/**
 * Created by liang on 2015/9/27.
 */
var url = 'http://182.92.243.56/nbsc/discovery.do';
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
});
//App 通知 HTML 初始化的方法
function initJS(){
    if(window.Android){
        Android.getData(url, GET, '', 'initData');
    }else if(iOS){
        iOS.callHandler('getData', {
            url: url,
            method: GET,
            params: '',
            callBack: 'initData'
        }, function (response) {
            initData(response);
        });
    }else{
        console.log("Android iOS 没有实现接口，HTML自己获取数据！");
        $.ajax({
            type: GET,
            url: url,
            data: {},
            dataType : 'JSON',
            success: function(result){
                initData(result);
            },
            error:function(msg) { console.log(msg)}
        });
    }
}

//初始化方法
function initData(jsonData){
    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
    if(data == null || data.status != 100){
        return;
    }

    initSlider(data.ads);
    initLWhat(data.labels);
    initWho(data.explores);
    initClub(data.clubs);
    initLWhere(data.activities);
    initLLabel(data.labels);
}
//初始化 轮播图
function initSlider(ads){
    if(!ads || ads.length == 0){
        $('#slider').hide();
    }else {
        var data = [];
        ads.forEach(function(elem){
            data.push({
                content: elem.adPic,
                href: elem.adUrl
            });
        });
        var html = '';
        for (var i = 0; i < data.length; i++) {
            html += '<i' + (i == 0 ? ' class="current"' : '') + '>' + (i + 1) + '</i>';
        }
        $('#slider').html("");
        $('#slider_pages').html(html);
        var isMove = false;
        var islider = new iSlider({
            dom: $('#slider')[0],
            data: data,
            isLooping: true,
            isAutoplay: true,
            onslidechange: function(current) {
                $('#slider_pages').find('i').removeClass('current');
                $($('#slider_pages').find('i').get(current)).addClass('current');
            },
            onslide: function(current){
                isMove = false;
            },
            onslidestart: function(){
                isMove = true;
            },
            onslideend: function(current){
                if(isMove){
                    if(window.Android){
                        //Android.openWindow("com.uplady.teamspace.mine.PersonalHomePageAcitity", elem.userId);
                    }else if(iOS){
                        //iOS.callHandler('pushHotUserForUserId', elem.userId, function (response) {});
                    }else {
                        console.log("跳转地址："+this.data[this.sliderIndex].href);
                    }
                }
            }
        });
    }
}

//初始化 玩什么
function initLWhat(labels){
    if(!labels || labels.length == 0){
        $('#home_what').hide();
    }else {
        $('#home_what_content').empty();
        labels.forEach(function(elem){
            var $what =$('#home_what_content_a').clone().appendTo($('#home_what_content'));
            $what.find('.title').html(elem.labelTitle);
            $what.find('.sub_title').html(elem.labelDes);
            $what.find('.bg').css({
                'background-image': 'url('+elem.labelBgImg+')'
            });
            $what.click(function(){
                if(window.Android){
                    //Android.openWindow("com.uplady.teamspace.dynamic.FansActivity", "queryId:007s");
                }else {
                    console.log("APP 未实现 openWindow 方法");
                }
            });
        });
        if(labels.length < 6){
            $('#home_what_footer').hide();
        }
    }
}
//初始化 跟谁玩
function initWho(explores){
    if(!explores || explores.length == 0){
        $('.home_who').hide();
    }else {
        $('#home_who_content').empty();
        explores.forEach(function(elem){
            var $who =$('#home_who_content_a').clone().appendTo($('#home_who_content'));
            if(elem.userIcon && elem.userIcon.indexOf("localhost") == -1){
                $who.find('img').attr('src', elem.userIcon);
            }
            $who.find('.uname').html(elem.userName);
            $who.find('.playing').html(elem.userDes);
            $who.click(function(){
                if(window.Android){
                    Android.openWindow("com.uplady.teamspace.mine.PersonalHomePageAcitity", elem.userId);
                }else if(iOS){
                    iOS.callHandler('pushHotUserForUserId', elem.userId, function (response) {});
                }else {
                    console.log("APP 未实现 openWindow 方法");
                }
            });
        });
        if(explores.length < 6){
            $('#home_who_footer').hide();
        }
    }
}
//初始化 俱乐部
function initClub(clubs){
    if(!clubs || clubs.length == 0){
        $('#home_clubs').hide();
    }else {
        $('#home_clubs_content').empty();
        clubs.forEach(function(elem){
            var $clubs =$('#home_clubs_content_a').clone().appendTo($('#home_clubs_content'));
            $clubs.find('img').attr('src', elem.clubLogo);
            $clubs.find('.uname').html(elem.clubName);
            $clubs.find('.popular').html(elem.fansNum+"人关注");
            $clubs.click(function(){
                if(window.Android){
                    //Android.openWindow("com.uplady.teamspace.mine.PersonalHomePageAcitity", elem.userId);
                }else {
                    console.log("APP 未实现 openWindow 方法");
                }
            });
        });
    }
}
//初始化 去哪玩
function initLWhere(activities){
    if(!activities || activities.length == 0){
        $('#home_where').hide();
    }else {
        $('#home_where_content').empty();
        activities.forEach(function(elem){
            var $where =$('#home_where_content_a').clone().appendTo($('#home_where_content'));
            $where.find('.title').html(elem.activityName);
            $where.find('.fense').html(elem.activityPrice);
            $where.find('.bg').css({
                'background-image': 'url('+elem.activityLogo+')'
            });
            $where.click(function(){
                if(window.Android){
                    //Android.openWindow("com.uplady.teamspace.mine.PersonalHomePageAcitity", elem.userId);
                }else {
                    console.log("APP 未实现 openWindow 方法");
                }
            });
        });
        if(activities.length < 6){
            $('#home_where_footer').hide();
        }
    }
}
//初始化 热门标签
function initLLabel(labels){
    if(!labels || labels.length == 0){
        $('.home_label').hide();
    }else {
        $('#home_label_content').empty();
        labels.forEach(function(elem){
            var $label =$('#home_label_content_a').clone().appendTo($('#home_label_content'));
            $label.find('img').attr('src', elem.labelImg);
            $label.find('.title').html(elem.labelTitle);
            $label.click(function(){
                if(window.Android){
                    //Android.openWindow("com.uplady.teamspace.mine.PersonalHomePageAcitity", elem.userId);
                }else if(iOS){
                    iOS.callHandler('pushHotLabelDetailsForLabelId', elem.labelId, function (response) {});
                }else {
                    console.log("APP 未实现 openWindow 方法");
                }
            });
        });
        if(labels.length < 6){
            $('#home_label_footer').hide();
        }
    }
}