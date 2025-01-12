import { Body, Controller, Post, UseGuards, Get, UseFilters, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth-guard';
import { RegisterDto } from './dto/register-request-user.dto';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { GlobalExceptionFilter } from '../../filters/global-exception.filter';
import { TransformInterceptor } from '../../interceptors/transform.interceptor';

@Controller('users')
@UseInterceptors(TransformInterceptor)
@UseFilters(GlobalExceptionFilter)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOkResponse({
    description: 'Register successfully.',
    type: Response,
  })
  @ApiOperation({
    summary: 'Register',
    description: 'Register',
    operationId: 'Register',
  })
  async register(@Body() body: RegisterDto) {
    await this.authService.register(body.username, body.password);
    return { message: 'User registered successfully' };
  }

  @Post('login')
  @ApiOkResponse({
    description: 'Login successfully.',
    type: Response,
  })
  @ApiOperation({
    summary: 'Login',
    description: 'Login',
    operationId: 'Login',
  })
  async login(@Body() body: RegisterDto) {
    return this.authService.login(body.username, body.password);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('protected')
  // protectedRoute() {
  //   return { message: 'You have access to this route' };
  // }
}
