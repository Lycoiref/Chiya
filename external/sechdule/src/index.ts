// import { Session } from 'inspector'
import { Context, Schema, h } from 'koishi'
import cron from 'koishi-plugin-cron'
export const name = 'sechdule'
export interface Config { }

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
    let bots = ctx.bots
    let sendPerson = '3514392356'
    let sendGroup = '764077539'
    // 早安
    ctx.cron('50 6 * * *', (session: void) => {
        let content = '早上好呀！'
        for (let bot of bots) {
            try {
                bot.sendPrivateMessage(sendPerson, content)
            } catch (e) {
                console.log('explosion!')
            }
        }
    })
    // 晚安
    ctx.cron('50 23 * * *', (session: void) => {
        let content = '晚安呀！'
        for (let bot of bots) {
            try {
                bot.sendPrivateMessage(sendPerson, content)
            } catch (e) {
                console.log('explosion!')
            }
        }
    })
    // 群消息早安
    ctx.cron('50 6 * * *', (session: void) => {
        let content = '早上好呀！'
        for (let bot of bots) {
            try {
                bot.sendMessage(sendGroup, content, sendGroup)
            } catch (e) {
                console.log('explosion!')
            }
        }
    })
    // 群消息晚安
    ctx.cron('50 23 * * *', (session: void) => {
        let content = '晚安捏'
        for (let bot of bots) {
            try {
                bot.sendMessage(sendGroup, content, sendGroup)
            } catch (e) {
                console.log('explosion!')
            }
        }
        return
    })
}
