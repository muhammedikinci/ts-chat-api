import IUser from "../model/IUser"

interface IUserRepository {
    findByUsernameAndPassword(username: string, password: string): Promise<IUser | null>
    registerUser(username: string, password: string): Promise<IUser | null>
    findByUserName(username: string): Promise<IUser | null>
    getAllUsers(): Promise<IUser[]>
    setActive(username: string, active: boolean): Promise<boolean>
}

export default IUserRepository