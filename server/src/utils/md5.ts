import crypto from 'crypto'
import { authConfig } from '../config'

const md5 = (s: string | Buffer) => {
  return crypto.createHash('md5').update(s).digest('hex')
}

const md5WithSalt = (s: string | Buffer, salt: string) => {
  return md5(md5(s) + salt)
}

const encrypt = (username: string, password: string) => {
  const passwordEncrypt = md5WithSalt(
    md5WithSalt(password, authConfig.MD5_SALT.toString()),
    username
  )
  return passwordEncrypt
}

if (require.main === module) {
  const args = process.argv.slice(2)
  const username = args[0]
  const password = args[1]
  console.log(`username=${username}, password=${password}`)
  console.log(`encryptedPassword=${encrypt(username, password)}`)
}

export default encrypt
