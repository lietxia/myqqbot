#!/usr/bin/python3
# -*- coding: UTF-8 -*-
import time

from aiocqhttp import CQHttp

bot = CQHttp(api_root="http://usf.lietxia.bid:5700")


@bot.on_message()
async def handle_msg(context):
    return_text = ""
    if context["message"] == "你好":
        return_text = "你也好"

    if context["message"] == "今天":
        return_text = time.asctime(time.localtime(time.time()))
    return {"reply": return_text}


@bot.on_notice("group_increase")
async def handle_group_increase(context):
    await bot.send(context, message="欢迎新人～", at_sender=True, auto_escape=True)
    return


@bot.on_request("group", "friend")
async def handle_request(context):
    return {"approve": True}


bot.run(host="0.0.0.0", port=8080)
