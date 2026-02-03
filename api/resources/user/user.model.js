export function mapUser(row){
    return {
        userId: row.out_user_id,
        email: row.out_email,
        name: row.out_name,
        lastLogin: row.out_last_login,
        firstLogin: row.out_first_login,
        avatar: row.out_avatar
        ? row.out_avatar.toString('utf8')
        : null
    };
}