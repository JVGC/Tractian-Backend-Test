import { EmailAlreadyInUse, UserNotFoundError } from '../../../domain/errors'
import { type UpdateUserUseCase } from '../../../domain/usecases/users/update-user'
import { badRequest, notFound, ok, serverError } from '../../helpers/http-helper'
import { type Controller } from '../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'

export class UpdateUserController implements Controller {
  constructor (
    private readonly updateUserUseCase: UpdateUserUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id: userId } = httpRequest.params
      const { email, name, password, role } = httpRequest.body
      const result = await this.updateUserUseCase.update(userId, {
        email, name, password, role
      })
      return ok(result)
    } catch (error: any) {
      if (error instanceof EmailAlreadyInUse) {
        return badRequest(error)
      }
      if (error instanceof UserNotFoundError) {
        return notFound(error)
      }
      return serverError(error)
    }
  }
}
