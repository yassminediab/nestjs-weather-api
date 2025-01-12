import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  private readonly logger = new Logger(AuthService.name);

  async register(username: string, password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);
    if( await this.userRepository.findOne({where: {username}})) {
      this.logger.error(`username is duplicated ${username}`);
      throw new BadRequestException('username is duplicated');
    }
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });
    await this.userRepository.save(user);
    this.logger.debug(`user registered successfully ${user}`);
  }

  async login(username: string, password: string): Promise<{ token: string }> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user || !(await user.validatePassword(password))) {
      this.logger.error(`user not exists or password wrong ${user}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username, sub: user.id };
    const token = this.jwtService.sign(payload);
    return { token };
  }

  getSecretKey(): string {
    return this.configService.get<string>('SECRET');
  }
}
