import { Container } from 'inversify';

import { IConfigService } from '../config/config.service.interface';
import { UserModel } from '../generated/prisma/client';
import { TYPES } from '../types';

import { UserLoginDto } from './dto/user-login.dto';
import { User } from './user.entity';
import { IUsersRepository } from './users.repository.interface';
import { UsersService } from './users.service';
import { IUsersService } from './users.service.interface';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersService: IUsersService;

let createdUser: UserModel | null;

beforeAll(() => {
	container.bind<IUsersService>(TYPES.UsersService).to(UsersService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
	usersService = container.get<IUsersService>(TYPES.UsersService);
});

describe('User Service', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		usersRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);
		createdUser = await usersService.createUser({
			email: 'test@mail.com',
			name: 'John',
			password: '123456',
		});
		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('123456');
	});
	it('validateUser - success', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const validation = await usersService.validateUser({
			email: 'test@mail.com',
			password: '123456',
		});
		expect(validation).toBeTruthy();
	});
	it('validateUser - failed by email', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(null);
		const validation = await usersService.validateUser({
			email: 'test@mail.com',
			password: '123456',
		});
		expect(validation).toEqual(false);
	});
	it('validateUser - failed by password', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const validation = await usersService.validateUser({
			email: 'test@mail.com',
			password: '654321',
		});
		expect(validation).toBeFalsy();
	});
});
