import { Body, Controller, Get, Post, Query, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto, EmailDto, UserInfoDto, ValidateUserDto } from './dto/request.dto'
import { RequestIntercepter } from './intercepter/request.intercepter';

@UseInterceptors(RequestIntercepter)
@Controller("api/v1/users/")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("signup")
  @UsePipes(new ValidationPipe({ transform: true }))
  async createUser(@Body() user : CreateUserDto) {
    return this.appService.createUser(user);
  }


  @Post("login")
  @UsePipes(new ValidationPipe({ transform: true }))
  async ValidateUser(@Body() user : ValidateUserDto) {
    return this.appService.validateUser(user);
  }

  @Post("invite")
  @UsePipes(new ValidationPipe({ transform: true }))
  async sendQuizInvitation(@Body() emailDto: EmailDto) {
    return this.appService.sendMail(emailDto);
  }

  @Get("info")
  @UseInterceptors()
  @UsePipes(new ValidationPipe({ transform: true }))
  async fetchUserInfo(@Query() email: UserInfoDto) {
    return this.appService.fetchUserInfo(email);
  }

  
}
