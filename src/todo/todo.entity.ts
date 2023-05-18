import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'
import { IsBoolean, IsNumber, IsString } from 'class-validator'
import { User } from 'src/user/user.entity'


@Entity('todo')
export class Todo {
	@IsNumber()
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => User, (user) => user.todo)
	@JoinColumn()
	author: User

	@IsString()
	@Column({ nullable: false })
	title: string

	@IsString()
	@Column({ nullable: true })
	description: string

	@IsBoolean()
	@Column({ nullable: false, default: false })
	isDone: boolean

	@CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
	updatedAt: Date

	constructor(partial?: Partial<Todo>) {
		Object.assign(this, partial)
	}
}
