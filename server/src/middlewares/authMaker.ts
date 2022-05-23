import Koa from 'koa'

export default async (ctx: Koa.Context) => {
  return new Promise<number>((resolve) => {
    const userId = ctx.state.user.id
    if (!userId) {
      ctx.throw(401, 'Invaild token')
    }
    resolve(userId)
  })
}
