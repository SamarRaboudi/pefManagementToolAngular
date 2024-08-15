import { Profil } from './profil.model';

export class Criteria{
    constructor(
        public id?:number,
        public name?:string,
        public value?:number,
        public isActive?:boolean ,
        public profils?: Profil[]
        ){

    }
}