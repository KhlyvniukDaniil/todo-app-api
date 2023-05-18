import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { Todo } from 'src/todo/todo.entity'
import { User } from 'src/user/user.entity'


class ConfigService {
	constructor(private readonly env: { [k: string]: string | undefined }) {
	}

	public ensureValues(keys: string[]) {
		keys.forEach((k) => this.getValue(k, true))
		return this
	}

	public getTypeOrmConfig(): TypeOrmModuleOptions {
		return {
			type: 'postgres',
			synchronize: true,
			host: this.getValue('POSTGRES_HOST'),
			port: parseInt(this.getValue('POSTGRES_PORT')),
			logging: false,
			username: this.getValue('POSTGRES_USER'),
			password: this.getValue('POSTGRES_PASSWORD'),
			database: this.getValue('POSTGRES_DB'),
			entities: [ User, Todo ],
			migrationsTableName: 'migration',
			migrations: [ 'src/migration/*.ts' ],
		}
	}

	private getValue(key: string, throwOnMissing = true): string {
		const value = this.env[key]
		if (!value && throwOnMissing) {
			throw new Error(`config error - missing env.${ key }`)
		}
		return value
	}
}

const configService = new ConfigService(process.env).ensureValues([
	'POSTGRES_HOST',
	'POSTGRES_PORT',
	'POSTGRES_USER',
	'POSTGRES_PASSWORD',
	'POSTGRES_DB',
])

export { configService }
