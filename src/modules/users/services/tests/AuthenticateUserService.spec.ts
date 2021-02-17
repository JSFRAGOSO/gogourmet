import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';

import FakeHashProvider from '../../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from '../AuthenticateUserService';
import CreateUserService from '../CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUser: CreateUserService;
let authenticateUserService: AuthenticateUserService;

beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    createUser = new CreateUserService(
        fakeUsersRepository,
        fakeHashProvider,
        fakeCacheProvider,
    );
    authenticateUserService = new AuthenticateUserService(
        fakeUsersRepository,
        fakeHashProvider,
    );
});

describe('AuthenticateUser', () => {
    it('should be able to authenticate', async () => {
        const user = await createUser.execute({
            name: 'Jonh Doe',
            email: 'johndoe@email.com.br',
            password: '123456',
        });

        const response = await authenticateUserService.execute({
            email: 'johndoe@email.com.br',
            password: '123456',
        });

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });

    it('should not be able to authenticate an user with invalid e-mail', async () => {
        expect(
            authenticateUserService.execute({
                email: 'invaliduser@email.com.br',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate an user with invalid password', async () => {
        await createUser.execute({
            name: 'Jonh Doe',
            email: 'johndoe@email.com.br',
            password: '123456',
        });

        await expect(
            authenticateUserService.execute({
                email: 'johndoe@email.com.br',
                password: '12345',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
