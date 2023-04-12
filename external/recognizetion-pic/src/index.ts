import { Context, Schema } from 'koishi'

export const name = 'recognize-pic'

export interface Config { }

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
    // write your plugin here
    // ctx.on("message", async (session) => {
    //     console.log('***', session.elements[1].attrs)
    // })
    // ctx.command('识图')
}
