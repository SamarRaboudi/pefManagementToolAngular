import { Candidate } from './candidate.model';
import { InterviewLine } from "./interviewLine.model";

export class Interview{
    constructor(
        public id?:number,
        public interviewDay?:string,
        public interviewTime?:string | null,
        public isActive?:boolean ,
        public candidate?: Candidate,
        public interviewLines?: InterviewLine[],
        public users?: number[],
        ){

    }
}