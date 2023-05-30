import { Express, Router } from 'express'
import { adaptRoute } from '../adapters/express-adapter'
import { makeCreateCompanyFactory } from '../factories/create-company-factory'

export default (app: Express): void => {

    const router = Router()
    app.use('/', router)
    app.use('/', router)
    router.post('/company', adaptRoute(makeCreateCompanyFactory()))
  }