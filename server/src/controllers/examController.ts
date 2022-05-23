import Koa from 'koa'
import { exam } from '../schema'
import authMaker from '../middlewares/authMaker'

export const getExam = async (ctx: Koa.Context): Promise<void> => {
  const userId = await authMaker(ctx)
  const { query } = ctx.request
  const limit = Number(query.limit)
  let onlyNew: number | undefined
  if (query.onlyNew !== undefined) {
    onlyNew = Number(query.onlyNew)
  }
  if (
    Number.isNaN(limit) ||
    limit > 30 ||
    (onlyNew !== undefined && ![0, 1].includes(onlyNew))
  ) {
    ctx.throw(400, 'Invalid params')
  }

  const result = await exam.getExam(limit, onlyNew, userId)

  ctx.body = result
}

export const answerQuestion = async (ctx: Koa.Context): Promise<void> => {
  const userId = await authMaker(ctx)
  const questionId = ctx.params.id
  const reqBody = ctx.request.body
  const { answer } = reqBody
  if (!questionId || !answer) {
    ctx.throw(400, 'Invaild params')
  }
  const result = await exam.answerQuestion(userId, questionId, answer)

  ctx.body = result
}

export const collectQuestion = async (ctx: Koa.Context): Promise<void> => {
  const userId = await authMaker(ctx)
  const questionId = ctx.params.id
  const result = await exam.collectQuestion(userId, questionId)

  ctx.body = result
}

export const cancelCollect = async (ctx: Koa.Context): Promise<void> => {
  const userId = await authMaker(ctx)
  const questionId = ctx.params.id
  const result = await exam.cancelCollect(userId, questionId)

  ctx.body = result
}

export const getCollections = async (ctx: Koa.Context): Promise<void> => {
  const userId = await authMaker(ctx)
  const { query } = ctx.request
  const questionId = ctx.params.id
  const size = Number(query.size)
  const page = Number(query.page)
  if ((!questionId && Number.isNaN(page)) || Number.isNaN(size) || size > 30) {
    ctx.throw(400, 'Invalid params')
  }
  let result
  if (questionId) {
    result = await exam.getCollectionsById(questionId, userId, size)
  } else {
    result = await exam.getCollections(userId, page, size)
  }

  ctx.body = result
}
