import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { GenderType, UserType } from "src/enums/app.enum";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    
    @Prop({ required: true })   
    firstName: string;

    @Prop({ required: true })   
    lastName: string;

    @Prop({ required: true })   
    email: string;

    @Prop({ required: true})
    mobileNumber: string;

    @Prop({ required: true })   
    password: string;
    
    @Prop({ required: true })
    gender: GenderType;

    @Prop({ required: true })
    dateOfBirth: string

    @Prop({required: true})
    userType: UserType = UserType.MEMBER;

}


export const UserSchema = SchemaFactory.createForClass(User);
