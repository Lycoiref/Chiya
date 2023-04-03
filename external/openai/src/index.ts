import { Context, Schema } from 'koishi'
import { askChatGPT } from './request'
export const name = 'openai'

export interface Config { }

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  // write your plugin here
  ctx.command('# <query>')
    .action(async ({ session }, query) => {
      // 默认不开启上下文模式,不开启人格设定
      let message = [{ "role": 'system', 'content': 'you are helpful useful a AI' }]
      let user = { "role": 'user', 'content': query }
      let result = await askChatGPT(message.push(user))
      console.log(message)
      return result
    })
}