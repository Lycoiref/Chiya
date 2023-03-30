import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

//时间戳处理函数
// function getTime(date) {
//   var date = new Date(date);
//   var year = date.getFullYear();
//   var month = date.getMonth() + 1;
//   var day = date.getDate();
//   var Hours = date.getHours();
//   var Minutes = date.getMinutes();
//   var Seconds = date.getSeconds();
//   if(month < 10) {
//     month = "0" + month;
//   }
//   if(day < 10) {
//     day = "0" + day;
//   }
//   var s_createtime = year + '-' + month + '-' + day + ' ' + Hours + ':' + Minutes + ':' + Seconds;
//   return s_createtime;
// }



// 有关dict功能的数据库操作
  //设置局部词条
  async function setDict(group_id, problem, answer) {
    let result = await prisma.word_bank.create({
      data: {
        group_id: group_id,
        problem: problem,
        answer: answer,
        search_type: 1,
        create_time: new Date(),
        update_time: new Date(),
      }
    })
    return result
  }

  //设置全局词条
  async function setGlobleDict(problem, answer) {
    let result = await prisma.word_bank.create({
      data: {
        group_id: 0,
        problem: problem,
        answer: answer,
        search_type: 2,
        create_time: new Date(),
        update_time: new Date(),
      }
    })
    return result
  }

  //更新词条
  async function updateDict(id, answer) {
    let result = await prisma.word_bank.update({
      where: {
        id: id,
      },
      data: {
        answer: answer,
        update_time: new Date(),
      }
    })
    return result
  }

  //查询词条
  async function getDict(problem ,group_id) {
    let result = await prisma.word_bank.findMany({
      where: {
        group_id: group_id,
        problem: problem,
      }
    })
    return result
  }

  //删除词条
  async function deleteDict(id) {
    let result = await prisma.word_bank.delete({
      where: {
        id: id,
      }
    })
    return result
  }



//有关群组的数据库操作
  //添加群组
  async function setGroup(group_id, group_name,max_member_count,now_member_count) {
    //转换数据类型
    let id = parseInt(group_id)
    let name = group_name.toString()
    let max = parseInt(max_member_count)
    let now = parseInt(now_member_count)
    //数据库操作
    let result = await prisma.group_info.create({
      data: {
        group_id: id,
        group_name: name,
        max_member_count: max,
        member_count: now,
        group_flag: 1,
      }
    })
    return result
  }
  //获取群组
  async function getGroup(group_id) {
    //转换数据类型
    let id = parseInt(group_id)
    //数据库操作
    let result = await prisma.group_info.findUnique({
      where: {
        group_id: id,
      }
    })
    return result
  }

//有关用户的数据库操作
  //添加用户
  async function setUser(user_id, user_name, user_group, join_time, user_role) {
    //转换数据类型
    let id = parseInt(user_id)
    let name = user_name.toString()
    let group = parseInt(user_group)
    let time = new Date(join_time)
    let role = user_role.toString()
    //数据库操作
    let result = await prisma.group_info_users.create({
      data: {
        user_qq: id,
        user_name: name,
        group_id: group,
        user_join_time: time,
        user_role: role,
      }
    })
    return result
  }
  //删除用户
  async function deleteUser(user_id, user_group) {
    //转换数据类型
    let id = parseInt(user_id)
    let group = parseInt(user_group)
    //数据库操作
    let result = await prisma.group_info_users.delete({
      where: {
        user_qq_group_id: {
          user_qq: id,
          group_id: group,
        }
      }
    })
    return result
  }


//历史记录相关的数据库操作
  //将聊天记录存入数据库
  async function saveChatHistory(group_id, user_qq, text) {
    //转换数据类型
    let id = parseInt(group_id)
    let qq = parseInt(user_qq)
    //数据库操作
    let result = await prisma.chat_history.create({
      data: {
        group_id: group_id,
        user_qq: user_qq,
        text: text,
        create_time: new Date(),
      }
    })
    return result
  }

  //查询聊天记录
  async function getHistoryById(group_id, user_qq, text) {
    //转换数据类型
    let id = parseInt(group_id)
    let qq = parseInt(user_qq)
    //数据库操作
    let result = await prisma.chat_history.findMany({
      where: {
        group_id: group_id,
        user_qq: user_qq,
        text: text,
      }
    })
    return result
  }

module.exports = {
//聊天记录
  getHistoryById,
  saveChatHistory,
//用户
  deleteUser,
  setUser,
//群组
  getGroup,
  setGroup,
//词条
  setDict,
  setGlobleDict,
  updateDict,
  getDict,
  deleteDict,
}
