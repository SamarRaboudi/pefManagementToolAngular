import { Profil } from './profil.model';

export class User{
    constructor(
        public id?:number,
        public email?:string ,
        public roles?: string[],
        public password?:string ,
        public picture?:string ,
        public prenom?:string ,
        public nom?:string,
        public isActive?:boolean ,
        public profils?: Profil[]
        ){

    }
}