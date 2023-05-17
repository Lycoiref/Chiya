import database from '../../../public/database_handle'
import { Context, Schema, h } from 'koishi'
import { } from '@koishijs/plugin-adapter-onebot'


export const name = 'sechdule'
export interface Config { }

export const Config: Schema<Config> = Schema.object({})

//全局定义系统时间
//2023-4-2是第5周的周天
let basic = new Date('2023-4-2 00:00:00')
let basicTime = {
    year: basic.getFullYear(),
    month: basic.getMonth() + 1,
    date: basic.getDate(),
    hour: basic.getHours(),
    minute: basic.getMinutes(),
    second: basic.getSeconds(),
    week: 5,
    day: basic.getDay(),
}
let nowTime = {
    year: 0,
    month: 0,
    date: 0,
    hour: 0,
    minute: 0,
    second: 0,
    week: 0,
    day: 0,
}
export function apply(ctx: Context) {
    // 每天0点执行 发晚安

}
