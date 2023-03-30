import { Command, Context, Schema } from 'koishi'
import database from'../../../public/database_handle'

export const name = 'dict'

export interface Config { }

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.middleware(async (session, next) => {
    let result = await database.getDict(session.content)
    for(let i in result ){
      if (result[i].group_id === 0) {
        session.send(result[i].answer)
        return next()
      } else if (result[i].group_id === parseInt(session.guildId) && session.subtype === 'group'){
          session.send(result[i].answer)
          return next()
      }
    }
    return next()
  })

    ctx.command('dict', '添加词条')
        .option('global', '-g')
        .option('delete', '-d')
        .action(async ({ session, options }): Promise<any> => {
            //创建局部词条
            if (!options.global && !options.delete) {
              session.send("请输入词条")
              let problem = await session.prompt()
              session.send("请输入词条对应内容")
              let answer = await session.prompt()
              let result = await database.setDict(parseInt(session.guildId), problem.toString(), answer.toString())
              console.log(result)
              return "词条创建成功"
            }
            //创建全局词条
            else if (options.global && !options.delete) {
                let user = await session.getUser()
                if (user.authority < 4) {
                    return "权限不足"
                }
                session.send("请输入词条")
                let problem = await session.prompt()
                session.send("请输入词条对应内容")
                let answer = await session.prompt()
                let result = await database.setGlobleDict(problem.toString(), answer.toString())
                console.log(result)
                return "词条创建成功"
            }
            //删除局部词条
            else if (!options.global && options.delete) {
                session.send("请输入词条")
                let problem = await session.prompt()
                let toDel = await database.getDict(problem.toString(), parseInt(session.guildId))
                console.log(toDel)
                toDel.forEach(async (item: any) => {
                    let result = await database.deleteDict(item.id)
                })
                return "词条删除成功"
            }
            //删除全局词条
            else if (options.global && options.delete) {
                let user = await session.getUser()
                if (user.authority < 4) {
                    return "权限不足"
                }
                session.send("请输入词条")
                let problem = await session.prompt()
                let toDel = await database.getDict(problem.toString(), 0)
                if (toDel.length === 0) {
                    return "没有找到该词条"
                }
                console.log(toDel)
                toDel.forEach(async (item: any) => {
                    let result = await database.deleteDict(item.id)
                })
                return "词条删除成功"
            }
        })
}
