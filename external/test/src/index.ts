import { Context, Schema } from 'koishi'
import { Logger } from 'koishi'

export const name = 'test'

export interface Config { }

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
    // write your plugin here
    let anti_dlc = false
    ctx.command('anti_dlc <keep_time>')
        .action(({ session }, keep_time) => {
            console.log(keep_time)
            session.send('已打开反DLC系统')
            anti_dlc = true
            // keep_time秒后关闭
            setTimeout(() => {
                anti_dlc = false
                session.send('已关闭反DLC系统')
            }, Number(keep_time) * 1000)
        })
    ctx.middleware(async (session, next) => {
        if (anti_dlc && session.userId === '1297442101') {
            session.send('检测到DLC，开始反DLC攻击')
            return '傻逼dlc'
        }
        return next()
    }, true)
}

new Logger('error:').info('211')
