import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/../modules/**/entities/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  logging: true,
});

//export const dataSourcePromise = AppDataSource.initialize();
