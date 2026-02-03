create table if not exists job_hunt.user (
    user_id              uuid primary key default gen_random_uuid(),
    user_oauth_id        text unique not null,
    email                text not null,
    name                 text not null,
    last_login           timestamptz not null,
    first_login          timestamptz not null,
    avatar               bytea
);

create or replace function job_hunt.s_user(
    in_user_id                 uuid default null,
    out out_user_id            uuid,
    out out_email              text,
    out out_name               text,
    out out_last_login         timestamptz,
    out out_first_login        timestamptz,
    out out_avatar             bytea
)
returns setof record
language plpgsql
stable
as $$
begin
    return query
    select
        u.user_id,
        u.email,
        u.name,
        u.last_login,
        u.first_login,
        u.avatar
    from job_hunt.user u
    where u.user_id = in_user_id;
end;
$$;

create or replace function job_hunt.iu_user(
    in_user_oauth_id          text,
    in_email                  text,
    in_name                   text,
    in_avatar                 bytea,
    out out_user_id           uuid
)
returns uuid
language plpgsql
volatile
as $$
begin
    insert into job_hunt.user(user_oauth_id, email, name, avatar, last_login, first_login)
        values (
            in_user_oauth_id,
            in_email,
            in_name,
            in_avatar,
            current_date,
            current_date
        )
    on conflict (user_oauth_id)
    do update set
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        avatar = EXCLUDED.avatar,
        last_login = EXCLUDED.last_login
    returning user_id into out_user_id;
end;
$$;