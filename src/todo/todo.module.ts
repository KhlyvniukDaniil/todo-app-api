import { Module } from '@nestjs/common'
import { TodoService } from 'src/todo/todo.service'
import { TodoController } from 'src/todo/todo.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Todo } from 'src/todo/todo.entity'
import { UserModule } from 'src/user/user.module'


@Module({
	imports: [ TypeOrmModule.forFeature([ Todo ]), UserModule ],
	providers: [ TodoService ],
	controllers: [ TodoController ],
	exports: [ TodoService ]
})
export class TodoModule {
}
