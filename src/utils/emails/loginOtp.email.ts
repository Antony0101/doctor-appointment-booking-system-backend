// html template for login otp email

export const LoginOtpEmailSubject = "Login Otp";

export const LoginOtpEmailBody = (otp: string) => {
    return `
        <h1>Login Otp</h1>
        <p>Hi,</p>
        <p>Please use the following code to login to the site</p>
        <p>${otp}</p>
        <p>Thanks!</p>
    `;
};
