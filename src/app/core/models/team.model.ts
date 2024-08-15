import { Project } from './project.model';
import { Session } from './session.model';
import { Candidate } from './candidate.model';

export class Team{
    constructor(
        public id?:number,
        public name?:string,
        public isActive?:boolean ,
        public projects?: Project[],
        public project?: Project,
        public candidates?: Candidate[],
        public session?: Session,
        public size?:number,
        ){

    }
}