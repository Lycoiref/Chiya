import { Context, Schema, h, Database } from 'koishi'
import { } from '@koishijs/plugin-adapter-onebot'
import database from '../../../public/database_handle'
// import { prasma } from './prisma'

export const name = 'invite-manager'
export interface Config { }

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
    //该插件中全局变量
    //好友申请处理状态及信息
    let have_friend_request = {
        status: 0,
        messageId: null,
    }
    //群邀请处理状态及信息
    let have_guild_request = {
        guildId: null,
        guildName: null,
        status: 0,
        messageId: null,
        userId: null
    }
    //获取super用户
    let SUPER: Array<string> = process.env.masters.split(',')
    //监听加群事件并记录用户信息
    ctx.on('guild-member-added',async (session) => {
        let user = {
            userId: session.userId,
            username: session.username,
            guildId: session.guildId,
            timestamp: Date.now(),
            role: "member"
        }
        console.log(user)
        //将用户信息存入数据库
        let result = await database.setUser(
            session.userId,
            session.username,
            session.guildId,
            Date.now(),
            "member"
            )
            .catch((err)=>{
                console.log(err)
            })
        session.send('欢迎' + h('at', { id: session.userId }) + '入群' + '\n' + h.image('http://5b0988e595225.cdn.sohucs.com/images/20180904/11eb6dfe54e5402c85f9ba806b63ac76.png'))
    })
    //监听退群事件并删除用户信息
    ctx.on('guild-member-deleted',async (session) => {
        let user = {
            userId: session.userId,
            username: session.username,
        }
        console.log(user)
        //将用户信息从数据库删除
        let result = await database.deleteUser(session.userId,session.guildId)
            .catch((err)=>{
                console.log(err)
            })
        console.log(session)
        if(session.userId === session.operatorId){
            session.send(session.username +" 永远的离开了我们")
        } else {
            session.send(session.username +" 被"+ h('at', { id: session.operatorId }) +"送走了")
        }
    })
    // 加入群组验证
    ctx.on('guild-added', async (session) => {
        //从数据库获取群信息
        let myGroup = await database.getGroup(session.guildId)
        if(myGroup === null){
            await session.send("不要随便拉我进群！")
            await session.onebot.setGroupLeave(session.guildId)
        } else {
            await session.send("正在初始化，请稍候")
            let userList = await session.onebot.getGroupMemberList(session.guildId)
            console.log(userList)
            for(let i in userList){
                let result = await database.setUser(
                    userList[i].user_id,
                    userList[i].nickname,
                    userList[i].group_id,
                    userList[i].join_time*1000,
                    userList[i].role
                    )
                    .catch((err)=>{
                        console.log(err)
                    })
                console.log(result)
            }
            await session.send("初始化完成,欢迎使用")
        }
    })
    // 好友申请
    ctx.on('friend-request', async (session) => {
        if (have_friend_request.messageId === session.messageId) {
            have_friend_request.messageId = null
        } else {
            let user = await session.bot.getUser(session.userId)
            let content = '好友请求来自:\nQQ:' + user.username + '\n' + '是(y)否(f)同意'
            if (SUPER.length !== 0) {
                have_friend_request.status = 1
                have_friend_request.messageId = session.messageId
                //向所有super用户发送确认信息
                SUPER.forEach((item) => {
                    session.bot.sendPrivateMessage(item, content);
                })
            }
        }
    })
    //好友操作
    ctx.middleware(async (session, next) => {
        if (have_friend_request.status == 1) {
            if ( SUPER.includes(session.userId) && session.content === 'y' ) {
                await session.bot.handleFriendRequest(have_friend_request.messageId, true)
                have_friend_request.status = 0
                return '已同意好友申请'
            }
            else if (SUPER.includes(session.userId) && session.content === 'f') {
                await session.bot.handleFriendRequest(have_friend_request.messageId, false)
                have_friend_request.status = 0
                return '已拒绝好友申请'
            }
        } else {
            // 继续传递事件否则阻断
            return next()
        }
    })
    // 群邀请
    ctx.on('guild-request', async (session) => {
        if (have_guild_request.messageId === session.messageId) {
            have_guild_request.messageId = null
        }
        else {
            let user = await session.bot.getUser(session.userId)
            let guild = await session.bot.getGuild(session.channelId)
            const content = '群邀请来自:\nQQ:' + user.username + '\n' + '加入群:' + guild.guildName + '\n' + '是(y)否(f)同意'
            if (SUPER.length !== 0) {
                have_guild_request.guildId = session.guildId
                have_guild_request.guildName = guild
                have_guild_request.userId = session.userId
                have_guild_request.status = 1
                have_guild_request.messageId = session.messageId
                //向所有super用户发送确认信息
                SUPER.forEach((item) => {
                    session.bot.sendPrivateMessage(item, content);
                })
            }
        }
    })
    //群操作
    ctx.middleware(async (session, next) => {
        if (have_guild_request.status == 1) {
            if ( SUPER.includes(session.userId) && session.content === 'y') {
                //获得群信息
                let groupInfo = await session.onebot.getGroupInfo(have_guild_request.guildId)
                console.log(groupInfo)
                //更新群信息至数据库
                let result = await database.setGroup(groupInfo.group_id,groupInfo.group_name,groupInfo.max_member_count,groupInfo.member_count)
                    .catch((err) => {
                        console.log(err)
                    })
                console.log(result)
                //将标志验证信息状态置为0   ---无待办事项
                have_guild_request.status = 0
                //win!!!
                await session.bot.handleGuildRequest(have_guild_request.messageId, true, null)
                return '已同意群邀请'
            }
            else if (SUPER.includes(session.userId) && session.content === 'f') {
                await session.bot.handleGuildRequest(have_guild_request.messageId, false, null)
                have_guild_request.status = 0
                return '已拒绝群邀请'
            }
        } else {
            return next()
        }
    }, true)
}
