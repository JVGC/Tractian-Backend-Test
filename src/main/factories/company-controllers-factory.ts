import { CreateCompanyUseCase } from '../../domain/usecases/companies/create-company'
import { DeleteCompanyByIdUseCase } from '../../domain/usecases/companies/delete-company'
import { GetCompanyByIdUseCase } from '../../domain/usecases/companies/get-company-by-id'
import { ListCompaniesUseCase } from '../../domain/usecases/companies/list-companies'
import { UpdateCompanyUseCase } from '../../domain/usecases/companies/update-company'
import { PrismaCompanyRepository } from '../../infra/prisma/repositories/prisma-company-repository'
import { CreateCompanyController } from '../../presentation/controllers/companies/create-company-controller'
import { DeleteCompanyByIdController } from '../../presentation/controllers/companies/delete-company-by-id-controller'
import { GetCompanyByIdController } from '../../presentation/controllers/companies/get-company-by-id-controller'
import { ListCompaniesController } from '../../presentation/controllers/companies/list-companies-controller'
import { UpdateCompanyController } from '../../presentation/controllers/companies/update-company-controller'
import { ZodValidator } from '../../presentation/helpers/zod-validator'
import { zodCreateCompanyObject, zodUpdateCompanyObject } from '../../presentation/helpers/zod-validators/companies'

export const makeCreateCompany = (): CreateCompanyController => {
  const prismaCompanyRepository = new PrismaCompanyRepository()
  const createCompanyUseCase = new CreateCompanyUseCase(prismaCompanyRepository)
  const zodCreateCompanyValidator = new ZodValidator(zodCreateCompanyObject)
  return new CreateCompanyController(createCompanyUseCase, zodCreateCompanyValidator)
}

export const makeGetCompanyById = (): GetCompanyByIdController => {
  const prismaCompanyRepository = new PrismaCompanyRepository()
  const getCompanyByIdUseCase = new GetCompanyByIdUseCase(prismaCompanyRepository)
  return new GetCompanyByIdController(getCompanyByIdUseCase)
}

export const makeListCompanies = (): ListCompaniesController => {
  const prismaCompanyRepository = new PrismaCompanyRepository()
  const listCompaniesUseCase = new ListCompaniesUseCase(prismaCompanyRepository)
  return new ListCompaniesController(listCompaniesUseCase)
}

export const makeDeleteCompanyById = (): DeleteCompanyByIdController => {
  const prismaCompanyRepository = new PrismaCompanyRepository()
  const deleteCompanyByIdUseCase = new DeleteCompanyByIdUseCase(prismaCompanyRepository)
  return new DeleteCompanyByIdController(deleteCompanyByIdUseCase)
}

export const makeUpdateCompany = (): UpdateCompanyController => {
  const prismaCompanyRepository = new PrismaCompanyRepository()
  const updateCompanyUseCase = new UpdateCompanyUseCase(prismaCompanyRepository)
  const zodUpdateCompanyValidator = new ZodValidator(zodUpdateCompanyObject)
  return new UpdateCompanyController(updateCompanyUseCase, zodUpdateCompanyValidator)
}
