import { Body, Controller, Get, Logger, Param, Post, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateQuizDto, FetchQuestionDto, StartQuiz } from "src/dto/request.dto";
import { QuizService } from "./quiz.service";


@Controller("api/v1/quiz/")
export class QuizController {

    constructor(private readonly quizService : QuizService) {}

    @Post("create")
    @UsePipes(new ValidationPipe({ transform: true }))
    async createQuiz(@Body() createQuizDto : CreateQuizDto) {
        Logger.log('[QuizController][createQuiz]: ', createQuizDto);
        return this.quizService.createQuiz(createQuizDto);
    }

    @Get(":id")
    @UsePipes(new ValidationPipe({ transform: true }))
    async quizInfo(@Param('id') id: string) {
        return this.quizService.quizInfo(id);
    }


    @Post("start")
    @UsePipes(new ValidationPipe({ transform: true }))
    async startQuiz(@Body() request: StartQuiz) {
        return this.quizService.startQuiz(request);
    }


    @Post("next-question")
    @UsePipes(new ValidationPipe({ transform: true }))
    async nextQuestion(@Body() request: FetchQuestionDto) {
        Logger.log('[QuizController][fetchQuestion]: ', request);
        return this.quizService.fetchQuestion(request);
    }


}
