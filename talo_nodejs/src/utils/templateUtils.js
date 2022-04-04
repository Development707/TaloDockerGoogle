const templateUtils = {
    getOtpHtml: function (otp, optTime) {
        const html = this.readHtmlToString('OTP.html');
        return html.replace('{OTP}', otp + '').replace('{OTP_TIME}', optTime);
    },

    readHtmlToString: (filePath) => {
        const fs = require('fs');
        const path = require('path');

        return fs.readFileSync(path.resolve(__dirname, filePath), 'utf8');
    },
};

module.exports = templateUtils;
