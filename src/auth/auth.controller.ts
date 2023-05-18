import {
	BadRequestException,
	Body,
	ConflictException,
	Controller,
	Post,
	Request,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common'
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator'
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { UserDataResponse } from 'src/user/response/userDataResponse'
import { AuthService } from 'src/auth/auth.service'
import { SignInRequest } from 'src/auth/request/signInRequest'
import { SignUpRequest } from 'src/auth/request/signUpRequest'
import { API_TAG, SIGNUP_USER, USER_SIGN_IN, USER_SIGNED_IN, USER_WAS_REGISTERED, } from 'src/auth/auth.constants'


@Controller(API_TAG)
@ApiTags(API_TAG)
export class AuthController {
	constructor(private authSrv: AuthService) {
	}

	@UseGuards(AuthGuard('local'))
	@Post('login')
	@ApiOperation({ summary: USER_SIGN_IN })
	@ApiOkResponse({ description: USER_SIGNED_IN, type: UserDataResponse })
	@ApiBody({ type: SignInRequest })
	@ApiException(() => BadRequestException)
	@ApiException(() => UnauthorizedException)
	login(@Request() req): Promise<UserDataResponse> {
		return this.authSrv.login(req.user)
	}

	@Post('sign-up')
	@ApiOperation({ summary: SIGNUP_USER })
	@ApiBody({ type: SignUpRequest })
	@ApiOkResponse({ description: USER_WAS_REGISTERED, type: UserDataResponse })
	@ApiException(() => BadRequestException)
	@ApiException(() => ConflictException)
	signUp(@Body() dto: SignUpRequest): Promise<UserDataResponse> {
		return this.authSrv.signUp(dto)
	}
}
