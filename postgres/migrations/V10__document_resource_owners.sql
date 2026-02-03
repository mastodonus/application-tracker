drop function if exists job_hunt.s_document_header;
create or replace function job_hunt.s_document_header(
    in_document_id            uuid,
    out out_document_id       uuid,
    out out_application_id    uuid,
    out out_filename          text,
    out out_content_type      text,
    out out_file_size         integer,
    out out_created_at        timestamptz,
    out out_user_id           uuid
)
returns setof record
language plpgsql
stable
as $$
begin
    return query
    select
        d.document_id,
        d.application_id,
        d.filename,
        d.content_type,
        d.file_size,
        d.created_at,
        a.user_id
    from job_hunt.document d
    join job_hunt.application a on a.application_id = d.application_id
    where d.document_id = in_document_id;
end;
$$;

drop function if exists job_hunt.s_document_headers;
create or replace function job_hunt.s_document_headers(
    in_user_id                uuid,
    in_application_id         uuid default null,
    out out_document_id       uuid,
    out out_application_id    uuid,
    out out_filename          text,
    out out_content_type      text,
    out out_file_size         integer,
    out out_created_at        timestamptz,
    out out_user_id           uuid
)
returns setof record
language plpgsql
stable
as $$
begin
    return query
    select
        d.document_id,
        d.application_id,
        d.filename,
        d.content_type,
        d.file_size,
        d.created_at,
        a.user_id
    from job_hunt.document d
    join job_hunt.application a on a.application_id = d.application_id
    where (in_application_id is null or d.application_id = in_application_id)
      and a.user_id = in_user_id
    order by created_at desc;
end;
$$;

drop function if exists job_hunt.s_document;
create or replace function job_hunt.s_document(
    in_document_id uuid       default null,
    out out_document_id       uuid,
    out out_application_id    uuid,
    out out_filename          text,
    out out_content_type      text,
    out out_file_size         integer,
    out out_created_at        timestamptz,
    out out_content           bytea,
    out out_user_id           uuid
)
returns setof record
language plpgsql
stable
as $$
begin
    return query
    select
        d.document_id,
        d.application_id,
        d.filename,
        d.content_type,
        d.file_size,
        d.created_at,
        d.content,
        a.user_id
    from job_hunt.document d    
    join job_hunt.application a on a.application_id = d.application_id
    where d.document_id = in_document_id;
end;
$$;