import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Attempt, AttemptSchema } from "src/entity/attempt.entity";
import { Quiz, QuizSchema } from "src/entity/quiz.entity";
import { QuizController } from "./quiz.controller";
import { QuizService } from "./quiz.service";

@Module({
    imports: [MongooseModule.forFeature([{ name: Quiz.name, schema: QuizSchema }]),
        MongooseModule.forFeature([{ name: Attempt.name, schema: AttemptSchema }])
],
    controllers: [QuizController],
    providers: [QuizService]
})
export class QuizModule{}
