import { Context, Schema } from 'koishi'
// import { searchAnime } from './source'
import axios from 'axios'
export const name = 'search-anime'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.command('search-anime <keyword:string>')
    .usage('搜索动漫')
    .action(async (_,keyword):Promise<any> => {
      const res = await searchAnime(ctx, keyword)
      console.log('******',res)
      return res
    })
}

async function searchAnime(ctx: Context, keyword: string) {
  let url:string = `https://share.dmhy.org/topics/rss/rss.xml?keyword=${keyword}`
  try {
    // console.log('url',url)
    let result = await ctx.http.axios (url,{
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36'
      },
      proxy: {
        host: 'http://127.0.0.1',
        port: 7890
      }
    }).then(res => {
      console.log('res',res)
      return res
    }).catch(e => {
      console.log('出错辣',e)
    })
    return result
  } catch (e) {
    // console.log('出错辣',e)
  }
  // return result
}
