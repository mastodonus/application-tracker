create table if not exists job_hunt.document (
    document_id          uuid primary key default gen_random_uuid(),
    application_id       uuid not null references job_hunt.application(application_id) on delete cascade,
    filename             text not null default '',
    content_type         text not null default '',
    file_size            integer not null,
    content              bytea not null,
    created_at           timestamptz not null default now()
);

create or replace function job_hunt.s_document_headers(
    in_document_id uuid       default null,
    in_application_id uuid    default null,
    out out_document_id       uuid,
    out out_application_id    uuid,
    out out_filename          text,
    out out_content_type      text,
    out out_file_size         integer,
    out out_created_at        timestamptz
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
        d.created_at
    from job_hunt.document d
    where (in_application_id is null or d.application_id = in_application_id)
      and (in_document_id is null or d.document_id = in_document_id)
    order by created_at desc;
end;
$$;

create or replace function job_hunt.s_document(
    in_document_id uuid       default null,
    out out_document_id       uuid,
    out out_application_id    uuid,
    out out_filename          text,
    out out_content_type      text,
    out out_file_size         integer,
    out out_created_at        timestamptz,
    out out_content           bytea
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
        d.content
    from job_hunt.document d
    where d.document_id = in_document_id;
end;
$$;

create or replace function job_hunt.i_document(
    in_application_id         uuid,
    in_filename               text,
    in_content_type           text,
    in_file_size              integer,
    in_content                bytea,
    out out_document_id       uuid
)
returns uuid
language plpgsql
volatile
as $$
begin
    insert into job_hunt.document(application_id, filename , content_type, file_size, content)
        values (
            coalesce(in_application_id, null),
            coalesce(in_filename, ''),
            coalesce(in_content_type, ''),
            coalesce(in_file_size, 0),
            coalesce(in_content, null)
        )
    returning document_id into out_document_id;
end;
$$;

create or replace function job_hunt.d_document(
    in_document_id uuid,
    out out_document_id uuid
)
returns uuid
language plpgsql
volatile
as $$
begin
    delete
      from job_hunt.document
     where document_id = in_document_id
    returning document_id into out_document_id;
end;
$$;

create index if not exists ix_document_application
on job_hunt.document(application_id, created_at desc);