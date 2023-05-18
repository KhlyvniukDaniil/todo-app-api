import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'


export abstract class SignUpRequest {
	@ApiProperty()
	@IsString()
	firstName: string

	@ApiProperty()
	@IsString()
	lastName: string

	@ApiProperty()
	@IsEmail()
	email: string

	@ApiProperty()
	@IsString()
	telephone: string

	@ApiProperty()
	@IsString()
	apt: string

	@ApiProperty()
	@IsString()
	password: string
}
