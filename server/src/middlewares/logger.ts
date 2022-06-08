import path from 'path'
import log4js from 'log4js'
import { Context, Next } from 'koa'
import util from 'util'
import dayjs from 'dayjs'

log4js.configure({
  appenders: {
    // 访问日志
    access: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd.log', // 通过日期来生成文件
      alwaysIncludePattern: true, // 文件名始终以日期区分
      encoding: 'utf-8',
      filename: path.join('./logs', 'access.log'), // 生成文件路径和文件名
    },
    // 系统日志
    application: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd.log', // 通过日期来生成文件
      alwaysIncludePattern: true, // 文件名始终以日期区分
      encoding: 'utf-8',
      filename: path.join('./logs', 'application.log'), // 生成文件路径和文件名
    },
    out: {
      type: 'console',
    },
  },
  categories: {
    default: { appenders: ['out'], level: 'info' },
    access: { appenders: ['access'], level: 'info' },
    application: { appenders: ['application'], level: 'WARN' },
  },
})

// date, addr, method, url, HTTP/version, content-length, user-agent
const DEFAULT = '%s %s -- %s %s HTTP/%s, %s %s'

// 记录所有访问级别的日志
export const accessLogger = () => {
  return async (ctx: Context, next: Next) => {
    const logger = log4js.getLogger('access')
    const req = ctx.request
    const { header } = req
    const nodeReq = ctx.req
    const str = util.format(
      DEFAULT,
      dayjs().format(),
      req.ip,
      req.method,
      req.url,
      nodeReq.httpVersion,
      req.length || null,
      header['user-agent']
    )
    logger.info(str)
    await next()
  }
}

export const systemLogger = log4js.getLogger('application') // 记录所有应用级别的日志
