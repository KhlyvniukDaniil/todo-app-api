import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNumber, IsPhoneNumber, IsString } from 'class-validator'
import { Column } from 'typeorm'

export class UserDataResponse {
	@ApiProperty()
	@IsString()
	token: string

	@ApiProperty()
	@IsNumber()
	id: number

	@ApiProperty()
	@IsString()
	@Column({ nullable: false })
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
}

export class UserFullDataResponse extends UserDataResponse {
	@ApiProperty()
	@IsString()
	password: string
}
