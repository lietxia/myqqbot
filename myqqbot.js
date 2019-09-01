const CQHttp = require('cqhttp');

const bot = new CQHttp({ apiRoot: 'http://usf.lietxia.bid:5700' });

bot.on('message', context => {
    let return_text = '';
    if (context.raw_message.startsWith('你好')) {
        return_text = '哈喽～';
    }

    if (context.raw_message.startsWith('今天')) {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        return_text = year + '年' + month + '月' + day + '日 ' + hour + ':' + minute + ':' + second;
    }

    bot('send_msg', { ...context, message: return_text });
});

bot.on('notice', context => {
    if (context.notice_type === 'group_increase') {
        // 处理群成员添加事件
        bot('get_group_member_info', {
            group_id: context.group_id,
            user_id: context.user_id
        }).then(data => {
            const name = data.nickname || '新人';
            bot('send_group_msg', {
                group_id: context.group_id,
                message: `欢迎${name}`
            }).catch(err => { });
        }).catch(err => { console.log(err); });
    }
    // 忽略其它事件
});

bot.on('request', context => {
    if (context.request_type === 'group' ||
        context.request_type === 'friend') {
        // 处理加群请求
        /*
        if (context.message !== 'some-secret') {
            return { approve: false, reason: '口令不对' };
        }
        */
        return { approve: true };
    }
    // 忽略其它类型的请求
});

bot.listen(8080, '0.0.0.0');