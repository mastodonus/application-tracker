drop function if exists job_hunt.s_interview;
create or replace function job_hunt.s_interview(
    in_interview_id            uuid,
    out out_interview_id       uuid,
    out out_application_id     uuid,
    out out_interview_date     timestamptz,
    out out_details            text,
    out out_user_id            uuid
)
returns setof record
language plpgsql
stable
as $$
begin
    return query
    select
        i.interview_id,
        i.application_id,
        i.interview_date,
        i.details,
        a.user_id
    from job_hunt.interview i
    join job_hunt.application a on a.application_id = i.application_id
    where i.interview_id = in_interview_id;
end;
$$;

drop function if exists job_hunt.s_interviews;
create or replace function job_hunt.s_interviews(
    in_user_id                 uuid,
    in_application_id          uuid default null,
    out out_interview_id       uuid,
    out out_application_id     uuid,
    out out_interview_date     timestamptz,
    out out_details            text
)
returns setof record
language plpgsql
stable
as $$
begin
    return query
    select
        i.interview_id,
        i.application_id,
        i.interview_date,
        i.details,
        a.user_id
    from job_hunt.interview i
    join job_hunt.application a on a.application_id = i.application_id
    where (in_application_id is null or i.application_id = in_application_id)
     and a.user_id = in_user_id
    order by application_id,
             interview_date desc;
end;
$$;