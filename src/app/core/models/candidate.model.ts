import { Team } from "./team.model";

export class Candidate{
    constructor(
        public id?:number,
        public firstName?:string ,
        public lastName?:string ,
        public email?:string ,
        public picture?:string ,
        public isActive?:boolean ,
        public skills?: string[],
        public team?:Team,
        ){

    }
}