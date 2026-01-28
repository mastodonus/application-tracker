create table if not exists job_hunt.interview (
    interview_id         uuid primary key default gen_random_uuid(),
    application_id       uuid not null references job_hunt.application(application_id) on delete cascade,
    interview_date       timestamptz not null default now(),
    details              text not null default ''
);

create or replace function job_hunt.s_interviews(
    in_interview_id            uuid default null,
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
        i.details
    from job_hunt.interview i
    where (in_application_id is null or i.application_id = in_application_id)
      and (in_interview_id is null or i.interview_id = in_interview_id)
    order by application_id,
             interview_date desc;
end;
$$;

create or replace function job_hunt.u_interview(
    in_interview_id          uuid,
    in_interview_date        timestamptz,
    in_details               text,
    out out_interview_id      uuid
)
returns uuid
language plpgsql
volatile
as $$
begin
    update job_hunt.interview
       set interview_date = in_interview_date,
           details = in_details
     where interview_id = in_interview_id
     returning interview_id into out_interview_id;
end;
$$;

create or replace function job_hunt.i_interview(
    in_application_id       uuid,
    in_interview_date       timestamptz,
    in_details              text,
    out out_interview_id    uuid
)
returns uuid
language plpgsql
volatile
as $$
begin
    insert into job_hunt.interview(application_id, interview_date, details)
        values (
            coalesce(in_application_id, null),
            coalesce(in_interview_date, current_date),
            coalesce(in_details, '')
        )
    returning interview_id into out_interview_id;
end;
$$;

create or replace function job_hunt.d_interview(
    in_interview_id uuid,
    out out_interview_id uuid
)
returns uuid
language plpgsql
volatile
as $$
begin
    delete
      from job_hunt.interview
     where interview_id = in_interview_id
    returning interview_id into out_interview_id;
end;
$$;

create index if not exists ix_interview_application
on job_hunt.interview(application_id, interview_date desc);