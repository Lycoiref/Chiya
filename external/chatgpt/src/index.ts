import { Context, Schema } from 'koishi'
import { h } from 'koishi'

export const name = 'chatgpt'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export async function apply(ctx: Context) {
  let url = 'https://api.openai.com/v1/chat/completions'
  ctx.on("message", async(session)=>{
    if(session.subtype === "private") {
      let question = session.content
      let answer = await ctx.http.post(url,{
        proxy:{
          prompt: 'http://',
          host:'127.0.0.1',
          port:7890,
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.apiKey}`
        },
        data: {
          "model": "gpt-3.5-turbo",
          "massages": [{'role':'user', "content": question }],
          "temperature": 0.7
        }
      })
      console.log(answer)
    }
    
  })
}
