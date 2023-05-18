import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { config } from 'dotenv'
import { Todo } from 'src/todo/todo.entity'
import { TodoDto } from 'src/todo/request/updateTodo'
import { TODO_NOT_FOUND, TODO_WITH_THE_SAME_TITLE_AND_DESCRIPTION_ALREADY_EXISTS } from 'src/todo/todo.constants'
import { PaginationDto } from 'src/todo/request/pagination'
import { UserService } from 'src/user/user.service'


config()

@Injectable()
export class TodoService {
	constructor(
		@InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
		private readonly userSrv: UserService
	) {
	}

	async getAllUsersTodo(id: number, { page, limit }: PaginationDto): Promise<Todo[]> {
		return this.todoRepository.find(
			{
				where: { author: { id } },
				skip: (page - 1) * limit,
				take: limit,
				relations: [ 'author' ]
			}
		)
	}

	async addTodo(userId: number, todoDto: TodoDto): Promise<Todo> {
		const user = await this.userSrv.findOne({ where: { id: userId }, relations: [ 'todo' ] })
		const isExists = user.todo.some(todo => (todo.title === todoDto.title && todo.description === todoDto.description))

		if (isExists) {
			throw new ConflictException(TODO_WITH_THE_SAME_TITLE_AND_DESCRIPTION_ALREADY_EXISTS)
		} else {
			const newTodo = this.todoRepository.create(todoDto)
			newTodo.author = user
			return this.todoRepository.save(newTodo)
		}
	}

	async editTodo(userId: number, todoId, todoDto: TodoDto): Promise<Todo> {
		try {
			const user = await this.userSrv.findOne({ where: { id: userId }, relations: [ 'todo' ] })
			const isExists = user.todo.some(
				todo => (
					todo.title === todoDto.title &&
					todo.description === todoDto.description &&
					todo.id !== todoId &&
					todo.isDone === todoDto.isDone)
			)

			if (isExists) {
				throw new ConflictException(TODO_WITH_THE_SAME_TITLE_AND_DESCRIPTION_ALREADY_EXISTS)
			} else {
				try {
					await this.todoRepository.update(todoId, { ...todoDto })
					return this.todoRepository.findOne({ where: { id: todoId } })
				} catch (e) {
					console.log(e.message)
				}
			}
		} catch (e) {
			console.log('FUCK', e.message)
		}
	}

	async deleteTodo(userId: number, todoId: number): Promise<Todo> {
		const deleteCandidate = await this.todoRepository.findOne(
			{
				where: { id: todoId },
				relations: [ 'author' ]
			})

		if (deleteCandidate) {
			if (deleteCandidate.author.id === userId) {
				await this.todoRepository.remove(deleteCandidate)
				return { ...deleteCandidate, id: todoId }
			} else {
				throw new ForbiddenException()
			}
		} else {
			throw new NotFoundException(TODO_NOT_FOUND)
		}
	}
}
