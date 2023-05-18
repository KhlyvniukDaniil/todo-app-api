import { IsBoolean, IsOptional, IsString } from 'class-validator'
import { Column } from 'typeorm'


export abstract class TodoDto {
	@IsString()
	@Column({ nullable: false })
	title: string

	@IsString()
	@IsOptional()
	@Column({ nullable: true })
	description: string

	@IsBoolean()
	@IsOptional()
	@Column({ nullable: false, default: false })
	isDone: boolean
}
