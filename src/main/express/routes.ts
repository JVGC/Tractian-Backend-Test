import { Express, Router } from 'express'
import { adaptRoute } from '../adapters/express-adapter'
import { makeCreateAsset, makeDeleteAssetById, makeGetAssetById, makeListAssets, makeUpdateAsset } from '../factories/asset-controllers-factory'
import { makeLogin } from '../factories/auth-controllers-factory'
import { makeCreateCompany, makeDeleteCompanyById, makeGetCompanyById, makeListCompanies, makeUpdateCompany } from '../factories/company-controllers-factory'
import { makeCreateUnit, makeDeleteUnitById, makeGetUnitById, makeListUnits, makeUpdateUnit } from '../factories/unit-controllers-factory'
import { makeCreateUser, makeDeleteUserById, makeGetUserById, makeListUsers, makeUpdateUser } from '../factories/user-controllers-factory'

export default (app: Express): void => {

    const router = Router()
    app.use('/', router)

    router.post('/login', adaptRoute(makeLogin()))

    router.post('/company', adaptRoute(makeCreateCompany()))
    router.get('/company/:id', adaptRoute(makeGetCompanyById()))
    router.delete('/company/:id', adaptRoute(makeDeleteCompanyById()))
    router.get('/company', adaptRoute(makeListCompanies()))
    router.patch('/company/:id', adaptRoute(makeUpdateCompany()))

    router.post('/user', adaptRoute(makeCreateUser()))
    router.get('/user/:id', adaptRoute(makeGetUserById()))
    router.delete('/user/:id', adaptRoute(makeDeleteUserById()))
    router.get('/user', adaptRoute(makeListUsers()))
    router.patch('/user/:id', adaptRoute(makeUpdateUser()))

    router.post('/unit', adaptRoute(makeCreateUnit()))
    router.get('/unit/:id', adaptRoute(makeGetUnitById()))
    router.delete('/unit/:id', adaptRoute(makeDeleteUnitById()))
    router.get('/unit', adaptRoute(makeListUnits()))
    router.patch('/unit/:id', adaptRoute(makeUpdateUnit()))

    router.post('/asset', adaptRoute(makeCreateAsset()))
    router.get('/asset/:id', adaptRoute(makeGetAssetById()))
    router.delete('/asset/:id', adaptRoute(makeDeleteAssetById()))
    router.get('/asset', adaptRoute(makeListAssets()))
    router.patch('/asset/:id', adaptRoute(makeUpdateAsset()))
  }