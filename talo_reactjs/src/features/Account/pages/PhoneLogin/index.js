import { unwrapResult } from '@reduxjs/toolkit';
import {
    Button,
    Col,
    Divider,
    message,
    notification,
    Row,
    Typography,
} from 'antd';
import firebaseApi from 'api/firebaseApi';
import { fetchUserProfile, setLoading, setLogin } from 'app/globalSlice';
import InputField from 'customfield/InputField';
import { loginPhoneNumber } from 'features/Account/initValues';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { FastField, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import auth from 'utils/FirebaseApp';
const { Text, Title } = Typography;

const PhoneLogin = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const generateRecaptcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier(
            'recaptcha-container',
            {
                size: 'normal',
                callback: (response) => {
                    // console.log(response);
                    setIsSubmit(true);
                },
            },
            auth
        );
    };
    const openNotification = (mes) => {
        const args = {
            message: mes ? mes : 'Xác thực OTP để hoàn tất việc đăng ký',
        };
        notification.info(args);
    };
    const convertPhoneNumber = (phoneNumber) => {
        let convert;
        convert = phoneNumber.replace('0', '+84');
        return convert;
    };

    const handleSignInPhoneNumber = (values) => {
        const { phoneNumber, otpValue } = values;
        const newNumber = convertPhoneNumber(phoneNumber);

        dispatch(setLoading(true));
        if (isSubmit) {
            try {
                window.confirmationResult
                    .confirm(otpValue)
                    .then((result) => {
                        handleConfirmOTP(phoneNumber, result.user.accessToken);
                    })
                    .catch((error) => {
                        message.error(
                            'Mã OTP đã hết hạn. vui lòng đăng nhập lại'
                        );
                    });
            } catch (error) {
                message.error('Mã OTP đã hết hạn. vui lòng đăng nhập lại');
            }
        } else {
            generateRecaptcha();
            let appVerifier = window.recaptchaVerifier;
            signInWithPhoneNumber(auth, newNumber, appVerifier)
                .then((confirmationResult) => {
                    setIsSubmit(true);
                    openNotification();
                    window.confirmationResult = confirmationResult;
                })
                .catch((error) => {
                    console.log(error);
                });
        }

        dispatch(setLoading(false));
    };

    const handleConfirmOTP = async (phoneNumber, otpValue) => {
        try {
            await firebaseApi
                .confirmPhoneNumber(phoneNumber, otpValue)
                .then((res) => {
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('refreshToken', res.data.refreshToken);
                    dispatch(setLogin(true));
                    const { role } = unwrapResult(dispatch(fetchUserProfile()));
                    if (role === 'USER') navigate('/chat', { replace: true });
                    else navigate('/admin', { replace: true });
                });
        } catch (error) {}
    };
    return (
        <div className="account-common-page">
            <div className="account-wrapper">
                <div className="account">
                    <Title level={2} style={{ textAlign: 'center' }}>
                        <Text style={{ color: '#4d93ff' }}>TALO</Text>
                    </Title>
                    <Divider>Nhập số điện thoại</Divider>

                    <div className="form-account">
                        <Formik
                            initialValues={{ ...loginPhoneNumber.initial }}
                            onSubmit={(values) =>
                                handleSignInPhoneNumber(values)
                            }
                            validationSchema={
                                isSubmit
                                    ? loginPhoneNumber.validationSchemaPhoneWithOTP
                                    : loginPhoneNumber.validationSchemaPhone
                            }
                            enableReinitialize={true}
                        >
                            {(formikProps) => {
                                return (
                                    <Form>
                                        <Row gutter={[24, 16]}>
                                            {isSubmit ? (
                                                <>
                                                    <Col span={24}>
                                                        <FastField
                                                            name="otpValue"
                                                            component={
                                                                InputField
                                                            }
                                                            type="text"
                                                            title="Xác nhận OTP"
                                                            placeholder="Mã OTP có 6 kí tự"
                                                            maxLength={50}
                                                            titleCol={24}
                                                            inputCol={24}
                                                        />
                                                    </Col>
                                                </>
                                            ) : (
                                                <>
                                                    <Col span={24}>
                                                        <FastField
                                                            name="phoneNumber"
                                                            component={
                                                                InputField
                                                            }
                                                            type="text"
                                                            title="Số điện thoại "
                                                            placeholder="Ví dụ: 0123456789"
                                                            maxLength={50}
                                                            titleCol={24}
                                                            inputCol={24}
                                                        />
                                                    </Col>
                                                </>
                                            )}
                                            {isSubmit ? (
                                                <></>
                                            ) : (
                                                <>
                                                    <Col>
                                                        <div id="recaptcha-container"></div>
                                                    </Col>
                                                </>
                                            )}
                                            <Col span={24}>
                                                <Button
                                                    htmlType="submit"
                                                    type="primary"
                                                    block
                                                >
                                                    {isSubmit
                                                        ? 'Xác thực'
                                                        : 'Đăng nhập'}
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </div>
                    <Divider>Hoặc</Divider>
                    <div className="addtional-link">
                        <Link to="/">Đăng nhập</Link>
                        <Link to="/forgot">Quên mật khẩu?</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhoneLogin;
