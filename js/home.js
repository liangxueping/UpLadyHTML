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
    //ע��iOS����
    connectWebViewJavascriptBridge(function (bridge) {
        iOS = bridge;
        bridge.init(function (message, responseCallback) {
            var data = { 'Javascript Responds': 'Wee!' }
            responseCallback(data);
        });
        bridge.registerHandler('init', function (data, responseCallback) {
            init(data);
        });
    });
    if(window.Android){
        Android.getData(url, GET, '', 'init');
        var imageURL = Android.getImageFile();
        alert("imageURL3:"+imageURL);
        $("#lunbotu").attr("src","data:image/jpeg;base64,"+imageURL);
    }else if(iOS){
        iOS.callHandler('getData', {
            url: url,
            method: GET,
            params: '',
            callBack: 'init'
        }, function (response) {
            init(response);
        });
    }else{
        console.log("Android iOS û��ʵ�ֽӿڣ�HTML�Լ���ȡ���ݣ�");
        $.ajax({
            type: GET,
            url: url,
            data: {},
            dataType : 'JSON',
            success: function(result){
                init(result);
            },
            error:function(msg) { console.log(msg)}
        });
    }
});
//��ʼ������
function init(jsonData){
    var data = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
    if(data == null || data.status != 100){
        return;
    }
    initLWhat(data.labels);
    initWho(data.explores);
    initClub(data.clubs);
    initLWhere(data.activities);
    initLLabel(data.labels);
}
//��ʼ�� ��ʲô
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
                    console.log("APP δʵ�� openWindow ����");
                }
            });
        });
        if(labels.length < 6){
            $('#home_what_footer').hide();
        }
    }
}
//��ʼ�� ��˭��
function initWho(explores){
    if(!explores || explores.length == 0){
        $('.home_who').hide();
    }else {
        $('#home_who_content').empty();
        explores.forEach(function(elem){
            var $who =$('#home_who_content_a').clone().appendTo($('#home_who_content'));
            $who.find('#home_who_image').attr('src', elem.userIcon);
            $who.find('.uname').html(elem.userName);
            $who.find('.playing').html(elem.userDes);
            $who.click(function(){
                if(window.Android){
                    Android.openWindow("com.uplady.teamspace.mine.PersonalHomePageAcitity", elem.userId);
                }else if(iOS){
                    iOS.callHandler('pushHotUserForUserId', elem.userId, function (response) {});
                }else {
                    console.log("APP δʵ�� openWindow ����");
                }
            });
        });
        if(explores.length < 6){
            $('#home_who_footer').hide();
        }
    }
}
//��ʼ�� ���ֲ�
function initClub(clubs){
    if(!clubs || clubs.length == 0){
        $('#home_clubs').hide();
    }else {
        $('#home_clubs_content').empty();
        clubs.forEach(function(elem){
            var $clubs =$('#home_clubs_content_a').clone().appendTo($('#home_clubs_content'));
            $clubs.find('#home_clubs_image').attr('src', elem.clubLogo);
            $clubs.find('.uname').html(elem.clubName);
            $clubs.find('.playing').html(elem.fansNum+"�˹�ע");
            $clubs.click(function(){
                if(window.Android){
                    //Android.openWindow("com.uplady.teamspace.mine.PersonalHomePageAcitity", elem.userId);
                }else {
                    console.log("APP δʵ�� openWindow ����");
                }
            });
        });
    }
}
//��ʼ�� ȥ����
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
                    console.log("APP δʵ�� openWindow ����");
                }
            });
        });
        if(activities.length < 6){
            $('#home_where_footer').hide();
        }
    }
}
//��ʼ�� ���ű�ǩ
function initLLabel(labels){
    if(!labels || labels.length == 0){
        $('.home_label').hide();
    }else {
        $('#home_label_content').empty();
        labels.forEach(function(elem){
            var $label =$('#home_label_content_a').clone().appendTo($('#home_label_content'));
            $label.find('#home_label_image').attr('src', elem.labelImg);
            $label.find('.title').html(elem.labelTitle);
            $label.click(function(){
                if(window.Android){
                    //Android.openWindow("com.uplady.teamspace.mine.PersonalHomePageAcitity", elem.userId);
                }else if(iOS){
                    iOS.callHandler('pushHotLabelDetailsForLabelId', elem.labelId, function (response) {});
                }else {
                    console.log("APP δʵ�� openWindow ����");
                }
            });
        });
        if(labels.length < 6){
            $('#home_label_footer').hide();
        }
    }
}