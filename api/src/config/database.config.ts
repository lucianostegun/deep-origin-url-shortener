import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

export const config: DataSourceOptions = {
  type: 'postgres',
  host: `${process.env.DATABASE_HOST}`,
  port: Number(process.env.DATABASE_PORT),
  username: `${process.env.DATABASE_USER}`,
  password: `${process.env.DATABASE_PASSWORD}`,
  database: `${process.env.DATABASE_NAME}`,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: false,
  subscribers: [],
};

export default registerAs('database', () => config);
export const connectionSource = new DataSource(config);
