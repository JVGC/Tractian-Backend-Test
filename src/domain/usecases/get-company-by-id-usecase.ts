import { CompanyNotFoundError } from "../errors";
import { Company } from "../models/company";
import { CompanyRepository } from "../protocols/repositories/company-repository";

export class GetCompanyByIdUseCase {
    constructor(
        private readonly companyRepository: CompanyRepository
    ){}
  async get(company_id: string): Promise<Company>{
    const company = await this.companyRepository.getById(company_id)
    if(!company) throw new CompanyNotFoundError()

    return company
  }
}