import IUser from "../model/IUser";
import User from "../model/User";
import IUserRepository from "./IUserRepository";

class UserRepository implements IUserRepository {
    async findByUserName(username: string): Promise<IUser | null> {
        return await User.findOne<IUser>({ username });
    }

    async registerUser(username: string, password: string): Promise<IUser | null> {
        const user = new User({ username, password })

        return await user.save()
    }

    async findByUsernameAndPassword(username: string, password: string): Promise<IUser | null> {
        return await User.findOne<IUser>({ username, password });
    }
}

export default UserRepository