import { inject, injectable } from 'inversify';

import { IConfigService } from '../config/config.service.interface';
import { UserModel } from '../generated/prisma/client';
import { TYPES } from '../types';

import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUsersRepository } from './users.repository.interface';
import { IUsersService } from './users.service.interface';

@injectable()
export class UsersService implements IUsersService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private userRepository: IUsersRepository,
	) {}
	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, name);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));
		const existedUser = await this.userRepository.find(email);
		if (existedUser) {
			return null;
		}
		return this.userRepository.create(newUser);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.userRepository.find(email);
		if (!existedUser) {
			return false;
		}
		const user = new User(existedUser?.email, existedUser?.name, existedUser?.password);
		return user.comparePassword(password);
	}

	async getUserInfo(email: string): Promise<UserModel | null> {
		const existedUser = await this.userRepository.find(email);
		if (!existedUser) {
			return null;
		}
		return existedUser;
	}
}
