import { Context, Model, Schema } from 'koishi'
// import { config } from 'process'

export async function searchAnime(ctx: Context, keyword: string) {
  let url:string = `https://share.dmhy.org/topics/rss/rss.xml?keyword=${keyword}`
  try {
    // console.log('url',url)
    ctx.http.axios (url,{
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36'
        }
      }
    )
  } catch (e) {
    console.log('出错辣')
  }
}