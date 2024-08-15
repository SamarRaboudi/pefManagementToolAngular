import { Candidate } from "./candidate.model";
import { EvaluationLine } from "./evaluationLine.model";

export class Evaluation{
    constructor(
        public id?:number,
        public isActive?:boolean ,
        public evaluationDay?:Date ,
        public candidate?: Candidate,
        public evaluationLines?: EvaluationLine[],
        ){

    }
}