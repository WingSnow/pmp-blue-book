import db from '../db'

const getExam = async (limit: number, onlyNew = 0, userId?: number) => {
  const result = await db.each(
    `select q.*,
      case
        when c.user_id is not null then 'Y'
        else ''
        end as collected
    from questions q
      left join collections c on q.id = c.question_id and user_id = $userId
    where (0 = $onlyNew or id not in (
      select question_id
      from answer_record
      where user_id = $userId
    ))
    order by random()
    limit $limit`,
    {
      $onlyNew: onlyNew,
      $userId: userId,
      $limit: limit,
    }
  )
  return result
}

const answerQuestion = async (
  userId: number,
  questionId: number,
  answer: 'A' | 'B' | 'C' | 'D'
) => {
  await db.run(
    `replace into answer_record(user_id, question_id, answer, update_at)
    values
    (?, ?, ?,datetime())`,
    [userId, questionId, answer]
  )
  const result = await db.get(
    'select * from answer_record where user_id = ? and question_id = ?',
    [userId, questionId]
  )
  return result
}

const collectQuestion = async (userId: number, questionId: number) => {
  await db.run(
    `replace into collections(user_id, question_id)
    values
    (?, ?)`,
    [userId, questionId]
  )
  const result = await db.get(
    'select * from collections where user_id = ? and question_id = ?',
    [userId, questionId]
  )
  return result
}

const cancelCollect = async (userId: number, questionId: number) => {
  await db.run(
    `delete from collections
    where user_id = ?
    and question_id = ?`,
    [userId, questionId]
  )

  return {}
}

const getCollectionsList = async (userId: number) => {
  const result = await db.each(
    `select question_id from collections C
    where user_id = ?`,
    [userId]
  )

  return result.map((item) => item.question_id)
}

const getCollections = async (userId: number, page: number, size: number) => {
  const result = await db.each(
    `select q.*, 'Y' collected
    from collections c
      inner join questions q on c.question_id = q.id
    where c.user_id = $userId
    order by c.question_id
    limit $limit offset $limit * $page`,
    {
      $userId: userId,
      $limit: size,
      $page: page,
    }
  )

  return {
    data: result,
    total: await getCollectionsList(userId),
  }
}

const getCollectionsById = async (
  questionId: number,
  userId: number,
  size: number
) => {
  const result = await db.each(
    `select q.*, 'Y' collected
    from collections c
      inner join questions q on c.question_id = q.id
    where c.user_id = $userId
    order by c.question_id
    limit $limit offset (select count(*) from collections c2 where c2.user_id = $userId and c2.question_id < $questionId)`,
    {
      $userId: userId,
      $limit: size,
      $questionId: questionId,
    }
  )

  return result
}

const exam = {
  getExam,
  answerQuestion,
  collectQuestion,
  cancelCollect,
  getCollectionsList,
  getCollections,
  getCollectionsById,
}

export default exam
