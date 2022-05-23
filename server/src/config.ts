import fs from 'fs'
import path from 'path'

// eslint-disable-next-line import/prefer-default-export
export const jwtConfig = {
  SECRET: fs.readFileSync(path.resolve(__dirname, 'secrets', 'jwt-key')),
  EXP_TIME: '2h',
}
