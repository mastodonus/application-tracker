alter table job_hunt.application
  add user_id uuid not null references job_hunt.user(user_id) on delete cascade;

drop function if exists job_hunt.s_application;
create or replace function job_hunt.s_application(
    in_application_id uuid default null,
    out out_application_id uuid,
    out out_company text,
    out out_title text,
    out out_description text,
    out out_applied timestamp,
    out out_position text,
    out out_site text,
    out out_salary_min integer,
    out out_salary_max integer,
    out out_status text,
    out out_link text,
    out out_user_id uuid
)
returns setof record
language plpgsql
stable
as $$
begin
    return query
    select
        a.application_id,
        a.company,
        a.title,
        a.description,
        a.applied,
        a.position,
        a.site,
        a.salary_min,
        a.salary_max,
        a.status,
        a.link,
        a.user_id
    from job_hunt.application a
    where a.application_id = in_application_id
    order by
    	case status
        	when 'INTERVIEWING' then 1
	        when 'OPEN' then 2
	        when 'REJECTED' then 3
        	else 4
    	end,
   		applied desc,
    	company asc;
end;
$$;

drop function if exists job_hunt.s_applications;
create or replace function job_hunt.s_applications(
    in_user_id uuid,
    out out_application_id uuid,
    out out_company text,
    out out_title text,
    out out_description text,
    out out_applied timestamp,
    out out_position text,
    out out_site text,
    out out_salary_min integer,
    out out_salary_max integer,
    out out_status text,
    out out_link text,
    out out_user_id uuid
)
returns setof record
language plpgsql
stable
as $$
begin
    return query
    select
        a.application_id,
        a.company,
        a.title,
        a.description,
        a.applied,
        a.position,
        a.site,
        a.salary_min,
        a.salary_max,
        a.status,
        a.link,
        a.user_id
    from job_hunt.application a
    where a.user_id = in_user_id
    order by
    	case status
        	when 'INTERVIEWING' then 1
	        when 'OPEN' then 2
	        when 'REJECTED' then 3
        	else 4
    	end,
   		applied desc,
    	company asc;
end;
$$;


drop function if exists job_hunt.u_application;
create or replace function job_hunt.u_application(
    in_user_id uuid,
    in_application_id uuid,
    in_company text,
    in_title text,
    in_description text,
    in_applied timestamp,
    in_position text,
    in_site text,
    in_salary_min integer,
    in_salary_max integer,
    in_status text,
    in_link text,
    out out_application_id uuid
)
returns uuid
language plpgsql
volatile
as $$
begin
    update job_hunt.application
       set company = in_company,
           title = in_title,
           "description" = in_description,
           applied = in_applied,
           position = in_position,
           site = in_site,
           salary_min = in_salary_min,
           salary_max = in_salary_max,
           "status" = in_status,
           link = in_link
     where application_id = in_application_id
       and user_id = in_user_id
     returning application_id into out_application_id;
end;
$$;


drop function if exists job_hunt.i_application;
create or replace function job_hunt.i_application(
    in_user_id uuid,
    in_company text,
    in_title text,
    in_description text,
    in_applied timestamp,
    in_position text,
    in_site text,
    in_salary_min integer,
    in_salary_max integer,
    in_status text,
    in_link text,
    out out_application_id uuid
)
returns uuid
language plpgsql
volatile
as $$
begin
    insert into job_hunt.application(company, title, "description", applied, position, site, salary_min, salary_max, "status", link, user_id)
        values (
            coalesce(in_company, ''),
            coalesce(in_title, ''),
            coalesce(in_description, ''),
            coalesce(in_applied, current_date),
            coalesce(in_position, ''),
            coalesce(in_site, ''),
            coalesce(in_salary_min, 0),
            coalesce(in_salary_max, 0),
            coalesce(in_status, 'OPEN'),
            coalesce(in_link, ''),
            in_user_id
        )
    returning application_id into out_application_id;
end;
$$;