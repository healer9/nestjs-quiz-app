import { Body, Controller, Get, Logger, Param, Post, Query, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateQuizDto, FetchQuestionDto, StartQuiz } from "src/dto/request.dto";
import { RequestIntercepter } from "src/intercepter/request.intercepter";
import { QuizService } from "./quiz.service";

@UseInterceptors(RequestIntercepter)
@Controller("api/v1/quiz/")
export class QuizController {

    constructor(private readonly quizService : QuizService) {}

    @Post("create")
    @UsePipes(new ValidationPipe({ transform: true }))
    async createQuiz(@Body() createQuizDto : CreateQuizDto) {
        Logger.log('[QuizController][createQuiz]: ', createQuizDto);
        return this.quizService.createQuiz(createQuizDto);
    }

    @Post("details")
    @UsePipes(new ValidationPipe({ transform: true }))
    async quizInfo(@Body() id: any) {
        Logger.log(id)
        return this.quizService.quizInfo(id.quizId);
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
