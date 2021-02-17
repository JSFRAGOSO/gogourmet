import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);
    if (!user)
      throw new AppError('Only authenticated users can change profile', 401);

    const userEmailExists = await this.usersRepository.findByEmail(email);

    if (userEmailExists && user.email !== email)
      throw new AppError('This e-mail is already in use', 400);

    user.name = name;
    user.email = email;

    if (password && !old_password)
      throw new AppError(
        'To update the password you must provide the old one',
        400,
      );

    if (password && old_password) {
      const passwordMatch = await this.hashProvider.compare(
        old_password,
        user.password,
      );

      if (!passwordMatch)
        throw new AppError('Old password does not match', 400);

      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
