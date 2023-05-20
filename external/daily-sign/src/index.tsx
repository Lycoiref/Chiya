import User from './function'
import { Context, Schema, h } from 'koishi'
// 此处需要导入 @koishijs/plugin-console 以获取类型
import { } from '@koishijs/plugin-console'
import * as path from 'path'
import { } from 'koishi-plugin-puppeteer'
import { } from 'koishi-plugin-database-postgres'
import fs from 'fs/promises'
import { exec } from 'child_process'

export const name = 'daily-sign'

export interface Config { }

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
    // 使用控制台
    ctx.using(['console'], (ctx) => {
        ctx.console.addEntry({
            dev: path.resolve(__dirname, '../client/index.ts'),
            // prod: path.resolve(__dirname, '../client/index.ts'),
            prod: path.resolve(__dirname, '../dist'),
        })
    })
    // write your plugin here
    ctx.middleware(async (session, next) => {
        const postgres = new User(ctx)
        if (session.content === '签到') {
            try {
                ctx.logger('daily-sign').info(`用户签到：${session.userId} ${session.guildId}`)
                let user_qq: any = session.userId
                let group_id: any = session.guildId
                let user = await postgres.getUserInfo(user_qq, group_id)
                if (user) {
                    // 已有用户
                    let now = new Date()
                    let impression = user.impression.toNumber()
                    let checkin_count = user.checkin_count
                    let checkin_time_last_str = postgres.getLastCheckInTime(user)
                    // 生成随机数mean表示发散程度，variance表示随机数的波动范围
                    let random_num = postgres.generateRandomNum(200, 2)
                    impression += random_num
                    // session.send(`签到成功，好感度 + ${random_num.toFixed(2)}\n`
                    //     + `上次签到时间：${checkin_time_last_str}\n`
                    //     + `当前好感度：${impression.toFixed(2)}`)
                    let sign_image = await postgres.getSignImage(random_num.toFixed(2), checkin_time_last_str, impression.toFixed(2), user, session.author)
                    await session.send(h.image(sign_image as Buffer, 'image/png'))
                    await postgres.updateUser(user_qq, group_id, impression, checkin_count, now)
                    ctx.logger('daily-sign').info(`签到图片生成成功 - ${Date.now()}`)
                } else {
                    // TODO: 对于第一次签到的用户也应该生成签到图片
                    await postgres.createUser(user_qq, group_id)
                    // 其实没成功
                    session.send('签到成功')
                }
            } catch (e) {
                console.log(e)
                return '签到失败'
            }
        } else {
            return next()
        }
    })
    ctx.router.get('/daily-sign', async (ctx) => {
        // 随机图片服务
        const floaderPath = path.resolve(__dirname, '../static/img/')
        try {
            const files = await fs.readdir(floaderPath)
            // 剔除.git, LICENSE, README.md, .github
            files.splice(files.indexOf('.git'), 1)
            files.splice(files.indexOf('.github'), 1)
            files.splice(files.indexOf('LICENSE'), 1)
            files.splice(files.indexOf('README.md'), 1)
            const file = files[Math.floor(Math.random() * files.length)]
            // 判断是否是文件夹
            const stat = await fs.stat(path.resolve(floaderPath, file))
            if (stat.isDirectory()) {
                const allImgs = await fs.readdir(path.resolve(floaderPath, file))
                const randomImg = path.resolve(floaderPath, file, allImgs[Math.floor(Math.random() * allImgs.length)])
                console.log(randomImg);
                const img = await fs.readFile(randomImg)
                ctx.body = h.image(img as Buffer, 'image/png')
            } else {
                const imgURL = path.resolve(floaderPath, file)
                console.log('根图片' + imgURL);
                const img = await fs.readFile(imgURL)
                ctx.body = h.image(img as Buffer, 'image/png')
            }
        } catch (e) {
            console.log(e)
            ctx.body = 'error'
        }
    })
    // 当github仓库有更新时，自动更新
    ctx.router.post('/daily-sign/update', async (req) => {
        exec('git pull', { cwd: path.resolve(__dirname, '../static/img') }, (err: any, stdout: any, stderr: any) => {
            if (err) {
                ctx.logger('daily-sign').error(err)
            } else {
                ctx.logger('daily-sign').info('成功更新图片仓库')
            }
        })
    })
}
