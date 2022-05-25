import Koa from 'koa'
import jwt from 'jsonwebtoken'
import { user } from '../schema'
import { jwtConfig } from '../config'
import encrypt from '../utils/md5'

export default async (ctx: Koa.Context): Promise<void> => {
  const auth = ctx.request.body
  if (!auth || !auth.username || !auth.password) {
    ctx.throw(401, 'Invalid username or password')
  }
  const passwordEncrypt = encrypt(auth.username, auth.password)
  const userId = await user.verifyPwd(auth.username, passwordEncrypt)
  if (!userId) {
    ctx.throw(401, 'Invalid username or password')
  }

  const token = {
    id: userId,
    username: auth.username,
  }
  ctx.status = 200
  // 签名token
  const tokenSign = jwt.sign(token, jwtConfig.SECRET, {
    expiresIn: jwtConfig.EXP_TIME,
  })
  ctx.body = {
    token: tokenSign,
  }
}
