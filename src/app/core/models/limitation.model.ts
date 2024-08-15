import { Candidate } from './candidate.model';
import { Session } from './session.model';
import { User } from './user.model';

export class Limitation{
    constructor(
        public id?:number,
        public name?:string,
        public isActive?:boolean ,
        public candidates?: Candidate[],
        public users?: User[],
        public session?: Session
        ){

    }
}