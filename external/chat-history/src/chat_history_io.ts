import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

//将聊天记录存入数据库
async function saveChatHistory(group_id:any, user_qq:number, text:string) {
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
async function getHistoryById(group_id:any, user_qq:number, text:string) {
  let result = await prisma.chat_history.findMany({
    where: {
      group_id: group_id,
      user_qq: user_qq,
    }
  })
  return result
}



export default {
  getHistoryById,
  saveChatHistory
}
