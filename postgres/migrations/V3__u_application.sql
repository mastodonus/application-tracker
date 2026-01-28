create or replace function job_hunt.u_application(
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
     returning application_id into out_application_id;
end;
$$;