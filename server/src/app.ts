import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import jwt from 'koa-jwt'
import serve from 'koa-static'
import koa2HistoryApiFallback from 'koa2-history-api-fallback'
import path from 'path'
import { jwtConfig } from './config'
import router, { defaultPath } from './router'
import { accessLogger, systemLogger } from './middlewares/logger'

const port = 3000

const app: Koa = new Koa()

app
  .use(accessLogger()) // 访问日志
  .use(bodyParser()) // 参数解析

  // jwt权限控制
  // 使用 ctx.state.user 访问解码后的token
  // @see https://www.npmjs.com/package/koa-jwt
  // .use(
  //   jwt({ secret: jwtConfig.SECRET }).unless({
  //     path: defaultPath,
  //   })
  // )

  .use(
    jwt({ secret: jwtConfig.SECRET }).unless({
      custom: (ctx) => {
        if (ctx.url.match(/^\/api/)) {
          return false
        }
        return true
      },
      path: defaultPath,
    })
  )

  .use(router.routes()) // 路由

  .use(koa2HistoryApiFallback())
  .use(serve(path.join(__dirname, 'static')))

app.on('error', (err) => {
  systemLogger.error(err) // 应用日志
})

app.listen(port)

console.log(`Server running on http://localhost:${port}`)
