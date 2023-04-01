import { Context, Schema } from 'koishi'
import { h } from 'koishi'
import SocksProxyAgent from 'socks-proxy-agent'

const httpsAgent = new SocksProxyAgent.SocksProxyAgent('socks://127.0.0.1:7890')

export const name = 'chatgpt'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export async function apply(ctx: Context) {
  let url = 'https://api.openai.com/v1/chat/completions'
  ctx.on("message", async(session)=>{
    if(session.subtype === "private") {
      console.log('123')
      let question = session.content
      let answer = await ctx.http.axios(url,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.apiKey}`,
           
        },
        data: {
          "model": "gpt-3.5-turbo",
          "massages": [{'role':'user', "content": question }],
          "temperature": 0.7
        },
        httpsAgent: httpsAgent,
        method: 'post'
      })
      .catch((err)=>{
        console.log(err)
      })
      console.log(answer)
    }
    
  })
}
