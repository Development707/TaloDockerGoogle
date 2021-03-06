import * as Yup from 'yup';
export const loginValues = {
    initial: {
        username: '',
        password: '',
    },
    validationSchema: Yup.object().shape({
        username: Yup.string()
            .required('Tài khoản không được bỏ trống.')
            .matches(
                /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
                'Email không hợp lệ'
            ),
        password: Yup.string().required('Mật khẩu không được bỏ trống'),
    }),
};

export const registryValues = {
    initial: {
        name: '',
        username: '',
        password: '',
        passwordconfirm: '',
        otpValue: '',
    },
    validationSchema: Yup.object().shape({
        name: Yup.string()
            .required('Tên không được bỏ trống.')
            .matches(
                /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/i,
                'Tên không được chứa số'
            ),
        username: Yup.string()
            .required('Tài khoản không được bỏ trống')
            .matches(
                /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
                'Email không hợp lệ'
            ),
        password: Yup.string()
            .required('Mật khẩu không được bỏ trống.')
            .min(8, 'Mật khẩu phải từ 8-50 ký tự')
            .max(50, 'Mật khẩu phải từ 8-50 ký tự'),
        passwordconfirm: Yup.string()
            .required('không được bỏ trống')
            .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp'),
    }),
    validationSchemaWithOTP: Yup.object().shape({
        name: Yup.string()
            .required('Tên không được bỏ trống.')
            .matches(
                /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/i,
                'Tên không được chứa số và ký tự đặc biệt'
            ),
        username: Yup.string()
            .required('Tài khoản không được bỏ trống.')
            .matches(
                /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
                'Email không hợp lệ'
            ),
        password: Yup.string()
            .required('Mật khẩu không được bỏ trống')
            .min(8, 'Mật khẩu phải từ 8-50 ký tự')
            .max(50, 'Mật khẩu phải từ 8-50 ký tự'),
        passwordconfirm: Yup.string()
            .required('không được bỏ trống')
            .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp'),
        otpValue: Yup.string()
            .trim()
            .required('OTP không được bỏ trống')
            .matches(/^\d{6}$/, 'OTP phải đủ 6 chữ số'),
    }),
};

export const forgotValues = {
    initial: {
        username: '',
        password: '',
        passwordconfirm: '',
    },

    validationSchema: Yup.object().shape({
        username: Yup.string()
            .required('Tài khoản không được bỏ trống')
            .matches(
                /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
                'Email không hợp lệ'
            ),
        password: Yup.string()
            .required('Mật khẩu không được bỏ trống')
            .min(8, 'Mật khẩu phải từ 8-50 ký tự')
            .max(50, 'Mật khẩu phải từ 8-50 ký tự'),
        passwordconfirm: Yup.string()
            .required('không được bỏ trống.')
            .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp'),
        otpValue: Yup.string()
            .trim()
            .required('OTP không được bỏ trống.')
            .matches(/^\d{6}$/, 'OTP phải đủ 6 chữ số'),
    }),

    validationSchemaUser: Yup.object().shape({
        username: Yup.string()
            .required('Tài khoản không được bỏ trống')
            .matches(
                /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
                'Email không hợp lệ'
            ),
    }),
};

export const loginPhoneNumber = {
    initial: {
        phoneNumber: '',
        otpValue: '',
    },
    validationSchemaPhone: Yup.object().shape({
        phoneNumber: Yup.string()
            .trim()
            .required('Số điện thoại không được bỏ trống')
            .min(10, 'Số điện thoại gồm 10 số')
            .max(10, 'Số điện thoại gồm 10 số'),
    }),
    validationSchemaPhoneWithOTP: Yup.object().shape({
        phoneNumber: Yup.string()
            .trim()
            .required('Số điện thoại không được bỏ trống')
            .min(10, 'Số điện thoại gồm 10 số')
            .max(10, 'Số điện thoại gồm 10 số'),
        otpValue: Yup.string()
            .trim()
            .required('OTP không được bỏ trống')
            .matches(/^\d{6}$/, 'OTP phải đủ 6 chữ số'),
    }),
};
