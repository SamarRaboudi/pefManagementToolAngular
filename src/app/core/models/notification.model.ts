import { User } from './user.model';

export class Notification{
    constructor(
        public id?:number,
        public content?:any,
        public status?:boolean ,
        public sendingDate?:string ,
        public users?: User,
        public isActive?:boolean ,
        public isSeen?:boolean ,
        public isclicked?:boolean ,
        ){

    }
}