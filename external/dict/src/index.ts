import { Command, Context, Schema } from 'koishi'

import dict_io from './dict_io'

export const name = 'dict'

export interface Config { }

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.middleware(async (session, next) => {
    // if
    console.log(ctx.$commander)
    


    let result = await dict_io.getDict(session.content.toString())
    result.forEach((item:any)=>{
      if(item.search_type === 2){
        session.send(item.answer)
        return next()
      } else {
        if(item.group_id === parseInt(session.guildId)){
          session.send(item.answer)
          return next()
        }
      }
    })
    return next()
  })

    ctx.command('dict <problem>', '添加词条')
        .option('global', '-g')
        .option('delete', '-d')
        .action(async ({ session, options }, problem: string): Promise<any> => {
            let result = await dict_io.getDict(problem.toString(), parseInt(session.guildId))
            let user = await ctx.database.getUser(session.platform, session.userId)

            //创建局部词条
            if (!options.global && !options.delete) {
                session.send("请输入词条对应内容")
                let answer = await session.prompt()
                let result = await dict_io.setDict(parseInt(session.guildId), problem.toString(), answer.toString())
                console.log(result)
                return "词条删除成功"
            }
            //创建全局词条
            else if (options.global && !options.delete) {
                let user = await session.getUser()
                if (user.authority < 4) {
                    return "权限不足"
                }
                session.send("请输入词条对应内容")
                let answer = await session.prompt()
                let result = await dict_io.setGlobleDict(problem.toString(), answer.toString())
                console.log(result)
                return "词条删除成功"
            }
            //删除局部词条
            else if (!options.global && options.delete) {
                let toDel = await dict_io.getDict(problem.toString(), parseInt(session.guildId))
                console.log(toDel)
                toDel.forEach(async (item: any) => {
                    let result = await dict_io.deleteDict(item.id)
                })
                return "词条删除成功"
            }
            //删除全局词条
            else if (options.global && options.delete) {
                let user = await session.getUser()
                if (user.authority < 4) {
                    return "权限不足"
                }
                let toDel = await dict_io.getDict(problem.toString(), 0)
                if (toDel.length === 0) {
                    return "没有找到该词条"
                }
                console.log(toDel)
                toDel.forEach(async (item: any) => {
                    let result = await dict_io.deleteDict(item.id)
                })
                return "词条删除成功"
            }
        })
>>>>>>> 25f7d3405566693d8909d7e7de17192a9fd3d457
}
