const nodeMailer = require('nodemailer');

const email = process.env.EMAIL;
const password = process.env.EMAIL_PASSWORD;
const mailHost = 'smtp.gmail.com';
const mailPort = 465;

const transporter = nodeMailer.createTransport({
    host: mailHost,
    port: mailPort,
    debug: true,
    secure: true,
    auth: {
        user: email,
        pass: password,
    },
});

const mailer = {
    sendMail: (to, subject, htmlContent) => {
        const options = {
            from: email,
            to,
            subject,
            html: htmlContent,
        };

        return transporter.sendMail(options);
    },
};

module.exports = mailer;
