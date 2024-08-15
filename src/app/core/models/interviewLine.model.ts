import { User } from "./user.model";

export class InterviewLine{
    isValidated: number;
    constructor(
        public id?:number,
        public isActive?:boolean ,
        public user?: User,
        ){

    }
}