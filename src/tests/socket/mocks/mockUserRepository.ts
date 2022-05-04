import IUser from "../../../model/IUser";
import IUserRepository from "../../../repository/IUserRepository";

const mockUserRepository: IUserRepository = {
    findByUsernameAndPassword: function (username: string, password: string): Promise<IUser | null> {
        throw new Error("Function not implemented.");
    },
    registerUser: function (username: string, password: string): Promise<IUser | null> {
        throw new Error("Function not implemented.");
    },
    findByUserName: function (username: string): Promise<IUser | null> {
        throw new Error("Function not implemented.");
    },
    getAllUsers: function (): any {},
    setActive: function (username: string, active: boolean): any {}
}

export default mockUserRepository