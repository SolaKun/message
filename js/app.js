/**
 * Created by eva99 on 2016/3/8.
 */
'use strict';
var App = new function () {

    //@姓名显示的HTML
    var atPrefix = '<span class="label label-info"></span>';
    //默认为顶级留言
    var parent = 0; //TODO 如果是在reply界面的话，默认不应为0，而是当前页面的commentID
    //Get回来的数据
    var data = {};
    //维持this
    var self = this;

    //* 获得子留言的发布者名字通过子留言的ID
    var getNickNameById = function (id) {
        var r = data.replies;
        for (var i in r)
            if (r[i].id == id)
                return r[i].user.nickname;
    };

    //* 当头像加载出错时使用SolaCache
    this.onAvaError = function () {
        var $this = $(this);
        //加载图片出错,尝试Sola端缓存
        if ($this.attr('src').indexOf('qlogo.cn'))
            $this.attr('src', $this.data('cache'));
    };

    //* 当Fetch到留言的时候
    this.onFetchComment = function (dat) {
        console.log(dat);
        //装载照片
        var cs = dat.comments;
        for (var i in cs) {
            var $this = $('img.ly-user-ava[data-id="' + cs[i].id + '"]');
            $this.error(self.onAvaError).attr('src', $this.data('src'));
        }
    };

    //* 当获取到留言列表的时候
    this.onGetComment = function (dat) {
        data = dat;
        console.log(dat);
        //针对非对此父留言的回复显示@姓名
        var parentId;
        dat.replies && ((parentId = dat.comment.id), $('.ly-son-reply').each(function (i) {
            var r = dat.replies[i];
            var $this = $(this);
            if (r && r.parent != parentId)//显示@姓名
                $this.prepend($(atPrefix).text(getNickNameById(r.parent) || '外星人').prop('outerHTML'));
        }) );
        //显示头像
        //当原头像无法加载的时候加载SolaCache端的头像
        $('.ly-user-ava').error(self.onAvaError).attr('src', function () {
            //加载图片
            var $this = $(this);
            if ($this.parents('.ly-panel-reply').prop('id').indexOf('r-gen') < 0)
                $this.attr('src', $this.data('src'));
        });

        //默认顶层留言
        self.selectReply((dat.replies && dat.comment.id ) || 0);
    };

    //* 选择一个父留言进行回复
    this.selectReply = function (id) {
        var nickname = getNickNameById(id);
        var $target = $('#reply_target');
        nickname ? $target.text('@ ' + nickname).show() : $target.hide();

    };

    //* 点击"评论"按钮,触发评论当前父留言,或者跳到留言页面
    this.doComment = function (id) {
        //如果已经进到了局部留言页面就表示选择当前父留言回复
        data.replies ? self.selectReply(data.comment.id) : (window.location.href = 'replies.html?id=' + id + "&token=" + token);
    };

    //* 进行留言操作
    this.doReply = function (content) {
        if (content.trim().length == 0)
            return alert('请输入留言!');
        api.create(content, parent);
    };
};
