import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


export type AttemptDocument = HydratedDocument<Attempt>;


export class userResponse {

    @Prop()
    questionNumber: number;

    @Prop()
    correct: boolean;

    @Prop()
    optionSelected: string[];

    @Prop()
    difficulty: number;

    @Prop()
    questionStatement: string;

    @Prop()
    currentScore: number

}

@Schema()
export class Attempt {
    
    @Prop({ required: true })   
    email: string;

    @Prop({ required: true })
    score: number;

    @Prop({ required: true })
    quizId: string;

    @Prop({ required: true })
    quizName: string;

    @Prop()
    response: userResponse[];

}


export const AttemptSchema = SchemaFactory.createForClass(Attempt);
