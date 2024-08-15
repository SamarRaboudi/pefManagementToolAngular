import { User } from "./user.model";

export class EvaluationLine{
    constructor(
        public id?:number,
        public isActive?:boolean ,
        public evaluator?: User,
        ){

    }
}