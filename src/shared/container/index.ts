import { container } from 'tsyringe';
import '@modules/users/providers/index';

import IUserToken from '@modules/users/repositories/IUserTokensRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

container.registerSingleton<IUserToken>('UserToken', UserTokensRepository);
container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);
