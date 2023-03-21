import { Context, Schema } from 'koishi'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
let user

async function main() {
    // ... you will write your Prisma Client queries here
    user = await prisma.bag_users.findMany({
        where: {
            id: 81,
        }
    })
    console.log(user[0].property)
    return user
}

export const name = 'database-postgresql'

export interface Config { }

export const Config: Schema<Config> = Schema.object({})

export const users = main()

export async function apply(ctx: Context) {
    // write your plugin here
    ctx.on('message', () => {
        main()
            .catch(e => {
                throw e
            })
            .finally(async () => {
                await prisma.$disconnect()
            })
    })
}
