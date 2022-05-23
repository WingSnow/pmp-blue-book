import db from '../db'

const verifyPwd = async (username: string, password: string) => {
  const result = await db.get(
    'select id from users where username = ? and password = ?',
    [username, password]
  )
  if (!result || !result.id) {
    return null
  }
  return result.id
}

const user = {
  verifyPwd,
}

export default user
