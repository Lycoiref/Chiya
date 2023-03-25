import { Context, Schema, h } from 'koishi'
import { getUserAuthority, deleteUserAuthority, setUserAuthority } from './basic_authority_manage'
import banOprate from './ban_someone'
import { PrismaClient } from '@prisma/client'
let ban = new banOprate()

const prisma = new PrismaClient()

export const name = 'user-authority-opration'

export interface Config { }

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  
}
