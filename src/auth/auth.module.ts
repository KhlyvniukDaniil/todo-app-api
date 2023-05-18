import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from 'src/auth/auth.constants'
import { UserModule } from 'src/user/user.module'
import { AuthController } from 'src/auth/auth.controller'
import { AuthService } from 'src/auth/auth.service'
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy'
import { LocalStrategy } from 'src/auth/strategies/local.strategy'


@Module({
	imports: [
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.register({ secret: jwtConstants.secret }),
		UserModule,
	],
	controllers: [ AuthController ],
	providers: [ AuthService, JwtStrategy, LocalStrategy ],
	exports: [ AuthService, PassportModule, JwtModule ],
})
export class AuthModule {
}
