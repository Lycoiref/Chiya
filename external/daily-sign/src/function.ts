import { PrismaClient } from '@prisma/client'
import { chromium } from 'playwright'

const prisma = new PrismaClient()

let generateRandomNum = (mean: number, variance: number) => {
    let symbol = Math.random() > 0.5 ? 1 : -1
    let random_num = (3 / (Math.random() * mean)) * symbol + Math.random() * variance;
    return random_num
}

let getSignImage = async (random_num: string, checkin_time_last_str: string, impression: string) => {
    const browser = await chromium.launch({ headless: true })
    const context = await browser.newContext({ viewport: { width: 6400, height: 3600 } })
    const page = await context.newPage()
    await page.goto(`http://127.0.0.1:5140/sign?random_num=${random_num}&checkin_time_last_str=${checkin_time_last_str}&impression=${impression}`)
    let img = await page.locator('.sign-card').screenshot()
    console.log(img)
    await browser.close()
    return new Promise((resolve, reject) => {
        resolve(img)
    })
}

let getUserInfo = async (user_qq: string, group_id: string) => {
    let user = await prisma.sign_group_users.findUnique({
        where: {
            user_qq_group_id: {
                user_qq: user_qq,
                group_id: group_id
            }
        }
    })
    return user
}

export let getLastCheckInTime = (user) => {
    let checkin_time_last = user.checkin_time_last
    // 将checkin_time_last转换为年月日形式
    let checkin_time_last_year = checkin_time_last.getFullYear()
    let checkin_time_last_month = checkin_time_last.getMonth() + 1
    let checkin_time_last_day = checkin_time_last.getDate()
    let checkin_time_last_str = `${checkin_time_last_year}-${checkin_time_last_month}-${checkin_time_last_day}`
    return checkin_time_last_str
}

export let updateUser = async (user_qq: string, group_id: string, impression: number, checkin_count: number, now: Date) => {
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
}

export let createUser = async (user_qq: string, group_id: string) => {
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
}

export { generateRandomNum, getSignImage, getUserInfo }
