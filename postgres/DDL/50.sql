create or replace function job_hunt.d_application(
    in_application_id uuid,
    out out_application_id uuid
)
returns uuid
language plpgsql
volatile
as $$
begin
    delete
      from job_hunt.application
     where application_id = in_application_id
    returning application_id into out_application_id;
end;
$$;