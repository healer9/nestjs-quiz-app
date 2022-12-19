import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { EmailDto } from 'src/dto/request.dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendQuizInvitationn(emailDto: EmailDto) {
    const url = `localhost:3000/api/v1/quiz/${emailDto.quizId}`;
    const response =  await this.mailerService.sendMail({
      to: emailDto.to,
      from: process.env.MAIL_FROM, 
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
