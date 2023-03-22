import { Context, Schema } from 'koishi'
import {h} from 'koishi'
export const name = 'beauty-imgs'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  // write your plugin here
  ctx.command('涩图 <sort>')
    .action(async (_,sort:string | undefined) => {
      console.log(sort)
      if(sort === undefined) {
        return '请指定类型'
      } else {
        let url:string =  'http://124.221.89.187:8080/yin/ec43126fgy1gw2ejx7kfpj216o0o0wrf.jpg'
        return  h.image(url)
      }
    })
}
