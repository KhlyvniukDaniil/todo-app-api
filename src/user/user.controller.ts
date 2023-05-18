import {
	BadRequestException,
	Body,
	ConflictException,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Put,
	Req,
	UnauthorizedException,
	UseGuards
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator'
import { UserResponse } from 'src/user/types'
import { UserService } from 'src/user/user.service'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import {
	API_TAG,
	DELETE_PROFILE,
	GET_USER_PROFILE_DATA,
	PROFILE_WAS_DELETED,
	USER_EDIT_PROFILE,
	USER_PROFILE,
	USER_PROFILE_WAS_EDITED
} from 'src/user/user.constants'
import { UserDataResponse } from 'src/user/response/userDataResponse'
import { UpdateUserDto } from 'src/user/request/updateUser'
import { User } from 'src/user/user.entity'


@UseGuards(JwtAuthGuard)
@Controller(API_TAG)
@ApiTags(API_TAG)
@ApiBearerAuth('token')
export class UserController {
	constructor(private readonly userSrv: UserService
	) {
	}

	@Get()
	@ApiOperation({ summary: USER_PROFILE })
	@ApiOkResponse({ description: GET_USER_PROFILE_DATA, type: UserDataResponse })
	@ApiException(() => BadRequestException)
	@ApiException(() => UnauthorizedException)
	@ApiException(() => NotFoundException)
	async getProfile(@Req() req): UserResponse {
		this.userSrv.authCheck(req?.user?.userId)
		return await this.userSrv.getProfile(req?.user?.userId)
	}

	@Put('edit')
	@ApiOperation({ summary: USER_EDIT_PROFILE })
	@ApiBody({ type: UpdateUserDto })
	@ApiOkResponse({ description: USER_PROFILE_WAS_EDITED, type: UserDataResponse })
	@ApiException(() => BadRequestException)
	@ApiException(() => UnauthorizedException)
	@ApiException(() => NotFoundException)
	@ApiException(() => ConflictException)
	async editProfile(@Req() req, @Body() updateUserDto: UpdateUserDto): UserResponse {
		this.userSrv.authCheck(req?.user?.userId)
		return await this.userSrv.editProfile(req?.user?.userId, updateUserDto)
	}

	@Delete(':password')
	@ApiOperation({ summary: DELETE_PROFILE })
	@ApiOkResponse({ description: PROFILE_WAS_DELETED, type: User })
	@ApiException(() => BadRequestException)
	@ApiException(() => UnauthorizedException)
	@ApiException(() => NotFoundException)
	async deleteProfile(@Req() req: any, @Param('password') password: string): Promise<User> {
		this.userSrv.authCheck(req?.user?.userId)
		return this.userSrv.deleteProfile(req.user.userId, password)
	}
}
