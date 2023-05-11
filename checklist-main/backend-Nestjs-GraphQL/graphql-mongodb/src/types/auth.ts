import { Request } from "express"
import { User } from "src/users/user.model"

export interface AuthRequest extends Request {
    user:User
}

export interface payload {
    checklistuser:string,
    iat:number, // indate
    exp:number, // expiredate
    upa: string // userupdate
}

export interface UserInterface {
    id : string;
    fullname: string;
    location_id:number;
    role: "BM" | "RM" | "AM" | "Admin";
    updatedAt: string;
    username: string;
}

