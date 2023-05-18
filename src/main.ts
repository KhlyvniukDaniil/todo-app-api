import { NestFactory } from '@nestjs/core'
import * as dotenv from 'dotenv'
import { ValidationPipe } from '@nestjs/common'
import * as bodyParser from 'body-parser'
import { useContainer } from 'class-validator'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from 'src/app.module'


async function bootstrap() {
	dotenv.config()

	const app = await NestFactory.create(AppModule, { cors: true })

	app.useGlobalPipes(new ValidationPipe({ transform: true }))
	app.use(bodyParser.json({ limit: '50mb' }))
	app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
	useContainer(app.select(AppModule), { fallbackOnErrors: true })

	const options = new DocumentBuilder()
		.setTitle('todo app')
		.setDescription('todo app API description')
		.setVersion('1.0')
		.addTag('')
		.addBearerAuth(
			{
				description: '[just text field] Please enter token in following format: Bearer <JWT>',
				name: 'Authorization',
				bearerFormat: 'Bearer',
				scheme: 'Bearer',
				type: 'http',
				in: 'Header',
			},
			'access-token',
		)
		.build()
	const document = SwaggerModule.createDocument(app, options)
	SwaggerModule.setup('api', app, document)

	await app.listen(process.env.APP_PORT || 8080, () => {
		console.log(process.env.APP_PORT)
	})
}

bootstrap().then()
