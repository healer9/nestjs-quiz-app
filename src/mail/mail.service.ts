import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { EmailDto } from 'src/dto/request.dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendQuizInvitationn(emailDto: EmailDto) {
    const url = `localhost:3000/api/v1/quiz/${emailDto.quizId}`;
    Logger.log(url)
    Logger.log(emailDto.to)
    const response =  await this.mailerService.sendMail({
      to: emailDto.to,
      from: emailDto.from, 
      subject: 'Quiz Invitation',
      template: './invitation', 
      context: { // ✏️ filling curly brackets with content
        url,
      },
    });

    if(response) {
        return {success: true, message: 'Invitation link send successfully'}
    }
  }
}
