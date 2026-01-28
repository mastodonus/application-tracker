create or replace function job_hunt.s_applications(
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
    out out_link text
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
        a.link
    from job_hunt.application a
    where in_application_id is null
       or a.application_id = in_application_id
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