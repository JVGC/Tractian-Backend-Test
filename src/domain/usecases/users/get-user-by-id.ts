import { removeUserPasswordAdapter } from '../../adapters/user-adapter'
import { UserNotFoundError } from '../../errors'
import { UserRoles, type UserModelResponseWithoutPassword } from '../../models/user'
import { type UserRepository } from '../../protocols/repositories/user-repository'

export class GetUserByIdUseCase {
  constructor (
    private readonly userRepository: UserRepository
  ) {}

  async get (userId: string, loggedUser: UserModelResponseWithoutPassword): Promise<UserModelResponseWithoutPassword> {
    const user = await this.userRepository.getById(userId)
    if (!user) throw new UserNotFoundError()
    if (loggedUser.role !== UserRoles.SuperAdmin && user.companyId !== loggedUser.companyId) { throw new UserNotFoundError() }
    return removeUserPasswordAdapter(user)
  }
}
