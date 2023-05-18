import {
	BadRequestException,
	Body,
	ConflictException,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Post,
	Put,
	Query,
	Req,
	UnauthorizedException,
	UseGuards
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { TodoService } from 'src/todo/todo.service'
import { UserService } from 'src/user/user.service'
import {
	ADD_TODO,
	API_TAG,
	DELETE_TODO,
	GET_USERS_TODO_LIST,
	TODO_EDIT,
	TODO_HAS_BEEN_DELETED,
	TODO_HAS_BEEN_EDITED,
	TODO_IS_ADDED,
	USERS_TODO_LIST
} from 'src/todo/todo.constants'
import { TodoDataResponse } from 'src/todo/response/todoDataResponse'
import { TodoDto } from 'src/todo/request/updateTodo'
import { Todo } from 'src/todo/todo.entity'


@UseGuards(JwtAuthGuard)
@Controller(API_TAG)
@ApiTags(API_TAG)
@ApiBearerAuth('token')
export class TodoController {
	constructor(
		private readonly todoSrv: TodoService,
		private readonly userSrv: UserService
	) {
	}

	@Get()
	@ApiOperation({ summary: GET_USERS_TODO_LIST })
	@ApiQuery({ name: 'limit', required: true, type: Number })
	@ApiQuery({ name: 'page', required: true, type: Number })
	@ApiOkResponse({ description: USERS_TODO_LIST, type: [ TodoDataResponse ] })
	@ApiException(() => BadRequestException)
	@ApiException(() => UnauthorizedException)
	@ApiException(() => NotFoundException)
	async getAllUsersTodo(@Req() req, @Query() paginationDto): Promise<Todo[]> {
		this.userSrv.authCheck(req?.user?.userId)
		return await this.todoSrv.getAllUsersTodo(req.user.userId, paginationDto)
	}

	@Post()
	@ApiOperation({ summary: ADD_TODO })
	@ApiOkResponse({ description: TODO_IS_ADDED, type: Todo })
	@ApiException(() => BadRequestException)
	@ApiException(() => UnauthorizedException)
	@ApiException(() => NotFoundException)
	async getProfile(@Req() req, @Body() todoDto: TodoDto): Promise<Todo> {
		this.userSrv.authCheck(req?.user?.userId)
		return await this.todoSrv.addTodo(req.user.userId, todoDto)
	}

	@Put(':todoId')
	@ApiOperation({ summary: TODO_EDIT })
	@ApiBody({ type: TodoDto })
	@ApiOkResponse({ description: TODO_HAS_BEEN_EDITED, type: Todo })
	@ApiException(() => BadRequestException)
	@ApiException(() => UnauthorizedException)
	@ApiException(() => NotFoundException)
	@ApiException(() => ConflictException)
	async editTodo(@Req() req, @Param('todoId') todoId: number, @Body() todoDto: TodoDto): Promise<Todo> {
		this.userSrv.authCheck(req?.user?.userId)
		return await this.todoSrv.editTodo(req.user.userId, todoId, todoDto)
	}

	@Delete(':todoId')
	@ApiOperation({ summary: DELETE_TODO })
	@ApiOkResponse({ description: TODO_HAS_BEEN_DELETED, type: Todo })
	@ApiException(() => BadRequestException)
	@ApiException(() => UnauthorizedException)
	@ApiException(() => NotFoundException)
	async deleteTodo(@Req() req: any, @Param('todoId') todoId: number): Promise<Todo> {
		this.userSrv.authCheck(req?.user?.userId)
		return this.todoSrv.deleteTodo(req.user.userId, todoId)
	}
}
