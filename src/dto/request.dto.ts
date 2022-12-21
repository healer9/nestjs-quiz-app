import { Type } from "class-transformer";
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsNumberString, ValidateNested } from "class-validator";
import { GenderType, QuestionType } from "src/enums/app.enum";


export class CreateUserDto {

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    email: string;

    @IsNumberString()
    mobileNumber: string;

    @IsNotEmpty()
    password: string;

    @IsEnum(GenderType)
    gender: GenderType;

    @IsNotEmpty()
    dateOfBirth: string;

}


export class CreateQuizDto {

    @IsNotEmpty()
    quizName: string;

    @IsNotEmpty()
    description: string;

    @IsNumber()
    totalMarks: number;

    @ValidateNested({ each: true })
    @Type(() => CreateQuestionDto)
    questions: CreateQuestionDto[];

}


export class CreateQuestionDto {

    @IsNotEmpty()
    questionStatement: string;

    @IsNumber()
    difficulty: number;

    @IsNumber()
    marks: number;

    @IsNumber()
    negativeMarks: number;

    @IsEnum(QuestionType)
    type: QuestionType;  // multi-correct or single-correct

    @ValidateNested({ each: true })
    @Type(() => CreateOptionDto)
    options: CreateOptionDto[];

}


export class CreateOptionDto {

    @IsNotEmpty()
    optionStatement: string;

    @IsBoolean()
    correct: boolean;

}


export class ValidateUserDto {

    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

}


export class FetchQuestionDto {

    @IsNotEmpty()
    quizId: string;

    @IsNumber()
    questionNumber: number;

    @IsEmail()
    email: string;

    response: [];

}


export class StartQuiz {

    @IsNotEmpty()
    quizId: string;

    @IsNotEmpty()
    email: string;
}


export class EmailDto {

    @IsNotEmpty()
    quizId: string;

    to: [];

}


export class UserInfoDto {

    @IsEmail()
    email: string;

}


