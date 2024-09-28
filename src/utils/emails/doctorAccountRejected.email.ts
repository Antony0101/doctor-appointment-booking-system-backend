// html template for doctor account rejected email

export const DoctorAccountRejectedEmailSubject = "Account Rejected";

export const DoctorAccountRejectedEmailBody = (name: string) => {
    return `
        <h1>Account Rejected</h1>
        <p>Hi ${name},</p>
        <p>Your account has been rejected by the admin</p>
        <p>Thanks!</p>
    `;
};
