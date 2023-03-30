import { Context, Schema, h,Database } from 'koishi'

export const name = 'user-authority-opration'

export interface Config { }

export const Config: Schema<Config> = Schema.object({})


export async function apply(ctx: Context) {
    // ctx.middleware(async (session, next) => {
    //     let a = await ctx.http.axios({
    //         method: 'get',
    //         url: 'https://baidu.com',
    //     })
    //     console.log(a.data)
    //     return next()
    // })



    let anti_dlc = false
    ctx.command('anti_wzy <keep_time>' , {authority: 4})
        .action(({ session }, keep_time) => {
            // console.log(keep_time)
            session.send('已打开反WZY系统')
            anti_dlc = true
            // keep_time秒后关闭
            // setTimeout(() => {
            //     anti_dlc = false
            //     session.send('已关闭反WZY系统')
            // }, Number(keep_time) * 1000)
        })
    ctx.middleware(async (session, next) => {
        if (anti_dlc && session.userId === '2878243749') {
            return '检测到WZY，WZY快来陪爷睡觉'
        }
        return next()
    }, true)
}
