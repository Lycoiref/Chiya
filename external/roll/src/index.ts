import { Context, Schema, sleep, h } from 'koishi'
import axios from 'axios'
import { buffer } from 'stream/consumers'
// import { send } from 'process'

export const name = 'roll'

export interface Config { }

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
    // TODO 记得删除
    ctx.on('message', async session => {
        console.log('11111');
        await new Promise(resolve => setTimeout(() => {
            console.log('22222');
            resolve(11)
        }, 1000))
        console.log('33333');


    })
}
