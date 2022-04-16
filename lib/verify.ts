const MIN_PASSWORD_LEN = 8
const MAX_PASSWORD_LEN = 24

export const checkUsername = (username: string) => {
  return username && username.length > 0
}

export const checkEmail = (email: string) => {
  return email && email.match(/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/)
}

export const checkShortPassword = (password: string) => {
  return password.length >= MIN_PASSWORD_LEN
}

export const checkLongPassword = (password: string) => {
  return password.length <= MAX_PASSWORD_LEN
}

export const passwordErrorMessage = (password: string) => {
  if(!checkShortPassword(password)) {
    return `Password is too short minimum number of characters is ${MIN_PASSWORD_LEN}`
  }
  if(!checkLongPassword(password)) {
    return `Password is too long maximum number of characters is ${MAX_PASSWORD_LEN}`
  }
}

export const checkPassword = (password: string) => {
  return password && checkShortPassword(password) && checkLongPassword(password)
}

export const checkPasswords = (password: string, passwordRepeat: string) => {
  return password === passwordRepeat
}