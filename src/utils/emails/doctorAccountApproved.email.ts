// html template for doctor account approved email

export const DoctorAccountApprovedEmailSubject = "Account Approved";

export const DoctorAccountApprovedEmailBody = (name: string) => {
    return `
        <h1>Account Approved</h1>
        <p>Hi ${name},</p>
        <p>Your account has been approved by the admin</p>
        <p>Thanks!</p>
    `;
};
