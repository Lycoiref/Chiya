import { Context, Schema } from 'koishi'
import { users } from 'koishi-plugin-database-postgresql'

export const name = 'lycoiref-test'

export interface Config { }

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
    // write your plugin here
    ctx.on('message', (session) => {
        console.log(session);
        console.log("user is :" + users[0].property)
        let info = JSON.stringify(users[0].property)
        console.log(info, "???")
        session.send(info)
    })
}
