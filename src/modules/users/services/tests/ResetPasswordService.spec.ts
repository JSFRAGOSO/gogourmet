import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import FakeUsersTokenRepository from '../../repositories/fakes/FakeUsersTokenRepository';
import ResetPasswordService from '../ResetPasswordService';
import FakeHashProvider from '../../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeUsersTokenRepository: FakeUsersTokenRepository;
let fakeHashProvider: FakeHashProvider;
let resetPasswordService: ResetPasswordService;

describe('ResetPassword', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUsersTokenRepository = new FakeUsersTokenRepository();
        fakeHashProvider = new FakeHashProvider();

        resetPasswordService = new ResetPasswordService(
            fakeUsersRepository,
            fakeUsersTokenRepository,
            fakeHashProvider,
        );
    });

    it('should be able to reset password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@mail.com',
            password: '123456',
        });

        const userToken = await fakeUsersTokenRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        await resetPasswordService.execute({
            token: userToken.token,
            password: '1234567',
        });

        const updatedUser = await fakeUsersRepository.findById(user.id);

        expect(updatedUser?.password).toBe('1234567');
        expect(generateHash).toHaveBeenCalledWith('1234567');
    });

    it('should not be able to reset password with a non-existing token', async () => {
        await expect(
            resetPasswordService.execute({
                token: 'non-existing-token',
                password: '1234567',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset password with a non-existing user', async () => {
        const { token } = await fakeUsersTokenRepository.generate(
            'non-existing-user-id',
        );
        await expect(
            resetPasswordService.execute({
                token,
                password: '1234567',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset password with an expired token', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@mail.com',
            password: '123456',
        });

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const costumDate = new Date();

            return costumDate.setHours(costumDate.getHours() + 3);
        });

        const { token } = await fakeUsersTokenRepository.generate(user.id);

        await expect(
            resetPasswordService.execute({
                token,
                password: '1234567',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
