import { Context, Schema, h } from 'koishi'
import { getUserAuthority,deleteUserAuthority,setUserAuthority} from './basic_authority_manage'
import banOprate  from './ban_someone'

let ban = new banOprate()

export const name = 'user-authority-opration'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.middleware(async (session, next) => {
    // if(session.subtype === "group"){
    //   if(session.content === ".ban"){
    //     await session.send("ok")
    //   }
    // }
    // if(session.subtype === "group" && session.guildId === "765557440") {
    //   let user = await getUserAuthority(parseInt(session.userId),parseInt(session.guildId))
    //   console.log("user=" + user)
    //   if(user === null) {
    //     await setUserAuthority(parseInt(session.userId),parseInt(session.guildId),5)
    //   }
    // }
    
  })
}
