import sqlite3 from 'sqlite3'
import path from 'path'

const storage = path.join(__dirname, '../secrets/db.db')

const db = new sqlite3.Database(storage, (e) => {
  if (e) throw e
})

const get = (sql: string, params?: any) => {
  return new Promise<any>((resolve, reject) => {
    db.get(sql, params, (err: Error | null, row: any) => {
      if (err) {
        reject(err)
      }
      resolve(row)
    })
  })
}

const each = (sql: string, params?: any) => {
  return new Promise<any[]>((resolve, reject) => {
    const result: any[] = []
    db.each(
      sql,
      params,
      (err: Error | null, row: any) => {
        result.push(row)
      },
      (err: Error | null) => {
        if (err) {
          reject(err)
        }
        resolve(result)
      }
    )
  })
}

const run = (sql: string, params?: any) => {
  return new Promise<void>((resolve, reject) => {
    db.run(sql, params, (err: Error | null) => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
}

const seqliteDB = {
  get,
  each,
  run,
}

export default seqliteDB
