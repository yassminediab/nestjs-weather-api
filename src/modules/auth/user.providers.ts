import { DataSource } from 'typeorm';
import { Provider } from '@nestjs/common';
import { User } from './entities/user.entity';

export const userProviders: Provider[] = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (mysqlDataSource: DataSource) =>
      mysqlDataSource.getRepository(User),
    inject: ['DATA_SOURCE'],
  },
];
