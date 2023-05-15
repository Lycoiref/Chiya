import { Context, Schema } from 'koishi'
import { getAuth, getCourseData } from './utils/util'
import { } from 'koishi-plugin-database-postgres'

export const name = 'hdu-utils'

export interface Config { }

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
    // write your plugin here
    const database = ctx.postgres.client
    // TODO: 逻辑太拉了，记得改
    ctx.command('今日课表').action(async ({ session }) => {
        let user_qq = Number(session.userId) || 1808347356
        let user = await database.hdu_auto_sign_user.findFirst({
            where: {
                user_qq: user_qq
            }
        })
        let sessionId = await getAuth(user.hdu_account, user.hdu_password)
        console.log(sessionId);
        let courseData = await getCourseData(sessionId, 1)
        console.log(courseData);
        let msg = handledata(courseData, '1')
        return msg
    })
    ctx.command('明日课表').action(async ({ session }) => {
        let user_qq = Number(session.userId) || 1808347356
        let user = await database.hdu_auto_sign_user.findFirst({
            where: {
                user_qq: user_qq
            }
        })
        let sessionId = await getAuth(user.hdu_account, user.hdu_password)
        console.log(sessionId);
        let courseData = await getCourseData(sessionId, 2)
        console.log(courseData);
        let msg = handledata(courseData, '2')
        return msg
    })
}

function handledata(coursedata: any, flag: string) {
    if (coursedata.includes('没有找到该用户')) {
        return '没有找到该用户,请先添加用户信息'
    }
    let data = ''
    if (flag === '1') {
        data += '今日课表如下\n'
        if (coursedata.length == 0) {
            return '今天没有课噢好好休息下趴'
        }
    } else {
        data += '明日课表如下\n'
        if (coursedata.length == 0) {
            return '明天没有课噢好好休息下趴'
        }
    }
    coursedata.forEach((item: any) => {
        data += item.courseName + '\n' + `时间: 第${item.startSection}--${item.endSection}节\n` + `地点: ${item.classRoom}\n` + `教师: ${item.teacherName}\n` + '------------------\n'
    })
    return data
}
