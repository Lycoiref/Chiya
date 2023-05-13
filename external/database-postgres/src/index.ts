import { Context, Service, Schema } from 'koishi'
import { PrismaClient } from '@prisma/client';

export const name = 'database-postgres'


declare module 'koishi' {
    interface Context {
        postgres: PostgresDatabase
    }
}
//test

export interface Config { }

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
    try {
        ctx.postgres = new PostgresDatabase(new PrismaClient(), ctx);
        console.log(ctx.postgres.str);

    } catch (error) {
        console.log(error);

    }

}

export class PostgresDatabase extends Service {
    postgres = this
    str = '1111'
    constructor(public client: PrismaClient, ctx: Context) {
        super(ctx, 'postgres')
        console.log('已注册数据库组件');
    }

    async init() {
        await this.client.$connect()
    }

    async close() {
        await this.client.$disconnect()
    }

    async getUserTest() {
        return await this.client.bag_users.findFirst({})
    }
}

// export default PostgresDatabase