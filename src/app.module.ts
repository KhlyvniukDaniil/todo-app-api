import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from 'src/user/user.module'
import { AuthModule } from 'src/auth/auth.module'
import { configService } from 'src/config/config.service'
import { TodoModule } from 'src/todo/todo.module'


@Module({
	imports: [
		TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
		AuthModule,
		UserModule,
		TodoModule
	],
	controllers: [],
	providers: []
})
export class AppModule {
}
