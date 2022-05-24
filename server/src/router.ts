import Router from 'koa-router'
import auth from './controllers/authController'
import {
  getExam,
  answerQuestion,
  collectQuestion,
  cancelCollect,
  getCollections,
} from './controllers/examController'

const router: Router = new Router()

router.prefix('/api')

router.get('/', async (ctx, next) => {
  ctx.body = "Hello Koa and TS."
})

router.post('/token', auth)

router.get('/exam', getExam)
router.get('/collections', getCollections)
router.get('/collections/:id', getCollections)

router.put('/questions/:id/answer', answerQuestion)
router.put('/questions/:id/collect', collectQuestion)
router.delete('/questions/:id/collect', cancelCollect)

export default router

export const defaultPath = ['/api/token']
