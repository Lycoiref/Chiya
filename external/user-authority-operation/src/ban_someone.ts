import { PrismaClient } from '@prisma/client'

import { getUserAuthority,deleteUserAuthority,setUserAuthority} from './basic_authority_manage'

const prisma = new PrismaClient()

//判断用户是否被禁言
//若禁言，则返回禁言等级，否则返回false
export async function isBan(user_qq:number, group_id:number) {
  let user = await prisma.ban_users.findUnique({
    where: {
      user_qq_group_id: {
        user_qq: user_qq,
        group_id: group_id
      }
    }
  })
  if(user === null) {
    return false
  }
  else {
    return user.ban_level
  }
}

//ban人  
//  ban_time为0时永久ban
//  此功能为低级ban，只能ban用户，不能ban管理员，且只ban该用户在该群的权限
export async function ban(self_authority:number,user_qq:number, group_id:number, ban_time:number) {
  let user_isBan = await isBan(user_qq,group_id)
  let user_authority = await getUserAuthority(user_qq,group_id)
  if(user_isBan) {
    return "用户已被ban"
  } else {
    if(user_authority >= self_authority) {
      return "权限不足"
    } else {
      let result = await prisma.ban_users.create({
        data: {
          user_qq: user_qq,
          group_id: group_id,
          ban_time: ban_time,
          ban_level: self_authority
        }
      })
      return result
    }
  }
}

//unban 
//  此功能为低级unban，只能解除ban，不能解除superBan，且只解除该用户在该群的ban
export async function unban(self_authority:number,user_qq:number, group_id:number) {

  
  let user_isBan = await isBan(user_qq,group_id)
  if(!user_isBan) {
    return "用户未被ban"
  }
  else {
    if(user_isBan >= self_authority) {
      return "权限不足"
    }
    else {
      let result = await prisma.ban_users.delete({
        where: {
          user_qq_group_id: {
            user_qq: user_qq,
            group_id: group_id
          }
        }
      })
      return result
    }
  }
}

//superBan
//  高级ban，可以ban管理员，且ban该用户在所有群的所有权限\
//  考虑顺便增加禁言功能
export async function superBan(user_qq:number, group_id:number, ban_time:number) {
  let user_isBan = await isBan(user_qq,group_id)
  if(user_isBan){
    let result = await prisma.ban_users.update({
      where: {
        user_qq_group_id: {
          user_qq: user_qq,
          group_id: group_id
        }
      },
      data: {
        ban_level: 10,
        ban_time: ban_time
      }
    })
  } else {
    let result = await prisma.ban_users.create({
      data: {
        user_qq: user_qq,
        group_id: group_id,
        ban_time: ban_time,
        ban_level: 10
      }
    })
  }
}


//superUnban
//  高级unban，可以解除ban管理员，且解除该用户在所有群的所有ban
export async function superUnban(user_qq:number, group_id:number) {
  let user_isBan = await isBan(user_qq,group_id)
  if(!user_isBan){
    return "用户未被ban"
  } else {
    let result = await prisma.ban_users.delete({
      where: {
        user_qq_group_id: {
          user_qq: user_qq,
          group_id: group_id
        }
      }
    })
  }
}


//banTime
//  获取用户禁言时间
//  若未被禁言，则返回false
//  若被禁言，则返回禁言时间
export async function banTime(user_qq:number, group_id:number) {
  let user = await prisma.ban_users.findUnique({
    where: {
      user_qq_group_id: {
        user_qq: user_qq,
        group_id: group_id
      }
    }
  })
  if(user === null) {
    return false
  }
  else {
    return user.ban_time
  }
}

//返回当前群里被ban的人数
//  接受当前群号
export async function banNum(group_id:number) {
  let result = await prisma.ban_users.findMany({
    where: {
      group_id:group_id
    }
  }).count()
  return result
}
