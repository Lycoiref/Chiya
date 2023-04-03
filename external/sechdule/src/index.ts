import database from '../../../public/database_handle'
import { Context, Schema, h } from 'koishi'
import { } from '@koishijs/plugin-adapter-onebot'
import cron from 'koishi-plugin-cron'


export const name = 'sechdule'
export interface Config { }

export const Config: Schema<Config> = Schema.object({})

//全局定义系统时间
//2023-4-2是第5周的周天
let basic = new Date('2023-4-2 00:00:00')
let basicTime = {
    year: basic.getFullYear(),
    month: basic.getMonth() + 1,
    date: basic.getDate(),
    hour: basic.getHours(),
    minute: basic.getMinutes(),
    second: basic.getSeconds(),
    week: 5,
    day: basic.getDay(),
}
let nowTime = {
    year: 0,
    month: 0,
    date: 0,
    hour: 0,
    minute: 0,
    second: 0,
    week: 0,
    day: 0,
}
export function apply(ctx: Context) {
    // 每天0点执行 发晚安
    // 更新数据库中的时间
    ctx.cron('0 0 * * *', async () => {
        // 获取群列表
        let groupList = await database.getGroupList()
        // // 发送晚安
        for (let i in groupList) {
            let groupId = groupList[i].group_id.toString()
            // console.log(groupId);
            await ctx.bots[2].sendMessage(groupId, '晚安,爱你们哟!')
        }
        let timer = new Date()
        nowTime = {
            year: timer.getFullYear(),
            month: timer.getMonth() + 1,
            date: timer.getDate(),
            hour: timer.getHours(),
            minute: timer.getMinutes(),
            second: timer.getSeconds(),
            week: Math.floor((timer.getTime() - basic.getTime()) / (1000 * 60 * 60 * 24 * 7)) + basicTime.week,
            day: timer.getDay(),
        }
    })


    // 定时操作
    ctx.middleware(async (session, next) => {
        //实时获取服务器时间

        if (session.subtype === 'group') {

            console.log(ctx.bots[2])

        }
        return next()
    })
}
