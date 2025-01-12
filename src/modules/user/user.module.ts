import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { IsUniqueConstraint } from '../../validator/isUniqueConstraint';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Register UserRepository
  controllers: [UserController],
  providers: [UserService, IsUniqueConstraint],
  exports: [UserService],
})
export class UserModule {}
