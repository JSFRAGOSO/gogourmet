import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import ShowProfileService from '../ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfileService = new ShowProfileService(fakeUsersRepository);
});

describe('ShowUserProfile', () => {
    it(`should be able to show the profile`, async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            password: '123456',
            email: 'johndoe@example.com',
        });

        const profile = await showProfileService.execute({ user_id: user.id });

        expect(profile.name).toBe('John Doe');
        expect(profile.email).toBe('johndoe@example.com');
    });

    it(`should not be able to show the profile of a non existing user`, async () => {
        await expect(
            showProfileService.execute({ user_id: 'non-existing-id' }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
