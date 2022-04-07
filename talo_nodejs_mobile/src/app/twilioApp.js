var accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
var authToken = process.env.TWILIO_AUTH_TOKEN; // Your Auth Token from www.twilio.com/console

const client = require('twilio')(accountSid, authToken, {
    lazyLoading: true,
});

const timeOTP = process.env.OTP_EXPIRE_MINUTE;

const sendOTP = (phone, otp) => {
    if (phone && otp) {
        client.messages
            .create({
                body: `Mã ${otp} để xác thực tài khoản của bạn. Có thời hạn là ${timeOTP} phút`,
                messagingServiceSid: 'MG8d1fd55e08f02bf111b8671fb53c764e',
                to: phone,
            })
            .then((message) =>
                console.warn(
                    `Phone ${phone} send OTP(${otp}): Id message: ${message.sid}`,
                ),
            )
            .catch((error) => console.error(error))
            .done();
    }
};

module.exports = { sendOTP };
