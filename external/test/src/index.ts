import { Context, Schema } from 'koishi'
import { Logger } from 'koishi'

export const name = 'test'

export interface Config { }

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
    // write your plugin here
}

new Logger('error:').info('211')
