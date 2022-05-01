interface IUserRepository {
    findByUsernameAndPassword(username: string, password: string): any
}

export default IUserRepository