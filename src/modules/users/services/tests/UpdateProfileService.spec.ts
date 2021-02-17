import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from '../UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfileService = new UpdateProfileService(
        fakeUsersRepository,
        fakeHashProvider,
    );
});

describe('UpdateProfile', () => {
    it(`should be able to update the profile`, async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            password: '123456',
            email: 'jonasfragoso@rocketseat.com.br',
        });

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'John Trê',
            email: 'johntre@example.com',
        });

        expect(updatedUser.name).toBe('John Trê');
        expect(updatedUser.email).toBe('johntre@example.com');
    });

    it(`should not be able to update the email to an already existing email`, async () => {
        const firstUser = await fakeUsersRepository.create({
            name: 'John Doe',
            password: '123456',
            email: 'johndoe@example',
        });
        const secondUser = await fakeUsersRepository.create({
            name: 'John Trê',
            password: '123456',
            email: 'johntre@example',
        });

        await expect(
            updateProfileService.execute({
                user_id: secondUser.id,
                name: firstUser.name,
                email: firstUser.email,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it(`should be able to update the password`, async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            password: '123456',
            email: 'jonasfragoso@rocketseat.com.br',
        });

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'John Trê',
            email: 'johntre@example.com',
            old_password: '123456',
            password: '123123',
        });

        expect(updatedUser.password).toBe('123123');
    });

    it(`should not be able to update the password without the old password`, async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            password: '123456',
            email: 'jonasfragoso@rocketseat.com.br',
        });

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                name: 'John Trê',
                email: 'johntre@example.com',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it(`should not be able to update the password with wrong old password`, async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            password: '123456',
            email: 'jonasfragoso@rocketseat.com.br',
        });

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                name: 'John Trê',
                email: 'johntre@example.com',
                old_password: 'wrong-old-password',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it(`should not be able to update the password of a non-existing user`, async () => {
        await expect(
            updateProfileService.execute({
                user_id: 'non-existing-user-id',
                name: 'John Trê',
                email: 'johntre@example.com',
                old_password: 'wrong-old-password',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
