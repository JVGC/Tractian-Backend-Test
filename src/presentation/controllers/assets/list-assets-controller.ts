import { type UserModelResponseWithoutPassword } from '../../../domain/models/user'
import { type ListAssetsUseCase } from '../../../domain/usecases/asset/list-assets'
import { ok, serverError } from '../../helpers/http-helper'
import { type Controller } from '../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'

export class ListAssetsController implements Controller {
  constructor (
    private readonly listAssetsUseCase: ListAssetsUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const loggedUser = httpRequest.loggedUser as UserModelResponseWithoutPassword
      const result = await this.listAssetsUseCase.list(loggedUser)
      return ok(result)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
