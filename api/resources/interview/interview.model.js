export function mapInterview(row) {
  return {
    interviewId: row.out_interview_id,
    applicationId: row.out_application_id,
    interviewDate: row.out_interview_date,
    details: row.out_details
  };
}