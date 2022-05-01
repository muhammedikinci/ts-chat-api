import IUserRepository from "./IUserRepository";

class UserRepository implements IUserRepository {
    findByUsernameAndPassword(username: string, password: string) {
        return true
    }
    
}

export default UserRepository