import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from '../UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvder: FakeStorageProvider;
let updateUserAvatarService: UpdateUserAvatarService;

beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvder = new FakeStorageProvider();

    updateUserAvatarService = new UpdateUserAvatarService(
        fakeUsersRepository,
        fakeStorageProvder,
    );
});

describe('UpdateUserAvatar', () => {
    it(`should be able to update user's avatar`, async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            password: '123456',
            email: 'jonasfragoso@rocketseat.com.br',
        });

        const response = await updateUserAvatarService.execute({
            user_id: user.id,
            avatarFilename: '3be261484f39ff7253fe-image.png',
        });

        expect(response).toHaveProperty('avatar');
    });

    it(`should not be able to update user's avatar when user does not exists`, async () => {
        await expect(
            updateUserAvatarService.execute({
                user_id: 'non-existing-user',
                avatarFilename: '3be261484f39ff7253fe-image.png',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it(`should be able to update user's avatar when user already have an avatar`, async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            password: '123456',
            email: 'jonasfragoso@rocketseat.com.br',
        });

        const deleteFile = jest.spyOn(fakeStorageProvder, 'deleteFile');

        await updateUserAvatarService.execute({
            user_id: user.id,
            avatarFilename: '3be261484f39ff7253fe-image.png',
        });
        const response = await updateUserAvatarService.execute({
            user_id: user.id,
            avatarFilename: 'updated-image.png',
        });

        expect(response).toHaveProperty('avatar');
        expect(deleteFile).toHaveBeenCalledWith(
            '3be261484f39ff7253fe-image.png',
        );
        expect(response.avatar).toBe('updated-image.png');
    });
});
