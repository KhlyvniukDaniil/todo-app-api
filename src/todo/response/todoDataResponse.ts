import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsDateString, IsNumber, IsString } from 'class-validator'
import { User } from 'src/user/user.entity'


export class TodoDataResponse {
	@ApiProperty()
	@IsNumber()
	id: number

	@ApiProperty({ type: () => User })
	author: User

	@ApiProperty()
	@IsString()
	title: string

	@ApiProperty()
	@IsString()
	description: string

	@ApiProperty()
	@IsBoolean()
	isDone: boolean

	@ApiProperty()
	@IsDateString()
	createdAt: Date

	@ApiProperty()
	@IsDateString()
	updatedAt: Date
}
