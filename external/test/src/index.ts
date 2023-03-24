import { Context, Schema } from 'koishi'
import { Logger } from 'koishi' 

export const name = 'test'

export interface Config { }

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
    ctx.on('message',(session)=>{
        if (session.content == '傻逼周龙荣' && session.userId != '1253794103') {
            session.send('傻逼周龙荣')
        } 
    })
    ctx.middleware((session,next)=>{
        if (session.userId == '1253794103') {
            session.send('检测到傻逼周龙荣说话')
        } else {
            return next()
        } 
    })
}

new Logger('error:').info('211')
