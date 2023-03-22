import { Context, Schema } from 'koishi'
import {h} from 'koishi'
import axios from 'axios'
export const name = 'beauty-imgs'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

interface Imgobj {
  status:string
  data: Imgobj
}
// 发送请求获得图片地址
async function getImgUrl(sort:string){
  let url = await axios.get(`http://124.221.89.187:3000/imgs/${sort}`)
  console.log(url.data)
  return url.data
}

export function apply(ctx: Context) {
  // write your plugin here
  let sorts = ['random', 'iw233', 'top', 'yin', 'cat', 'xing', 'mp']
  ctx.command('涩图 <sort>')
    .action(async (_,sort:string | undefined) => {
      console.log(sort)
      if(sort === undefined) {
        return '请指定类型'
      } else if (sorts.indexOf(sort) === -1) {
        return '类型错误\n 请使用以下类型：\n random\n iw233\n top\n yin \n cat\n xing\n mp' 
      } else {
        let url:any =  await getImgUrl(sort)
        // console.log(url.data.data)
        return  h.image(url.data)
      }
    })  
}
