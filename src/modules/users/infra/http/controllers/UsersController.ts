import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateUserService from '@modules/users/services/CreateUserService';

class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const createUserService = container.resolve(CreateUserService);

    console.log(request.body);
    const { name, email, password } = request.body;

    const user = await createUserService.execute({ name, email, password });

    return response.status(201).json(user);
  }
}

export default new UsersController();
