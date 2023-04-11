import { Context, Schema } from 'koishi'

export const name = 'getsmt'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  // 想爬一些世界范围内的新闻和有意思的博客之类的，但现在懒得写了
}
