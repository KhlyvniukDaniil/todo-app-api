import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { UserResponse } from 'src/user/types'
import { AuthService } from 'src/auth/auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({ usernameField: 'email', passwordField: 'password' })
	}

	async validate(email: string, password: string): UserResponse {
		const user = await this.authService.validateUser(email, password)

		if (user) return user
		throw new UnauthorizedException()
	}
}
