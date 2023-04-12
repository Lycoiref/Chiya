import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

//获取用户权限 
export async function getUserAuthority(user_qq:number, group_id:number) {
  let user = await prisma.authority_users.findUnique({
    where: {
      user_qq_group_id: {
        user_qq: user_qq,
        group_id: group_id
      }
    }
  })
  return user.user_authority
}

//创建用户权限  ----用户进群时调用
export async function setUserAuthority(user_qq:number, group_id:number , set_authority:number) {
  let result = await prisma.authority_users.create({
    data: {
      user_qq: user_qq,
      group_id: group_id,
      user_authority: set_authority,
      group_flag: 0
    }
  })
  return result
}

//删除用户权限 ----用户退群时调用
export async function deleteUserAuthority(user_qq:number, group_id:number) {
  let result = await prisma.authority_users.delete({
    where: {
      user_qq_group_id: {
        user_qq: user_qq,
        group_id: group_id
      }
    }
  })
  return result
}