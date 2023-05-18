import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/user/user.service'
import { SignUpRequest } from 'src/auth/request/signUpRequest'
import { UserDataResponse } from 'src/user/response/userDataResponse'
import { UserResponse } from 'src/user/types'
import { User } from 'src/user/user.entity'


export const toPlainObject = (doc) => JSON.parse(JSON.stringify(doc))

@Injectable()
export class AuthService {
	constructor(private readonly usersService: UserService, private readonly jwtService: JwtService) {
	}

	async validateUser(email: string, pass: string): Promise<UserResponse | null> {
		const user = await this.usersService.findOne({ where: { email } })

		if (user) {
			const { password, ...result } = user

			if (await this.usersService.arePasswordsEqual(password, pass))
				return result
			return null
		}
		throw new UnauthorizedException()
	}

	async login({ password, ...user }: User): Promise<UserDataResponse> {
		return { ...user, token: this.jwtService.sign(toPlainObject({ id: user.id, email: user.email })) }
	}

	async signUp(dto: SignUpRequest): Promise<UserDataResponse> {
		await this.usersService.checkIsUserAlreadyExists(dto)

		const { password, ...user } = await this.usersService.save(new User(dto))
		const token = this.jwtService.sign(toPlainObject({ id: user.id, email: user.email }))

		return { ...user, token }
	}
}
