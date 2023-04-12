import { Context, Database } from 'koishi'
import { PrismaClient } from '@prisma/client';

export const name = 'database-postgres'

export default class PostgresDatabase extends Database {
    constructor(ctx: Context) {
        super()
    }
}
