import { Context, Schema } from 'koishi'
import { PrismaClient } from '@prisma/client'
import { randomInt } from 'crypto'

const prisma = new PrismaClient()

let generateRandomNum = (mean: number, variance: number) => {
    let symbol = Math.random() > 0.5 ? 1 : -1
    let random_num = (3 / (Math.random() * mean)) * symbol + Math.random() * variance;
    return random_num
}

export const name = 'daily-sign'

export interface Config { }

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
    // write your plugin here
    ctx.on('message', async (session) => {
        if (session.content === '签到') {
            let user_qq = session.userId
            let group_id = session.guildId
            console.log(user_qq, group_id)
            let user = await prisma.sign_group_users.findUnique({
                where: {
                    user_qq_group_id: {
                        user_qq: user_qq,
                        group_id: group_id
                    }
                }
            })
            if (user) {
                // 已有用户
                let now = new Date()
                let impression = user.impression.toNumber()
                let checkin_count = user.checkin_count
                let checkin_time_last = user.checkin_time_last
                // 将checkin_time_last转换为年月日形式
                let checkin_time_last_year = checkin_time_last.getFullYear()
                let checkin_time_last_month = checkin_time_last.getMonth() + 1
                let checkin_time_last_day = checkin_time_last.getDate()
                let checkin_time_last_str = `${checkin_time_last_year}-${checkin_time_last_month}-${checkin_time_last_day}`
                // 生成随机数mean表示发散程度，variance表示随机数的波动范围
                let random_num = generateRandomNum(200, 2)
                impression += random_num
                session.send(`签到成功，好感度 + ${random_num.toFixed(2)}\n`
                    + `上次签到时间：${checkin_time_last_str}\n`
                    + `当前好感度：${impression.toFixed(2)}`)
                await prisma.sign_group_users.update({
                    where: {
                        user_qq_group_id: {
                            user_qq: user_qq,
                            group_id: group_id
                        }
                    },
                    data: {
                        impression: impression,
                        checkin_count: checkin_count + 1,
                        checkin_time_last: now
                    }
                })
            } else {
                // 新建用户
                await prisma.sign_group_users.create({
                    data: {
                        user_qq: user_qq,
                        group_id: group_id,
                        impression: 0,
                        checkin_count: 0,
                        checkin_time_last: new Date(),
                        add_probability: 0,
                        specify_probability: 0
                    }
                })
                // 其实没成功
                session.send('签到成功')
            }
        }
    })
}
