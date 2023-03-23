import { Context, Schema, Session } from 'koishi'
import { h } from 'koishi'
import { send } from 'process'
export const name = 'invite-manager'

export interface Config { }
export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
    let have_friend_request = {
        status: 0,
        messageId: null
    }
    // write your plugin here
    // 入群欢迎
    console.log(ctx.bots)
    let bot = ctx.bots[1]
    let SUPER: string = '3514392356'
    let super_session = new Session(ctx.bots[1])
    super_session.userId = SUPER
    let shenqi: string = ''
    ctx.on('guild-member-added', (session) => {
        console.log('1111')
        session.send('欢迎' + h('at', { id: session.userId }) + '入群' + '\n' + h.image('http://5b0988e595225.cdn.sohucs.com/images/20180904/11eb6dfe54e5402c85f9ba806b63ac76.png'))
    })
    // 好友申请
    ctx.on('friend-request', async (session) => {
        if (have_friend_request.messageId === session.messageId) {
            have_friend_request.messageId = null
        } else {
            let user = await session.bot.getUser(session.userId)
            let content = '好友请求来自:\nQQ:' + user.username
            let masterId = SUPER
            if (masterId != null && masterId != '') {
                session.bot.sendPrivateMessage(masterId, content);
                have_friend_request.status = 1
                have_friend_request.messageId = session.messageId
                // ctx.emit('ask_if_agree' as any, session)
            }
        }
    })

    ctx.middleware(async (session, next) => {
        // console.log(have_friend_request.messageId)
        if (have_friend_request.status == 1) {
            if (session.content === '同意') {
                // friend_req()
                await bot.handleFriendRequest(have_friend_request.messageId, true)
                have_friend_request.status = 0
                return '已同意好友申请'
            }
            else if (session.content === '拒绝') {
                await bot.handleFriendRequest(have_friend_request.messageId, false)
                have_friend_request.status = 0
                return '已拒绝好友申请'
            }
        }
    })
}
