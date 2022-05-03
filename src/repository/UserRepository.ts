import IUser from "../model/IUser";
import User from "../model/User";
import IUserRepository from "./IUserRepository";

class UserRepository implements IUserRepository {
    async setActive(username: string, active: boolean): Promise<boolean> {
        const user = await User.findOne({ username });

        if (!user) {
            return new Promise((r) => {r(false)})
        }

        user.isActive = active
        await user.save()

        return new Promise((r) => r(true)) 
    }

    async getAllUsers(): Promise<IUser[]> {
        return await User.find<IUser>();
    }

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