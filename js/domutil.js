/**
 * Created by Sola on 2016/3/29.
 */
(function ($) {
    $.fn.cloneWithProperties = function (properties) {
        return this.clone().prop(properties);
    };
})(window.jQuery);

var domUtil = {

    /**
     * 添加一个元素
     * @param newId 指定要添加元素的ID
     * @param sub 是否为回复
     */
    add: function (newId, sub) {
        if ($('#comment' + newId).length == 0) {
            if (sub) {
                $('#r-gen').cloneWithProperties({
                    id: 'comment' + newId,
                    style: ''
                }).appendTo('#replies');
            } else {
                $('#gen').cloneWithProperties({
                    id: 'comment' + newId,
                    style: ''
                }).appendTo('#comments');
            }
        }
    },

    /**
     * 删除一个元素
     * @param domId 指定要删除元素的ID
     */
    remove: function (domId) {
        var target = $('#comment' + domId);
        if (target.length != 0) {
            target.remove();
        }
    },

    /**
     * 清空
     */
    clear: function () {
        $("[id^='comment']").remove();
    },

    /**
     * 自动注入
     * 自动添加元素、自动注入文本
     * @param jsonData JSON对象(服务器返回)
     */
    inject: function (jsonData) {
        jsonData = jQuery.extend(true, {}, jsonData);        //deep copy
        domUtil.add(jsonData.id, jsonData.parent);
        jsonData.timestamp = timeAgoFromEpochTime(jsonData.timestamp / 1000);
        new Vue({
            el: '#comment' + jsonData.id,
            data: jsonData
        });
    },

    /**
     * 批量自动注入
     * @param jsonArray 对象数组
     */
    injectAll: function (jsonArray) {
        for (var jsonData in jsonArray) {
            domUtil.inject(jsonArray[jsonData]);
        }
    }

};

function timeAgoFromEpochTime(epoch) {
    var secs = ((new Date()).getTime() / 1000) - epoch;
    Math.floor(secs);
    var minutes = secs / 60;
    secs = Math.floor(secs % 60);
    if (minutes < 1) {
        return secs + (secs > 1 ? ' seconds ago' : ' second ago');
    }
    var hours = minutes / 60;
    minutes = Math.floor(minutes % 60);
    if (hours < 1) {
        return minutes + (minutes > 1 ? ' minutes ago' : ' minute ago');
    }
    var days = hours / 24;
    hours = Math.floor(hours % 24);
    if (days < 1) {
        return hours + (hours > 1 ? ' hours ago' : ' hour ago');
    }
    var weeks = days / 7;
    days = Math.floor(days % 7);
    if (weeks < 1) {
        return days + (days > 1 ? ' days ago' : ' day ago');
    }
    var months = weeks / 4.35;
    weeks = Math.floor(weeks % 4.35);
    if (months < 1) {
        return weeks + (weeks > 1 ? ' weeks ago' : ' week ago');
    }
    var years = months / 12;
    months = Math.floor(months % 12);
    if (years < 1) {
        return months + (months > 1 ? ' months ago' : ' month ago');
    }
    years = Math.floor(years);
    return years + (years > 1 ? ' years ago' : ' years ago');
}
