const CQHttp = require('cqhttp');

const bot = new CQHttp({ apiRoot: 'http://127.0.0.1:5700/' });

bot.on('message', context => {
    bot('send_msg', {
        ...context,
        message: '哈喽～'
    });
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

bot.listen(8080, '127.0.0.1');