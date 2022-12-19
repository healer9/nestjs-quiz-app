import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Attempt, AttemptSchema } from './entity/attempt.entity';
import { Quiz, QuizSchema } from './entity/quiz.entity';
import { User, UserSchema } from './entity/user.entity';
import { MailModule } from './mail/mail.module';
import { MailService } from './mail/mail.service';
import { QuizController } from './quiz/quiz.controller';
import { QuizModule } from './quiz/quiz.module';
import { QuizService } from './quiz/quiz.service';

@Module({
  imports: [ConfigModule.forRoot(), MongooseModule.forRoot(`mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.yae8kwe.mongodb.net/quiz?retryWrites=true&w=majority`),
          MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
          MongooseModule.forFeature([{ name: Quiz.name, schema: QuizSchema }]),
          MongooseModule.forFeature([{ name: Attempt.name, schema: AttemptSchema }]),
        QuizModule, MailModule],
  controllers: [AppController, QuizController],
  providers: [AppService, QuizService, MailService],
})
export class AppModule {}
