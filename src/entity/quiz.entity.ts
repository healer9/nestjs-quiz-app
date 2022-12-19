import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { QuestionType } from "src/enums/app.enum";

export type QuizDocument = HydratedDocument<Quiz>;

@Schema()
export class Options {
    
    @Prop({required: true})
    optionStatement: string;

    @Prop({required: true})
    correct: boolean;
    
}


@Schema()
export class Questions {

    @Prop({required: true})
    questionStatement: string;

    @Prop({required: true})
    difficulty: number;

    @Prop({ required: true })
    marks: number;

    @Prop({ required: true })
    negativeMarks: number;

    @Prop({required: true, type: QuestionType})
    type: QuestionType;

    @Prop({required: true, type: Options})
    options: Options[]

}


@Schema()
export class Quiz {

    @Prop({ required: true })   
    quizName:string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    totalMarks: number;

    @Prop({required: true})
    questions: Questions[]

}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
