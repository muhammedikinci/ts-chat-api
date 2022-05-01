import { expect } from "chai"
import { ErrorMessagePasswordDoesNotMatch, ErrorMessageUsernameExists, ErrorMessageUserNotFound, SuccessMessageUserAdded } from "../../api/Messages"
import UserApi from "../../api/UserApi"
import { DynamicResponse, LoginResponse, SuccessfulLoginResponse } from "../../dto/loginResponse"
import IUser from "../../model/IUser"
import User from "../../model/User"
import IUserRepository from "../../repository/IUserRepository"
import { ErrorMessageAllFieldsMustBeProvided, ErrorMessagePasswordCannotBeGreaterThen40Char, ErrorMessagePasswordCannotBeLessThen8Char, ErrorMessageUsernameCannotBeGreaterThen20Char, ErrorMessageUsernameCannotBeLessThen5Char, ErrorMessageUsernameCannotContainsSpecialChars } from "../../validator"

describe('User API Test', () => {
    const users = [
        {
            username: 'muhammed',
            password: '$2a$10$0iP0VNms/DjgofQGyrCDeO6gK.9daHgLvhiMbN9NTyzhRDHRjayi6',
            actual: '123456789'
        }
    ]

    const mockRepository: IUserRepository = {
        findByUsernameAndPassword: function (username: string, password: string): Promise<IUser | null> {
            return new Promise<any>((resolve) => resolve(null));
        },
        registerUser: function (username: string, password: string): Promise<IUser | null> {
            return new Promise<any>((resolve) => resolve(new User));
        },
        findByUserName: function (username: string): Promise<IUser | null> {
            return new Promise<any>((resolve) => {
                resolve(users.find((u) => u.username == username))
            });
        }
    }

    const userApi = new UserApi(mockRepository)

    describe('login', () => {
        describe('check fields', () => {
            it('When username and password are empty in login phase, return ErrorMessageAllFieldsMustBeProvided error message', async () => {
                const response: LoginResponse = await userApi.login("", "")
                
                expect((response as DynamicResponse).status).to.be.false
                expect((response as DynamicResponse).message).to.be.equal(ErrorMessageAllFieldsMustBeProvided);
            })
        
            it('When username length is less than by expected, return ErrorMessageUsernameCannotBeLessThen5Char error message', async () => {
                const response: LoginResponse = await userApi.login("test", "test123123123")
                
                expect((response as DynamicResponse).status).to.be.false
                expect((response as DynamicResponse).message).to.be.equal(ErrorMessageUsernameCannotBeLessThen5Char);
            })
        
            it('When password length is less than by expected, return ErrorMessagePasswordCannotBeLessThen8Char error message', async () => {
                const response: LoginResponse = await userApi.login("test123", "test")
                
                expect((response as DynamicResponse).status).to.be.false
                expect((response as DynamicResponse).message).to.be.equal(ErrorMessagePasswordCannotBeLessThen8Char);
            })
        
            it('When username length is greater than by expected, return ErrorMessageUsernameCannotBeGreaterThen20Char error message', async () => {
                const response: LoginResponse = await userApi.login("test123123123123123123", "test123123")
                
                expect((response as DynamicResponse).status).to.be.false
                expect((response as DynamicResponse).message).to.be.equal(ErrorMessageUsernameCannotBeGreaterThen20Char);
            })
        
            it('When password length is greater than by expected, return ErrorMessagePasswordCannotBeGreaterThen40Char error message', async () => {
                const response: LoginResponse = await userApi.login("test123123", "test123123123123123123123123123123123123123")
                
                expect((response as DynamicResponse).status).to.be.false
                expect((response as DynamicResponse).message).to.be.equal(ErrorMessagePasswordCannotBeGreaterThen40Char);
            })
        
            it('When username contains special characters, return ErrorMessageUsernameCannotContainsSpecialChars error message', async () => {
                const response: LoginResponse = await userApi.login("test123[123", "test1213123")
                
                expect((response as DynamicResponse).status).to.be.false
                expect((response as DynamicResponse).message).to.be.equal(ErrorMessageUsernameCannotContainsSpecialChars);
            })
        })

        it('When user could not found in database, return ErrorMessageUserNotFound error message', async () => {
            const response: LoginResponse = await userApi.login("testtest", "test123123123")
            
            expect((response as DynamicResponse).status).to.be.false
            expect((response as DynamicResponse).message).to.be.equal(ErrorMessageUserNotFound);
        })

        it('When password does not match with database hash, return ErrorMessageUserNotFound error message', async () => {
            const response: LoginResponse = await userApi.login("muhammed", "1234567890")
            
            expect((response as DynamicResponse).status).to.be.false
            expect((response as DynamicResponse).message).to.be.equal(ErrorMessagePasswordDoesNotMatch);
        })

        it('When perform successful login attempt, return token and username', async () => {
            const response: LoginResponse = await userApi.login("muhammed", "123456789")
            
            expect((response as SuccessfulLoginResponse).username != "").to.be.true
            expect((response as SuccessfulLoginResponse).token != "").to.be.true
        })
    })

    describe('register', () => {
        it('When register attempt with already exists username, return ErrorMessageUsernameExists error message', async () => {
            const response: LoginResponse = await userApi.register("muhammed", "test123123123")
            
            expect((response as DynamicResponse).status).to.be.false
            expect((response as DynamicResponse).message).to.be.equal(ErrorMessageUsernameExists);
        })

        it('When success register attempt, return success message', async () => {
            const response: LoginResponse = await userApi.register("muhammed123", "test123123123")
            
            expect((response as DynamicResponse).status).to.be.true
            expect((response as DynamicResponse).message).to.be.equal(SuccessMessageUserAdded);
        })
    })
})