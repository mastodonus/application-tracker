import postgres from '../../infrastructure/postgres.js';
import { mapUser } from './user.model.js';

export async function getUser(userId){
    const { rows } = await postgres.query(
        'select * from job_hunt.s_user($1)',
        [
            userId
        ]
    )

    return mapUser(rows[0]);
}

export async function upsertUser(OAuthId, user){
  const { rows } = await postgres.query(
      `select * from job_hunt.iu_user($1,$2,$3,$4)`,
      [
        OAuthId,
        user.email,
        user.name,
        user.avatar
      ]
    );

  return rows[0].out_user_id;
}