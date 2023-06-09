import { CompanyNotFoundError } from '../../errors'
import { type CompanyModel } from '../../models/company'
import { UserRoles, type UserModelResponseWithoutPassword } from '../../models/user'
import { type CompanyRepository } from '../../protocols/repositories/company-repository'

export class GetCompanyByIdUseCase {
  constructor (
    private readonly companyRepository: CompanyRepository
  ) {}

  async get (companyId: string, user: UserModelResponseWithoutPassword): Promise<CompanyModel> {
    if (user.role === UserRoles.Admin && companyId !== user.companyId) {
      throw new CompanyNotFoundError()
    }
    const company = await this.companyRepository.getById(companyId)
    if (!company) throw new CompanyNotFoundError()

    return company
  }
}
