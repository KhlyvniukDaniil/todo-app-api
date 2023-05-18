import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export abstract class PaginationDto {
	@ApiProperty()
	@IsNumber()
	limit

	@ApiProperty()
	@IsNumber()
	page
}
