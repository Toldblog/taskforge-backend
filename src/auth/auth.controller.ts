import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  Patch,
  UseGuards,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SignUpCredentialsDto,
  SignInDto,
  UpdatePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dtos/index';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { User } from '@prisma/client';
import { GetUser } from './decorators/get-user.decorator';
import { JwtAuthGuard } from './auth.guard';
// import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signUp(
    @Body()
    authCredentialsDto: SignUpCredentialsDto,
  ): Promise<any> {
    return this.authService.signUp(authCredentialsDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() authDto: SignInDto): Promise<any> {
    return this.authService.signIn(authDto);
  }

  @Patch('update-password')
  @UseGuards(JwtAuthGuard)
  updatePassword(
    @GetUser() user: User,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<any> {
    return this.authService.updatePassword(user.id, updatePasswordDto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<any> {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Patch('reset-password/:token')
  resetPassword(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<any> {
    return this.authService.resetPassword(token, resetPasswordDto);
  }
}
