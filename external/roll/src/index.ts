import { Context, Schema, sleep } from 'koishi'
// import { send } from 'process'

function myrandom(Arr) {
    let idx = Math.floor(Math.random() * Arr.length)
    return Arr[idx]
}

function wait(ms) {
    return new Promise(resolve => setTimeout(() => { }, ms));
}
export const name = 'roll'

export interface Config { }

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
    // write your plugin here
    ctx.command('roll <people:string> [...rest]')
        .action(async (_, people, ...rest) => {
            console.log('1111111')
            if (!people) {
                return '请输入要roll的东西啊'
            }
            let rollPeople = [people, ...rest]
            let selectPeople = myrandom(rollPeople)
            console.log(_.session.username)
            let user_name = _.session.username
            let content = `转动命运的齿轮，拨开眼前迷雾..., 启动吧，命运的水晶球，为${user_name}指引方向！`
            await _.session.send(content)
            let msg: any = await new Promise((res, rej) => {
                setTimeout(() => {
                    res(`命运的水晶球指向了${selectPeople}！`)
                }, 2000)
            })
            await _.session.send(msg)
        })
    // ctx.on('message', (session) => {
    //     console.log(11)
    // })
}
