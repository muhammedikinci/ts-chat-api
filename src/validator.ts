const ErrorMessageAllFieldsMustBeProvided = "All fields must be provided!"
const ErrorMessageUsernameCannotBeLessThen5Char = "The username cannot be less than 5 characters!"
const ErrorMessagePasswordCannotBeLessThen8Char = "The password cannot be less than 8 characters!"

const checkUsernameAndPassword = (username: string, password: string): string => {
    if (!username || !password) {
        return ErrorMessageAllFieldsMustBeProvided
    }

    if (username.length < 5) {
        return ErrorMessageUsernameCannotBeLessThen5Char
    }

    if (password.length < 8) {
        return ErrorMessagePasswordCannotBeLessThen8Char
    }

    return ""
}

export { checkUsernameAndPassword }