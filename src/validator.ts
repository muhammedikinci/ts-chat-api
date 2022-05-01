const ErrorMessageAllFieldsMustBeProvided = "All fields must be provided!"
const ErrorMessageUsernameCannotBeLessThen5Char = "The username cannot be less than 5 characters!"
const ErrorMessagePasswordCannotBeLessThen8Char = "The password cannot be less than 8 characters!"
const ErrorMessageUsernameCannotBeGreaterThen20Char = "The username cannot be greater than 20 characters!"
const ErrorMessagePasswordCannotBeGreaterThen40Char = "The password cannot be greater than 40 characters!"
const ErrorMessageUsernameCannotContainsSpecialChars = "The username cannot contains special characters!"

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

    if (username.length > 20) {
        return ErrorMessageUsernameCannotBeGreaterThen20Char
    }

    if (password.length > 40) {
        return ErrorMessagePasswordCannotBeGreaterThen40Char
    }

    if (username.replace(/[0-9A-Za-z]/g, "")) {
        return ErrorMessageUsernameCannotContainsSpecialChars
    }

    return ""
}

export { checkUsernameAndPassword }