import { uuid } from 'uuidv4';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '../../dtos/IFindAllProvidersDTO';

class FakeUsersRepository implements IUsersRepository {
    private users: User[] = [];

    public async findById(id: string): Promise<User | undefined> {
        const findUser = this.users.find(user => user.id === id);
        return findUser;
    }

    public async findAllProviders({
        except_user_id,
    }: IFindAllProvidersDTO): Promise<User[]> {
        const providers = this.users.filter(user => user.id !== except_user_id);
        return providers;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const findUser = this.users.find(user => user.email === email);
        return findUser;
    }

    public async create({
        name,
        email,
        password,
    }: ICreateUserDTO): Promise<User> {
        const user = new User();
        Object.assign(user, {
            id: uuid(),
            name,
            email,
            password,
        });
        this.users.push(user);
        return user;
    }

    public async save(user: User): Promise<User> {
        const findIdex = this.users.findIndex(
            findUser => findUser.id === user.id,
        );
        this.users[findIdex] = user;

        return user;
    }
}

export default FakeUsersRepository;
