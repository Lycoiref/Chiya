import { Context, Schema, User } from 'koishi'
import { } from '@koishijs/plugin-adapter-onebot'
import database from '../../../public/database_handle'

export const name = 'chat-history'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.middleware(async (session, next) => {
    session.send('1')

    if (session.subtype === 'group') {
      await database.saveChatHistory(session.guild, parseInt(session.userId), session.content)
        .catch((err)=>console.log(err))
    } else {
      await database.saveChatHistory(null, parseInt(session.userId), session.content)
      .catch((err)=>console.log(err))
    }

    return next()
  },true)
}
