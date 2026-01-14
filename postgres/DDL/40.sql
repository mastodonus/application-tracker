create or replace function job_hunt.i_application(
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
    insert into job_hunt.application(company, title, "description", applied, position, site, salary_min, salary_max, "status", link)
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
            coalesce(in_link, '')
        )
    returning application_id into out_application_id;
end;
$$;