import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  fullname: { type: String, reuire: true},
  username: { type: String, require: true, unique: true, maxlength: 50 },
  password: { type: String, require: true },
  role: { type: String, require: true },
  date: { type: Number, require: true },
});

export interface User extends mongoose.Document{
    fullname: string;
    username: string;
    password: string;
    role: string;
    date: number;  
    checklistuser:any
}
