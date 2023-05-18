import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOneOptions, Repository } from 'typeorm'
import { config } from 'dotenv'
import * as bcrypt from 'bcryptjs'
import { UserResponse } from 'src/user/types'
import {
	TOKEN_IS_NOT_VALID,
	USER_NOT_FOUND,
	USER_WITH_CURRENT_EMAIL_ALREADY_EXISTS,
	USER_WITH_CURRENT_PHONE_NUMBER_ALREADY_EXISTS,
	WRONG_PASSWORD
} from 'src/user/user.constants'
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult'
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere'
import { UpdateUserDto } from 'src/user/request/updateUser'
import { User } from 'src/user/user.entity'


config()

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private readonly usersRepository: Repository<User>
	) {
	}

	async getProfile(userId: number | null): UserResponse {
		const { password, ...user } = await this.findById(userId, {}, true)
		return user
	}

	async editProfile(id: number, dto: UpdateUserDto): UserResponse {
		await this.checkIsUserAlreadyExists(dto, id)
		const updateCandidate = await this.findById(id)

		if (!!dto?.newPassword) {
			if (
				!(await this.arePasswordsEqual(updateCandidate.password, dto.password))
			) {
				throw new BadRequestException(WRONG_PASSWORD)
			}
			const { password, ...updatedUser } = await this.save(
				new User({ ...dto, id, password: dto.newPassword })
			)
			return updatedUser
		} else {
			const { password, ...updatedUser } = await this.save(
				new User({ ...dto, id, password: updateCandidate.password })
			)
			return updatedUser
		}
	}

	async deleteProfile(id: number, password: string): Promise<User> {
		const user = await this.findById(id, {}, true)

		if (await this.arePasswordsEqual(user.password, password)) {
			await this.delete(id)
			return user
		}
		throw new BadRequestException(WRONG_PASSWORD)
	}

	async checkIsUserAlreadyExists(dto: Partial<User>, userId = -1) {
		const users = await this.usersRepository.find({
			where: [
				...(dto?.email ? [ { email: dto.email } ] : []),
				...(dto?.telephone ? [ { telephone: dto.telephone } ] : [])
			]
		})

		for (const user of users) {
			if (user.id === userId) continue
			if (dto.email === user.email)
				throw new ConflictException(USER_WITH_CURRENT_EMAIL_ALREADY_EXISTS)
			if (dto.telephone === user.telephone)
				throw new ConflictException(
					USER_WITH_CURRENT_PHONE_NUMBER_ALREADY_EXISTS
				)
		}
		return false
	}

	async arePasswordsEqual(
		hashedPassword: string,
		plainPassword: string
	): Promise<boolean> {
		return await bcrypt.compare(plainPassword, hashedPassword)
	}

	async delete(
		params: string | number | FindOptionsWhere<User>
	): Promise<DeleteResult> {
		return this.usersRepository.delete(params)
	}

	async save(user: Partial<User>): Promise<User> {
		return await this.usersRepository.save(user)
	}

	async findOne(params: FindOneOptions<User>, throwError = false): Promise<User> {
		const user = await this.usersRepository.findOne(params)

		if (!user && throwError) throw new NotFoundException(USER_NOT_FOUND)
		return user
	}

	async findById(id, params: FindOneOptions<User> = {}, throwError = false): Promise<User> {
		const user = await this.usersRepository.findOne({ ...params, where: { id } })
		if (!user && throwError) throw new NotFoundException(USER_NOT_FOUND)

		return user
	}

	authCheck(id: any) {
		if (!id) throw new UnauthorizedException(TOKEN_IS_NOT_VALID)
	}
}
