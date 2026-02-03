export function mapApplication(row) {

    const application = {
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
        link: row.out_link,
        userId: row.out_user_id,
        isStale: false,
    };

    if(application.status === 'OPEN'){
        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

        if(application.applied < oneMonthAgo){
            application.isStale = true;
        }
    }

    return application;
}