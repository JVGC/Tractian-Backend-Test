import { UserRoles } from '@prisma/client'
import expressApp from '../../main/express/setup-express'

import request from 'supertest'
import { FactoryCompany } from '../factories/company'
import { FactoryUser } from '../factories/user'

describe('List Companies Tests', () => {
  describe('Given an Authenticated User', () => {
    let adminUser: FactoryUser,
      superAdminUser: FactoryUser,
      company: FactoryCompany

    beforeAll(async () => {
      company = await FactoryCompany.create({})

      const users = await Promise.all([
        FactoryUser.create({ companyId: company.id, role: UserRoles.Admin }),
        FactoryUser.create({ companyId: company.id, role: UserRoles.SuperAdmin })]
      )
      adminUser = users[0]
      superAdminUser = users[1]

      await Promise.all([adminUser.login(), superAdminUser.login()])
    })
    afterAll(async () => {
      // TODO: Simplificar com o Promise.all
      await Promise.all([adminUser.delete(), superAdminUser.delete()])
      await company.delete()
    })
    describe('When he is a SuperAdmin',() => {
      describe("And there is only the user's company", () => {
        it('should return the company', async () => {
          const response = await request(expressApp).get('/company')
            .set('Authorization', `Bearer ${superAdminUser.token}`)

          expect(response.statusCode).toBe(200)
          expect(response.body.length).toBe(1)
          expect(response.body[0].id).toBe(company.id)
        })
      })
      describe('And there is at least 2 companies', () => {
        it('should return all the companies in the database', async () => {
          const newCompany = await FactoryCompany.create({})
          const response = await request(expressApp).get('/company')
            .set('Authorization', `Bearer ${superAdminUser.token}`)

          expect(response.statusCode).toBe(200)
          expect(response.body.length).toBe(2)
          expect(response.body[0].id).toBe(company.id)
          expect(response.body[1].id).toBe(newCompany.id)

          await newCompany.delete()
        })
      })
    })
    describe('When he is not an SuperAdmin', () => {
      it('should return an forbidden error', async () => {
        const response = await request(expressApp).get('/company')
          .set('Authorization', `Bearer ${adminUser.token}`)

        expect(response.statusCode).toBe(403)
      })
    })
  })
  describe('Given an Unauthenticated User', () => {
    it('should return an unauthorized error', async () => {
      const response = await request(expressApp).get('/company')

      expect(response.statusCode).toBe(401)
    })
  })
})
