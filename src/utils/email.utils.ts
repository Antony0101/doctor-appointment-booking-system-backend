import axios from "axios";
// import featServerSwitch from "../config/featServerSwitch.js";
// temp fix
const featServerSwitch = {
    generalSwitches: {
        email: true,
    },
};

// Package - axios

// Note: Sendinblue is currently known as Brevo
// https://api.brevo.com/v3/smtp/email new url
// old url https://api.sendinblue.com/v3/smtp/email still works

// env variables
// SIB_KEY -- Sendinblue API key
// SIB_SOURCE -- Sender Email address

/**
 * Represents an API error that can be handled.
 * @param {(string|string[])} to - email address/es to send to.
 * @param {string} subject - email subject.
 * @param {string} text - email text body.
 */

type Params = {
    to: string | string[];
    subject: string;
    text: string;
};

const sendEmail = async ({ to, subject, text }: Params) => {
    try {
        const source = process.env.SIB_SOURCE;
        const apiKey = process.env.SIB_KEY;
        const sender = process.env.SIB_NAME;

        if (featServerSwitch.generalSwitches.email) {
            let To: { email: string; name: string }[];
            if (typeof to === "string") To = [{ email: to, name: "user" }];
            else To = to.map((email) => ({ email, name: "user" }));
            axios
                .post(
                    "https://api.brevo.com/v3/smtp/email",
                    {
                        sender: {
                            name: sender || "sample name",
                            email: source,
                        },
                        to: To,
                        subject: subject,
                        htmlContent: text,
                    },
                    {
                        headers: {
                            accept: "application/json",
                            "content-type": "application/json",
                            "api-key": apiKey,
                        },
                    },
                )
                .then((data) => {
                    console.log(data.data);
                })
                .catch((err) => {
                    console.log(err.message, err.response.data);
                });
        } else {
            console.log(
                "Email feature is turned off",
                "to:",
                to,
                "subject:",
                subject,
                "text:",
                text,
            );
        }
    } catch (err: any) {
        console.log(err.message);
    }
};

export default sendEmail;
