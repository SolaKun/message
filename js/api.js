/**
 * Created by Sola on 2016/3/31.
 */
'use strict';
var tokenRegex = new RegExp('token=([0-9a-z]{8}(-[0-9a-z]{4}){3}-[0-9a-z]{12})');
var idRegex = new RegExp('id=(\\d+)');
var token = tokenRegex.exec(window.location.href);
token = token && token[1];
var id = idRegex.exec(window.location.href);
id = id && id[1];
var api = {};
var totalPage = 0;

var errorHandler = function (err) {

};
var API_BASE = 'http://wcs.sola.love/comment';
api.create = function (text, parent) {
    if (!text) {
        return;
    }
    parent = parent || 0;
    $.ajax({
        URL: API_BASE + '/0',
        type: 'POST',
        data: {
            'text': text,
            'parent': parent
        },
        dataType: 'json',
        headers: {
            'x-auth-token': token
        },
        success: function (data) {
            data.timestamp = new Date().getTime();
            domUtil.inject(data);
        },
        error: errorHandler
    });
};
api.fetch = function (index) {
    index = index || 0;
    $.ajax({
        url: API_BASE + '/0',
        type: 'GET',
        data: {
            'page': index
        },
        dataType: 'json',
        headers: {
            'x-auth-token': token
        },
        success: function (data) {
            totalPage = data.totalPage;
            domUtil.injectAll(data.comments);
        },
        error: errorHandler
    });
};
api.get = function () {
    if (!id) {
        return api.fetch(0);
    }
    $.ajax({
        url: API_BASE + '/' + id + '',
        type: 'GET',
        dataType: 'json',
        headers: {
            'x-auth-token': token
        },
        success: function (data) {
            domUtil.inject(data.comment);
            domUtil.injectAll(data.replies);
            new Vue({
                el: '.reply-banner',
                data: {
                    length: data.replies.length
                }
            });
        },
        error: errorHandler
    });
};
api.update = function (id, text) {
    if (!text || !id) {
        return;
    }
    $.ajax({
        url: API_BASE + '/' + id + '',
        type: 'PATCH',
        data: {
            'text': text
        },
        dataType: 'json',
        headers: {
            'x-auth-token': token
        },
        success: function (data) {
            domUtil.inject(data);
        },
        error: errorHandler
    });
};
api.del = function (id) {
    if (!id) {
        return;
    }
    $.ajax({
        url: API_BASE + '/' + id + '',
        type: 'DELETE',
        dataType: 'json',
        headers: {
            'x-auth-token': token
        },
        success: function () {
            domUtil.remove(id);
        },
        error: errorHandler
    });
};