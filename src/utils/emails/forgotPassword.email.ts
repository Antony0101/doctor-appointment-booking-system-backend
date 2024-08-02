// html template for forgot password email

export const forgotPasswordSubject = "Reset Password";

export const forgotPasswordBody = (url: string) => {
    return `
        <h1>Reset Password</h1>
        <p>Hi,</p>
        <p>Please use the following link to reset your password:</p>
        <p>${url}</p>
        <p>Thanks!</p>
    `;
};
