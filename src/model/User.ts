import { Schema, model } from 'mongoose';
import IUser from './IUser';

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, required:false, default: false }
})

const User = model<IUser>('User', UserSchema)

export default User