import { Injectable, Logger } from '@nestjs/common';
import { EmailDto } from 'src/dto/request.dto';
import axios from 'axios';

@Injectable()
export class MailService {

  async sendQuizInvitationn(emailDto: EmailDto) {
    const url = `https://nextjs-quiz-app-seven.vercel.app/take-quiz?quizId=${emailDto.quizId}`;
    Logger.log(`[MailService]Quiz url: ${url}`)

    const headers = {
      accept: 'application/json',
      'api-key': process.env.API_KEY,
      'content-type': 'application/json'
    }

    const config = {
      headers: headers
    }

    const payload = {
      sender: {  
        name: "Anas Riyaz",
        email: process.env.MAIL_FROM
      },
      to: emailDto.to,
      subject: "Quiz Invitation",
      htmlContent:"<html><head></head><body><p>Hello,</p>Please first login, then click on the quiz link:<a href='" + url + "'>Click here to begin quiz.</a></p></body></html>"
    }

    try {
      const response = await axios.post('https://api.sendinblue.com/v3/smtp/email', payload, config)
      if(response.data) {
        return {success: true, message: 'Invitation link send successfully'};
      }
    } catch(error) {
      Logger.error(error);
      return {success: false, message: 'Error while emailing'};
    }
  }
}
