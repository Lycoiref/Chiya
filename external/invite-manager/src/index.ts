import { Context, Schema, h } from 'koishi'

export const name = 'invite-manager'
export interface Config { }

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
    let have_friend_request = {
        status: 0,
        messageId: null,
    }
    let have_guild_request = {
        status: 0,
        messageId: null,
        userId: null
    }
    let bot = ctx.bots[1]
    let SUPER: Array<string> = process.env.masters.split(',')
    ctx.on('guild-member-added',async (session) => {
        session.send('欢迎' + h('at', { id: session.userId }) + '入群' + '\n' + h.image('http://5b0988e595225.cdn.sohucs.com/images/20180904/11eb6dfe54e5402c85f9ba806b63ac76.png'))
    })
    // 好友申请
    ctx.on('friend-request', async (session) => {
        if (have_friend_request.messageId === session.messageId) {
            have_friend_request.messageId = null
        } else {
            let user = await session.bot.getUser(session.userId)
            let content = '好友请求来自:\nQQ:' + user.username
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
    ctx.middleware(async (session, next) => {
        if (have_friend_request.status == 1) {
            if ( SUPER.includes(session.userId) && session.content === '同意' ) {
                await session.bot.handleFriendRequest(have_friend_request.messageId, true)
                have_friend_request.status = 0
                return '已同意好友申请'
            }
            else if (SUPER.includes(session.userId) && session.content === '拒绝') {
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
            const content = '群邀请来自:\nQQ:' + user.username + '\n' + '加入群:' + guild.guildName
            if (SUPER.length !== 0) {
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
    ctx.middleware(async (session, next) => {
        if (have_guild_request.status == 1) {
            if ( SUPER.includes(session.userId) && session.content === 'ok') {
                await session.bot.handleGuildRequest(have_guild_request.messageId, true, null)
                let result = await ctx.database.setUser(session.platform, have_guild_request.userId,{
                    authority: 3
                })
                have_guild_request.status = 0
                return '已同意群邀请'
            }
            else if (SUPER.includes(session.userId) && session.content === 'no') {
                await session.bot.handleGuildRequest(have_guild_request.messageId, false, null)
                have_guild_request.status = 0
                return '已拒绝群邀请'
            }
        } else {
            return next()
        }
    }
    )
}
