import { UserRoles } from '@prisma/client'
import expressApp from '../../main/express/setup-express'

import request from 'supertest'
import { AccessDeniedError, UserNotFoundError } from '../../domain/errors'
import prisma from '../../infra/prisma/client'
import { FactoryCompany } from '../factories/company'
import { FactoryUser } from '../factories/user'

describe('Delete User Tests', () => {
  describe('Given an Authenticated User', () => {
    let normalUser: FactoryUser,
      adminUser: FactoryUser,
      superAdminUser: FactoryUser,
      company: FactoryCompany

    beforeAll(async () => {
      company = await FactoryCompany.create({})

      const users = await Promise.all([
        FactoryUser.create({ companyId: company.id, role: UserRoles.User }),
        FactoryUser.create({ companyId: company.id, role: UserRoles.Admin }),
        FactoryUser.create({ companyId: company.id, role: UserRoles.SuperAdmin })
      ])
      normalUser = users[0]
      adminUser = users[1]
      superAdminUser = users[2]

      await Promise.all([
        normalUser.login(),
        adminUser.login(),
        superAdminUser.login()
      ])
    })
    afterAll(async () => {
      await Promise.all([normalUser.delete(), adminUser.delete(), superAdminUser.delete()])
      await company.delete()
    })

    describe('When he is a SuperAdmin',() => {
      describe('And he wants to delete a SuperAdmin User', () => {
        it('should delete the user', async () => {
          const anotherCompany = await FactoryCompany.create({})
          const anotherUser = await FactoryUser.create({ companyId: anotherCompany.id, role: UserRoles.SuperAdmin })
          const response = await request(expressApp).delete(`/user/${anotherUser.id}`)
            .set('Authorization', `Bearer ${superAdminUser.token}`)

          expect(response.statusCode).toBe(204)
          await anotherCompany.delete()
        })
      })
      describe('And he wants to delete a user of an another company', () => {
        it('should delete the user', async () => {
          const anotherCompany = await FactoryCompany.create({})
          const anotherUser = await FactoryUser.create({ companyId: anotherCompany.id })
          const response = await request(expressApp).delete(`/user/${anotherUser.id}`)
            .set('Authorization', `Bearer ${superAdminUser.token}`)

          expect(response.statusCode).toBe(204)
          await anotherCompany.delete()
        })
      })
      describe('And the user does not exist' , () => {
        it('should return a User Not Found Error', async () => {
          const response = await request(expressApp).delete('/user/123')
            .set('Authorization', `Bearer ${superAdminUser.token}`)

          expect(response.statusCode).toBe(404)
          expect(response.body.error).toBe(new UserNotFoundError().message)
        })
      })
    })
    describe('When he is an Admin', () => {
      describe('And he wants to delete an user of its own company', () => {
        describe('And it is an Admin user', () => {
          it('should delete the user', async () => {
            const anotherAdmin = await FactoryUser.create({ companyId: company.id, role: UserRoles.Admin })
            const response = await request(expressApp).delete(`/user/${anotherAdmin.id}`)
              .set('Authorization', `Bearer ${adminUser.token}`)

            expect(response.statusCode).toBe(204)

            const findUser = await prisma.user.findUnique({ where: { id: anotherAdmin.id } })
            expect(findUser).toBeNull()
          })
        })
        describe('And it is a SuperAdmin user', () => {
          it('should return an Access Denied error', async () => {
            const response = await request(expressApp).delete(`/user/${superAdminUser.id}`)
              .set('Authorization', `Bearer ${adminUser.token}`)

            expect(response.statusCode).toBe(403)
            expect(response.body.error).toBe(new AccessDeniedError().message)
          })
        })
        describe('And it is himself', () => {
          it('should return an Access Denied error', async () => {
            const response = await request(expressApp).delete(`/user/${adminUser.id}`)
              .set('Authorization', `Bearer ${adminUser.token}`)

            expect(response.statusCode).toBe(403)
            expect(response.body.error).toBe(new AccessDeniedError().message)
          })
        })
      })
      describe('And he wants to delete an user of another company', () => {
        it('should return an User Not Found error', async () => {
          const anotherCompany = await FactoryCompany.create({})
          const anotherUser = await FactoryUser.create({ companyId: anotherCompany.id })
          const response = await request(expressApp).delete(`/user/${anotherUser.id}`)
            .set('Authorization', `Bearer ${adminUser.token}`)

          expect(response.statusCode).toBe(404)
          expect(response.body.error).toBe(new UserNotFoundError().message)

          await anotherUser.delete()
          await anotherCompany.delete()
        })
      })
    })
    describe('When he is a Normal User', () => {
      it('should return a forbidden error', async () => {
        const response = await request(expressApp).delete('/user/123')
          .set('Authorization', `Bearer ${normalUser.token}`)

        expect(response.statusCode).toBe(403)
      })
    })
  })
  describe('Given an Unauthenticated User', () => {
    it('should return an unauthorized error', async () => {
      const response = await request(expressApp).delete('/user/123')

      expect(response.statusCode).toBe(401)
    })
  })
})
