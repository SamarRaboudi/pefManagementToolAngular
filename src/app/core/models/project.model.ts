import { Technology } from './technology.model';
import { User } from './user.model';

export class Project{
    constructor(
        public id?:number,
        public title?:string ,
        public context?: string,
        public missions?:string[] ,
        public technologies?: Technology[],
        public supervisor?: User[],
        public requirements?: string[],
        public isActive?:boolean ,
        public githubRepostoryLink?:string,
        ){

    }
}