import { Context, Schema } from 'koishi'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const name = 'daily-sign'

export interface Config { }

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
    // write your plugin here
    ctx.on('message', async (session) => {
        if (session.content === '签到') {
            let user = await prisma.bag_users.findUnique({
                where: {
                    id: 81
                }
            })
            session.send(String(user.user_qq))
        }
    })
}
