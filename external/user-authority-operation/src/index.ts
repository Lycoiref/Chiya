import { Context, Schema, h,Database, App } from 'koishi'
import { } from '@koishijs/plugin-adapter-onebot'
import database from '../../../public/database_handle'
import SocksProxyAgent from 'socks-proxy-agent'

const httpsAgent = new SocksProxyAgent.SocksProxyAgent('socks://127.0.0.1:7890')

// function getDs (q = '', b = '') {
//     let n = ''
//     if (['cn_gf01', 'cn_qd01'].includes(this.server)) {
//         n = 'xV8v4Qu54lUKrEYFZkJhB8cuOh9Asafs'
//     } else if (['os_usa', 'os_euro', 'os_asia', 'os_cht'].includes(this.server)) {
//         n = 'okr4obncj8bw5a65hbnn5oo6ixjc3l9w'
//     }
//     let t = Math.round(new Date().getTime() / 1000)
//     let r = Math.floor(Math.random() * 900000 + 100000)
//     let DS = md5(`salt=${n}&t=${t}&r=${r}&b=${b}&q=${q}`)
//     return `${t},${r},${DS}`
// }
// function cacheKey (type, data) {
//     return 'Yz:genshin:mys:cache:' + md5(this.uid + type + JSON.stringify(data))
//   }

export const name = 'user-authority-opration'

export interface Config { }

export const Config: Schema<Config> = Schema.object({})

export async function apply(ctx: Context) {
    let cookie = 'ltuid=328778732; account_mid_v2=09toa51ybm_mhy; UM_distinctid=184ccd486a3e6-0481ffb11b8731-9771539-1bcab9-184ccd486a412db; _MHYUUID=51626d90-2eb6-41f4-83ca-d3b3b9c0e400; _MHYUUID=51626d90-2eb6-41f4-83ca-d3b3b9c0e400; DEVICEFP_SEED_ID=3d60034a991551d6; DEVICEFP_SEED_TIME=1669883791699; _ga=GA1.1.1233855744.1669883792; CNZZDATA1275023096=1533665765-1669880968-null%7C1669880968; mi18nLang=zh-cn; DEVICEFP=38d7edc8bec8f; LOGIN_PLATFORM_SWITCH_STATUS={%22bll8iq97cem8%22:{%22qr_login%22:false%2C%22sms_login_tab%22:true%2C%22pwd_login_tab%22:true%2C%22password_reset_entry%22:true}}; account_id_v2=328778732; ltmid_v2=09toa51ybm_mhy; ltuid_v2=328778732; _ga_KS4J8TXSHQ=GS1.1.1680155174.2.1.1680155728.0.0.0'

    ctx.middleware(async (session, next) => {
        // if(session.subtype === 'group' && session.guildId === '485533566'){
        //     //测试
        //     let url = 'https://www.google.com.hk/'
        //     let result = await ctx.http.axios(url, {method: 'get', httpsAgent: httpsAgent})
        //         .catch((err) => {
        //             console.log(err)
        //         })
        //     console.log(result)
        // }
        return next()
    },true)

    let anti_dlc = false
    ctx.command('anti_wzy <keep_time>' , {authority: 4})
        .action(({ session }, keep_time) => {
            // console.log(keep_time)
            session.send('已打开反WZY系统')
            anti_dlc = true
            // keep_time秒后关闭
            // setTimeout(() => {
            //     anti_dlc = false
            //     session.send('已关闭反WZY系统')
            // }, Number(keep_time) * 1000)
        })
    ctx.middleware(async (session, next) => {
        if (anti_dlc && session.userId === '2878243749') {
            return '检测到WZY，WZY快来陪爷睡觉'
        }
        return next()
    }, true)
}
