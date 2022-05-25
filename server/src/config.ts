import fs from 'fs'
import path from 'path'

export const jwtConfig = {
  SECRET: fs.readFileSync(path.resolve(__dirname, 'secrets', 'jwt-key')),
  EXP_TIME: '2h',
}

export const authConfig = {
  MD5_SALT: fs.readFileSync(path.resolve(__dirname, 'secrets', 'salt')),
}
