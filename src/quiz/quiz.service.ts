import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateOptionDto, CreateQuizDto, FetchQuestionDto, StartQuiz } from "src/dto/request.dto";
import { Attempt, userResponse } from "src/entity/attempt.entity";
import { Quiz } from "src/entity/quiz.entity";

@Injectable()
export class QuizService {

    constructor(@InjectModel(Quiz.name) private quizModel: Model<Quiz>,
        @InjectModel(Attempt.name) private attemptModel: Model<Attempt>
    ) {}


    async createQuiz(createQuizDto: CreateQuizDto) {
        const quiz = new this.quizModel(createQuizDto);
        const saveQuiz = await quiz.save();

        if(saveQuiz) {
            Logger.log(`[AppService][createUser] Quiz created successfully: ${quiz}`);
            return {success: true, quizId: saveQuiz.id};
        } else {
            Logger.error(`[AppService][createUser] While creating quiz: ${quiz}`);
            return {success: false, message: 'Error while creating quiz'};
        }
    }


    async quizInfo(id: string) {
        Logger.log(id)
        const quiz = await this.quizModel.findOne({_id: id});
        if(!quiz) {
            Logger.error(`[AppService][quizInfo] Quiz not found: ${quiz}`);
            return {success: false, message: 'Error while fetching quiz'};
        }

        const response = {
            quizName: quiz.quizName, 
            description: quiz.description, 
            totalMarks: quiz.totalMarks,
            totalQuestions: quiz.questions.length
        }

        return response;
    }

    private getNextQuestion(quiz: Quiz, questionId: number) {
        Logger.log(`Question number: ${questionId}`)
        const question = quiz.questions[questionId]
        
        const optionList = []
        Object.keys(question).forEach((key) => {
            optionList.push(question[key])
        })

        const options = optionList[5]

        const optionsToShow = []
        options.forEach((option: { optionStatement: string; }) => {
            optionsToShow.push(option.optionStatement);
        });

        return  {
            questionStatement: question.questionStatement,
            difficulty: question.difficulty,
            questionType: question.type,
            options: optionsToShow
        };
    }


    async startQuiz(request: StartQuiz) {
        const quiz = await this.quizModel.findOne({_id: request.quizId});
        if(!quiz) {
            Logger.error(`[AppService][startQuiz] Quiz not found: ${quiz}`);
            return {success: false, message: 'Error while fetching quiz'};
        }
        
        const newAttemp = {
            email: request.email,
            quizId: request.quizId,
            score: 0,
            quizName: quiz.quizName,
            response: []
        }

        const attempt = new this.attemptModel(newAttemp);
        attempt.save();

        return this.getNextQuestion(quiz, 4);
    }


    async fetchQuestion(request: FetchQuestionDto) {
        const quiz = await this.quizModel.findOne({_id: request.quizId});
        if(!quiz) {
            Logger.error(`[AppService][fetchQuestion] Quiz not found: ${request}`);
            return {success: false, message: 'Error while fetching quiz'};
        }

        const currentQuestion = quiz.questions[request.questionNumber - 1];
        const questionNumber = request.questionNumber;
        const positiveMarks = currentQuestion.marks;
        const negativeMarks = currentQuestion.negativeMarks;

        const optionList = []
        Object.keys(currentQuestion).forEach((key) => {
            optionList.push(currentQuestion[key])
        })

        const currentOptions = optionList[5];

    
        const correctOptions = []
        currentOptions.forEach((option: CreateOptionDto) => {
            if(option.correct) {
                correctOptions.push(option)
            }
        })

        // validate user-response
        let correct: boolean = true
        if(correctOptions.length !== request.response.length) {
            correct = false;
        } else {
            correctOptions.forEach((option: CreateOptionDto) => {
                if(!request.response.find(statement => statement === option.optionStatement)) {
                    correct = false;
                }
            })
        }

        const userResponse = await this.attemptModel.findOne({email: request.email});
        const attemptedQuestions = userResponse.response.length;

        if(attemptedQuestions >= 10) {
            return {result: 'fail', message: 'Quiz End'};
        }

        const selectedResponse: userResponse = {
                questionNumber: questionNumber,
                correct: correct,
                difficulty: questionNumber,
                questionStatement:  currentQuestion.questionStatement,
                optionSelected: request.response,
                currentScore: 0
            }

        if(attemptedQuestions === 0) {
            selectedResponse.currentScore = correct ? positiveMarks : negativeMarks;
        } else {
            const scoreTillNow = userResponse.response[attemptedQuestions - 1].currentScore;
            selectedResponse.currentScore = correct ? scoreTillNow + positiveMarks : scoreTillNow + negativeMarks;
        }

        userResponse.response.push(selectedResponse)
        Logger.log(correct)

        // logic to show next question
        if(correct) {
            userResponse.score = userResponse.score + positiveMarks
            if(request.questionNumber === 10) {
                userResponse.save()
                return {result: 'pass', message: 'Quiz End'};
            }
            userResponse.save()
            return this.getNextQuestion(quiz, request.questionNumber);
        } else {
            userResponse.score = userResponse.score + negativeMarks;
            if(request.questionNumber === 1) {
                userResponse.save()
                return {result: 'fail', message: 'Quiz End'};
            }
            userResponse.save()
            return this.getNextQuestion(quiz, request.questionNumber - 2);
        }
    }


}