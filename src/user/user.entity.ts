import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	CreateDateColumn,
	Entity, OneToMany,
	PrimaryGeneratedColumn,
	Unique,
	UpdateDateColumn
} from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { IsEmail, IsNumber, IsString } from 'class-validator'
import { Todo } from 'src/todo/todo.entity'


@Entity('user')
@Unique([ 'email', 'telephone' ])
export class User {
	@IsNumber()
	@PrimaryGeneratedColumn()
	id: number

	@OneToMany(() => Todo, (todo) => todo.author)
	todo: Todo[]

	@IsString()
	@Column({ nullable: false })
	firstName: string

	@IsString()
	@Column({ nullable: false })
	lastName: string

	@IsEmail()
	@Column({ nullable: false, unique: true })
	email: string

	@IsString()
	@Column({ nullable: false, unique: true })
	@IsString()
	telephone: string

	@IsString()
	@Column({ nullable: false })
	password: string

	@CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
	updatedAt: Date

	constructor(partial?: Partial<User>) {
		Object.assign(this, partial)
	}

	@BeforeInsert()
	@BeforeUpdate()
	hashPassword() {
		const saltRounds = 10

		if (this.password && !!isNaN(bcrypt.getRounds(this.password))) {
			this.password = bcrypt.hashSync(this.password, saltRounds)
		}
	}
}
