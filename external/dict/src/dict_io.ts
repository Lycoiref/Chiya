import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

//search_type 1为局部词条 2为全局词条




//设置局部词条
async function setDict(group_id:number,problem:string, answer:string) {
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
async function setGlobleDict(problem:string, answer:string) {
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
async function updateDict(id:number, answer:string) {
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
async function getDict(problem:string ,group_id?:number) {
  let result = await prisma.word_bank.findMany({
    where: {
      group_id: group_id,
      problem: problem,
    }
  })
  return result
}

//删除词条
async function deleteDict(id:number) {
  let result = await prisma.word_bank.delete({
    where: {
      id: id,
    }
  })
  return result
}


export default {
  setDict,
  setGlobleDict,
  updateDict,
  getDict,
  deleteDict
}
