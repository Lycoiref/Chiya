import { Context, Schema } from 'koishi'
import history from './chat_history_io'

export const name = 'chat-history'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.middleware(async (session, next) => {
    if (session.subtype === 'group') {
      await history.saveChatHistory(session.guild, parseInt(session.userId), session.content)
        .catch((err)=>console.log(err))
    } else {
      await history.saveChatHistory(null, parseInt(session.userId), session.content)
      .catch((err)=>console.log(err))
    }
    return next()
  },true)
}
