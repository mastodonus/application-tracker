create extension if not exists "pgcrypto";
create schema if not exists job_hunt;

create table if not exists job_hunt.application (
    application_id       uuid primary key default gen_random_uuid(),
    company              text not null default '',
    title                text not null default '',
    description          text not null default '',
    applied              timestamp,
    position             text not null default '',
    site                 text not null default '',
    salary_min           integer default 0, 
    salary_max           integer default 0, 
    status               text not null default '',
    link                 text not null default ''
);