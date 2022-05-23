import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import jwt from 'koa-jwt'
import { jwtConfig } from './config'
import router, { defaultPath } from './router'
import { accessLogger, systemLogger } from './middlewares/logger'

const port = 8080

const app: Koa = new Koa()

app.use(accessLogger()) // 访问日志
app.use(bodyParser()) // 参数解析
// jwt权限控制
// 使用 ctx.state.user 访问解码后的token
// @see https://www.npmjs.com/package/koa-jwt
app.use(
  jwt({ secret: jwtConfig.SECRET }).unless({
    path: defaultPath,
  })
)

app.use(router.routes()) // 路由

app.on('error', (err) => {
  systemLogger.error(err) // 应用日志
})

app.listen(port)

console.log(`Server running on http://localhost:${port}`)
