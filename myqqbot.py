from aiocqhttp import CQHttp, ApiError

bot = CQHttp(api_root="http://127.0.0.1:5700/")


@bot.on_message
# 上面这句等价于 @bot.on('message')
async def handle_msg(context):
    # 下面这句等价于 bot.send_private_msg(user_id=context['user_id'], message='你好呀，下面一条是你刚刚发的：')
    try:
        await bot.send(context, "你好呀，下面一条是你刚刚发的：")
    except ApiError:
        pass
    return {"reply": context["message"], "at_sender": False}  # 返回给 HTTP API 插件，走快速回复途径


@bot.on_notice("group_increase")
# 上面这句等价于 @bot.on('notice.group_increase')
async def handle_group_increase(context):
    info = await bot.get_group_member_info(
        group_id=context["group_id"], user_id=context["user_id"]
    )
    nickname = info["nickname"]
    name = nickname if nickname else "新人"
    await bot.send(
        context, message="欢迎{}～".format(name), at_sender=True, auto_escape=True
    )


@bot.on_request("group", "friend")
# 上面这句等价于 @bot.on('request.group', 'request.friend')
async def handle_group_request(context):
    return {"approve": True}  # 验证通过


if __name__ == "__main__":
    bot.run(host="127.0.0.1", port=8080)
