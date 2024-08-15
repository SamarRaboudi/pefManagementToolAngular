import { Evaluation } from "./evaluation.model";
import { Session } from "./session.model";
import { User } from "./user.model";

export class Campaign{
    constructor(
        public id?:number,
        public name?:string,
        public isActive?:boolean ,
        public session?:Session |number ,
        public sessionId?: number,
        public sessionName?: string,
        public startDate?:Date ,
        public endDate?:Date ,
        public isValid?:boolean ,
        public evaluations?: Evaluation[],
        public evaluators?: any[]
        ){

    }
}