import { Context, Schema, h } from 'koishi'
import { PrismaClient } from '@prisma/client'
import * as jsdom from 'jsdom'
import { generateImage } from 'jsdom-screenshot'
// 此处需要导入 @koishijs/plugin-console 以获取类型
import { } from '@koishijs/plugin-console'
import * as path from 'path'
import { chromium } from 'playwright'

const { JSDOM } = jsdom
const prisma = new PrismaClient()

let generateRandomNum = (mean: number, variance: number) => {
    let symbol = Math.random() > 0.5 ? 1 : -1
    let random_num = (3 / (Math.random() * mean)) * symbol + Math.random() * variance;
    return random_num
}

let getSignImage = async () => {
    const browser = await chromium.launch({ headless: true })
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto('http://127.0.0.1:5140/sign')
    let img = await page.locator('.sign-card').screenshot()
    console.log(img)
    await browser.close()
    return new Promise((resolve, reject) => {
        resolve(img)
    })
}

let generateSignImage = async () => {
    let window = (new JSDOM(`
            <body style="width: 1920px; height: 1080px;">
                签到成功
            </body>
            <style>
                body{color: red;display:flex; justify-content: center; align-items: center;font-size: 120px;}
            </style>
            `, { pretendToBeVisual: true })).window
    let { document } = window
    global.document = document
    generateImage({ viewport: { width: 1920, height: 1080 } }).then(async (image) => {
        let fs = require('fs')
        await fs.promises.writeFile('test.png', image)
        console.log("图片生成成功")
        return new Promise((resolve, reject) => {
            resolve(image)
        })
    })
}

export const name = 'daily-sign'

export interface Config { }

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
    // 使用控制台
    ctx.using(['console'], (ctx) => {
        ctx.console.addEntry({
            dev: path.resolve(__dirname, '../client/index.ts'),
            prod: path.resolve(__dirname, '../dist'),
        })
    })
    // write your plugin here
    ctx.on('message', async (session) => {
        if (session.content === '签到') {
            try {

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
                    let sign_image = await generateSignImage()
                    session.send(h('image', { url: 'file:///E:\\Program\\Nodejs\\koishi\\test.png' }))
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
            } catch (e) {
                let img_buffer = await getSignImage()
                await session.send(h.image(img_buffer as Buffer, 'image/png'))
            }
        } else if (session.content === 'test') {

        }
    })
}

// generateImage({ debug: true }).then((image) => {
//     console.log(image);
//     // 将<Buffer>保存为PNG图片
//     let fs = require('fs')
//     fs.writeFileSync('test.png', image)
// })

