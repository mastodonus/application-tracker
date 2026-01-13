function mapApplication(row) {
  return {
    applicationId: row.out_application_id,
    company: row.out_company,
    title: row.out_title,
    description: row.out_description,
    applied: row.out_applied,
    position: row.out_position,
    site: row.out_site,
    salaryMin: row.out_salary_min,
    salaryMax: row.out_salary_max,
    status: row.out_status,
    link: row.out_link
  };
}

module.exports = { mapApplication };