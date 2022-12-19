import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto, EmailDto, UserInfoDto, ValidateUserDto } from './dto/request.dto';
import { Attempt } from './entity/attempt.entity';
import { User } from './entity/user.entity';
import { UserType } from './enums/app.enum';
import { MailService } from './mail/mail.service';

@Injectable()
export class AppService {
  
  constructor(@InjectModel(User.name) private userModel: Model<User>,
      @InjectModel(Attempt.name) private attemptModel: Model<Attempt>,
      private readonly mailService: MailService) {}

  async createUser(user: CreateUserDto) {
    const existingUser = await this.userModel.findOne({email: user.email});

    if(existingUser) {
        Logger.error(`[AppService][createUser] Email id already exists: ${user}`)
        return { success: false, message: 'Email Id already exists' };
    }

    const newUser = new this.userModel(user);
    newUser.userType = UserType.MEMBER;
  
    const hash = await this.getHashPassword(newUser.password);
    newUser.password = hash;
    const saveUser = await newUser.save();

    if(saveUser) {
      Logger.log(`[AppService][createUser] User created successfully: ${user}`)
      return {success: true, message: 'User created successfully'};
    } else {
      Logger.error(`[AppService][createUser] While creating user: ${user}`)
      return {success: false, message: 'Error while creating user'};
    }
  }
  
  private async getHashPassword(password: string) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }


  async validateUser(user : ValidateUserDto) {
    const existingUser = await this.userModel.findOne({email: user.email});

    if(!existingUser) {
        Logger.error(`[AppService][validateUser] User not exists: ${user}`)
        return { success: false, message: 'Unauthorized' };
    }

    const isMatch = await bcrypt.compare(user.password, existingUser.password);

    if(!isMatch) {
      Logger.error(`[AppService][validateUser] Password not matched: ${user}`)
      return { success: false, message: 'Unauthorized' };
    }

    var jwt = require('jsonwebtoken');
     var payload = {
      "userId": existingUser.id,
      "name": existingUser.firstName + ' ' + existingUser.lastName,
      "email": existingUser.email,
      "role": existingUser.userType,
    }
    var options = {
      "expiresIn": "1h",
    }
    var token = jwt.sign(payload, process.env.JWT_SECRET, options);

    return { success: true, token: token };
  }


  async sendMail(emailDto: EmailDto) {
    return this.mailService.sendQuizInvitationn(emailDto);
  }


  async fetchUserInfo(user: UserInfoDto) {
    const userAttempt = await this.attemptModel.findOne({email: user.email});
    if(!userAttempt) {
      Logger.error(`[AppService][fetchUserInfo] Info not found: ${userAttempt}`);
      return {success: false, message: 'Info not found'};
    }

    const scoreArray: number[] = []
    userAttempt.response.forEach(attempt => {
      scoreArray.push(attempt.currentScore);
    })

    return {
      succcess: true,
      x: scoreArray,
      finalScore: userAttempt.score
    }

  }

}
