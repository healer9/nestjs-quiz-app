import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { Attempt, AttemptSchema } from "src/entity/attempt.entity";
import { Quiz, QuizSchema } from "src/entity/quiz.entity";
import { QuizController } from "./quiz.controller";
import { QuizService } from "./quiz.service";

@Module({
    imports: [JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '1h' },
            }),
        MongooseModule.forFeature([{ name: Quiz.name, schema: QuizSchema }]),
        MongooseModule.forFeature([{ name: Attempt.name, schema: AttemptSchema }])
],
    controllers: [QuizController],
    providers: [QuizService]
})
export class QuizModule{}
