export interface User {
    id?: string;
    username: string;
    firstname?:string;
}

export interface AuthPayLoad{
    clientId?:string;
    mfa?:boolean;
    userId?:string;
    user?:User;
}