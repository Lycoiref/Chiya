import request from 'request'
import { strEnc } from './encrypt'

const requests = request.defaults({ jar: true })
let headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:99.0) Gecko/20100101 Firefox/99.0',
    'Content-Type': 'application/x-www-form-urlencoded'
}

export class Axios {
    request: any
    cookieJar: any
    constructor() {
        this.request = requests
        this.cookieJar = requests.jar()
    }
    async get(params) {
        return new Promise((resolve, reject) => {
            this.request.get({ ...params, jar: this.cookieJar, followRedirect: false }, (err, res, body) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    }
    async post(params) {
        return new Promise((resolve, reject) => {
            this.request.post({ ...params, jar: this.cookieJar, followRedirect: false }, (err, res, body) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    }
    test() {
        console.log('test')
    }
}

export async function getAuth(un: string, pd: string) {
    let identity = {
        'rsa': '',
        'ul': '',
        'pl': '',
        'lt': '',
        'execution': '',
        '_eventId': 'submit'
    }
    let url1 = 'https://cas.hdu.edu.cn/cas/login?state=&service=https://skl.hdu.edu.cn/api/cas/login?state=&index='
    let axios = new Axios()
    let res: any = await axios.get({ uri: url1, headers: headers })
    // 获取cookie
    let data = res.body
    let tail = data.split(/name="lt" value="/)[1]
    let exec = data.split(/name="execution" value="/)[1]
    // let exec = 'e2s1'
    identity.lt = tail.split('" />')[0]
    // let dom = new JSDOM(res1.data)
    identity.ul = String(un.length)
    identity.pl = String(pd.length)
    identity.execution = exec.split('" />')[0]
    identity.rsa = strEnc(un + pd + identity.lt, '1', '2', '3')
    res = await axios.post({ uri: url1, headers: headers, form: identity })
    res = await axios.get({ uri: res.headers['location'], headers: headers })
    res = await axios.get({ uri: res.headers['location'], headers: headers })
    res = await axios.get({ uri: res.headers['location'], headers: headers })
    return res.headers['x-auth-token']
}

// 课表
function compare(property) {
    return function (a, b) {
        var value1 = a[property]
        var value2 = b[property]
        return value1 - value2
    }
}

export async function getCourseData(token, flag) {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate() - 1
    let startTime = `${year}-${month}-${day}`
    let url = `https://skl.hdu.edu.cn/api/course`
    let axios = new Axios
    let headers = {
        'User-Agent': "Mozilla/5.0 (Linux; U; Android 9; zh-cn; Redmi Note 5 Build/PKQ1.180904.001) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/71.0.3578.141 Mobile Safari/537.36 XiaoMi/MiuiBrowser/11.10.8",
        'X-Auth-Token': token,
        'Referer': 'https://skl.hduhelp.com/'
    }
    let params = {
        startTime: startTime
    }
    let res: any = await axios.get({ url: url, headers: headers, qs: params })
    let data = JSON.parse(res.body).list
    // 获取基准周
    let firstWeek = new Date(2023, 1, 27)
    // 计算当前是第几周
    let weekNum = Math.ceil((Number(date) - Number(firstWeek)) / 86400000 / 7)
    let period = weekNum % 2 == 0 ? '双' : '单'
    // 获取今天是星期几
    let week = date.getDay()
    if (flag == 1) {
        week = date.getDay()
    } else if (flag == 2) {
        week = date.getDay() + 1
    }
    // 获取今天的课程
    let course = data.filter(item =>
        item.weekDay === week
        && item.startWeek <= weekNum
        && item.endWeek >= weekNum
        && item.courseName
        && item.classRoom
        && item.teacherName
        && ((
            item.period
            &&
            item.period === period
        )
            ||
            !item.period
        )
    )
    for (let item of course) {
        if (item.period) {
            item.courseName = item.courseName + `(${item.period})`
        }
    }
    // 排序
    return course.sort(compare('startSection'))
}
