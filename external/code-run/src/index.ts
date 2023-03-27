import { Context, Schema, Quester} from 'koishi'
import {h} from 'koishi'
// 在 glot.io 上run code
import { LANGUAGES } from './languages'
export const name = 'code-run'

export interface Config {}

export const Config: Schema<Config> = Schema.object({
  apiToken: Schema.string().default(process.env.GLOT_API_KEY).description(''),
  defaultLanguage: Schema.string().default('javascript').description('javascript'),
})

const GLOT_URL = 'https://glot.io/api'
  

async function run(http: Quester, language: string, filename: string, code: string, stdin?: string) {
  console.log('****', code,stdin)
  try {
    const data = {
      files: [{
        name: filename,
        content: code,
      }]
    } as any
    if (stdin) data.stdin = stdin
    return await http.post(`/run/${language}/latest`, data)
  } catch(e) {
    console.log('出错辣',e)
    return null
  }
}
export interface Config {
  apiToken?: string
  defaultLanguage?: string
}

export function apply(ctx: Context,config:Config) {
  
  const http = ctx.http.extend({
    endpoint: GLOT_URL,
    headers: {
        'Authorization': `Token ${config.apiToken}`,
        'Content-type': 'application/json'
    },
  })
  ctx.command('code <code:rawtext>')
    .usage(`由 glot.io 提供的代码运行(默认运行语言JavaScript)\n支持的语言: ${LANGUAGES.map(n => n[0]).join(', ')}`)
    .option('language', '-l <language:string>')
    .option('stdin', '-s <stdin:string>')
    .example("code console.log('Hello World!')")
    .action(async ({ options }, code) => {
      console.log('*****',config.apiToken)
      const languageName = options.language ?? config.defaultLanguage
      const language = LANGUAGES.find(n => n[0] === languageName)
      console.log(language)
      if (!language) return '不支持该语言。'
      if (!code) return '请输入代码。'
      const res = await run(http, language[0], `main.${language[1]}`, code, options.stdin)
      if (!res) {
        return '请求出错。'
      }
      if (res.error) {
        return `运行出错: ${res.error}\n${res.stderr}`
      }
      return res.stdout + res.stderr
    })
}
