import { Command, Context, Schema } from 'koishi'

import dict_io from './dict_io'

export const name = 'dict'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.middleware(async (session, next) => {
    let result = await dict_io.getDict(session.content.toString())
    for(let i in result){
      console.log(result[i])
      if(result[i].search_type === 2){
        session.send(result[i].answer)
        return next()
      } else {
        if(result[i].group_id === parseInt(session.guildId)){
          session.send(result[i].answer)
          return next()
        }
      }
    }
    // console.log("no dict")
    return next()
  })

  ctx.command('dict <problem>', '添加词条' ,{ authority: 2 })
    .option('global', '-g' , { authority: 4 })
    .option('delete', '-d' )
    .action(async ({ session, options }, problem:string ):Promise<any> => {
      let commands:Array<string> = []
      ctx.$commander.forEach(e => {
        commands.push(e.name.toString())
      })
      if(commands.includes(problem)){
        return "词条名与命令名冲突"
      }
      //创建局部词条
      if(!options.global && !options.delete){
        session.send("请输入词条对应内容")
        let answer = await session.prompt()
        let result = await dict_io.setDict(parseInt(session.guildId) , problem.toString(),answer.toString())
        console.log(result)
        return "词条创建成功"
      }
      //创建全局词条
      else if(options.global && !options.delete){
        session.send("请输入词条对应内容")
        let answer = await session.prompt()
        let result = await dict_io.setGlobleDict(problem.toString(),answer.toString())
        console.log(result)
        return "词条创建成功"
      }
      //删除局部词条
      else if(!options.global && options.delete){
        let toDel = await dict_io.getDict(problem.toString(),parseInt(session.guildId))
        console.log(toDel)
        if(toDel.length === 0){
          return "没有找到该词条"
        }
        toDel.forEach(async (item:any)=>{
          let result = await dict_io.deleteDict(item.id)
        })
        return "词条删除成功"
      }
      //删除全局词条
      else if(options.global && options.delete){
        let toDel = await dict_io.getDict( problem.toString(),0)
        if(toDel.length === 0){
          return "没有找到该词条"
        }
        console.log(toDel)
        toDel.forEach(async (item:any)=>{
          let result = await dict_io.deleteDict(item.id)
        })
        return "词条删除成功"
      }
    })
}
