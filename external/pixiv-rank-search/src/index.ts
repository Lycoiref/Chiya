import { Context, Schema, h } from 'koishi'
import { search_pixpv_urls } from './resource'
export const name = 'pixiv-rank-search'
function myrandom(Arr) {
    let idx = Math.floor(Math.random() * Arr.length)
    return Arr[idx]
}
export interface Config { }

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
    // write your plugin here
    ctx.command('pixiv <keyword> [page:number]', 'pixiv搜索')
        .action(async (_, keyword, page) => {
            console.log(keyword, page)
            try {
                if (!page) page = 1
                let data = await search_pixpv_urls(keyword, page, 1)
                // console.log(data)
                let selectimg = myrandom(data)
                // return `id:${selectimg.id}\n标题:${selectimg.title}\n`
                _.session.send(`id:${selectimg.id}\n标题:${selectimg.title}\n` + h('image', { url: `${selectimg.urls}` }))

            } catch (e) {
                return '出错啦'
            }
        })
}
