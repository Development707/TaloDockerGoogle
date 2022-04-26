import React, { useEffect, useState } from 'react';
import {
    Button,
    Col,
    Divider,
    message,
    Modal,
    notification,
    Row,
    Typography,
} from 'antd';
import { FastField, Form, Formik } from 'formik';
import UserNameField from 'customfield/UserNameField';
import PasswordField from 'customfield/PasswordField';
import { Link, useNavigate } from 'react-router-dom';
import { registryValues } from 'features/Account/initValues';
import InputField from 'customfield/InputField';
import { useDispatch } from 'react-redux';
import { setLoadingAccount } from 'features/Account/accountSlice';
import loginApi from 'api/loginAPI';

const { Text, Title } = Typography;

const RESEND_OTP_TIME_LIMIT = 120;
RegistryPage.propTypes = {};

function RegistryPage(props) {
    let resendOTPTimerInterval;
    const dispatch = useDispatch();
    //set OTP value
    const [isSubmit, setIsSubmit] = useState(false);
    //set time counter
    const [counter, setCounter] = useState(0);
    const navigate = useNavigate();

    const openNotification = (mes) => {
        const args = {
            message: mes ? mes : 'Xác thực OTP để hoàn tất việc đăng ký',
        };
        notification.info(args);
    };

    function success() {
        Modal.success({
            content: 'Đăng ký thành công !',
            onOk: () => {
                navigate('/');
            },
            onCancel: () => {
                navigate('/');
            },
        });
    }

    const handleRegistry = async (values) => {
        // console.log(values);
        const { name, username, password, otpValue } = values;
        dispatch(setLoadingAccount(true));
        if (isSubmit) {
            handleConfirmAccount(username, otpValue);
        } else {
            await loginApi
                .fetchUser(username)
                .then((value) => {
                    if (value.isActived === false) {
                        setIsSubmit(true);
                    } else {
                        message.error(
                            'Email hoặc số điện thoại đã được đăng ký'
                        );
                    }
                })
                .catch(async () => {
                    try {
                        await loginApi.registry(name, username, password);
                        setIsSubmit(true);
                        openNotification();
                        setCounter(RESEND_OTP_TIME_LIMIT);
                        startResendOTPTimer();
                    } catch (error) {
                        message.error('Đã có lỗi xảy ra');
                    }
                });
        }
        dispatch(setLoadingAccount(false));
    };

    //dem nguoc tu 60 den 0
    const startResendOTPTimer = () => {
        if (resendOTPTimerInterval) {
            clearInterval(resendOTPTimerInterval);
        }
        resendOTPTimerInterval = setInterval(() => {
            if (counter <= 0) {
                clearInterval(resendOTPTimerInterval);
            } else {
                setCounter(counter - 1);
            }
        }, 1000);
    };
    //xac thuc OTP
    const handleConfirmAccount = async (username, otp) => {
        try {
            await loginApi.confirmAccount(username, otp);
            success();
        } catch (error) {
            message.error('mã OTP không hợp lệ');
        }
    };
    //useEffect khi counter thay đổi
    useEffect(() => {
        startResendOTPTimer();
        return () => {
            if (resendOTPTimerInterval) {
                clearInterval(resendOTPTimerInterval);
            }
        };
        // eslint-disable-next-line
    }, [counter]);
    //Gui lai OTP
    const handleResendOTP = async (username) => {
        setCounter(RESEND_OTP_TIME_LIMIT);
        startResendOTPTimer();

        dispatch(setLoadingAccount(true));
        try {
            await loginApi.forgotOTP(username);
            openNotification(`Đã gửi lại mã OTP đến ${username}`);
        } catch (error) {}
        dispatch(setLoadingAccount(false));
    };

    return (
        <div className="account-common-page">
            <div className="account-wrapper">
                <div className="account">
                    <Title level={2} style={{ textAlign: 'center' }}>
                        <Text style={{ color: '#4d93ff' }}>TALO</Text>
                    </Title>
                    <Divider>Nhập thông tin</Divider>
                    <div className="form-account">
                        <Formik
                            initialValues={{ ...registryValues.initial }}
                            onSubmit={(values) => handleRegistry(values)}
                            validationSchema={
                                isSubmit
                                    ? registryValues.validationSchemaWithOTP
                                    : registryValues.validationSchema
                            }
                            enableReinitialize={true}
                        >
                            {(formikProps) => {
                                return (
                                    <Form>
                                        <Row gutter={[0, 8]}>
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

                                                    <Col span={24}>
                                                        <Button
                                                            onClick={() =>
                                                                handleResendOTP(
                                                                    formikProps
                                                                        .values
                                                                        .username
                                                                )
                                                            }
                                                            type="primary"
                                                            block
                                                            disabled={
                                                                counter > 0
                                                                    ? true
                                                                    : false
                                                            }
                                                        >
                                                            Gửi lại OTP{' '}
                                                            {`${
                                                                counter > 0
                                                                    ? `sau ${counter}`
                                                                    : ''
                                                            }`}
                                                        </Button>
                                                    </Col>
                                                </>
                                            ) : (
                                                <>
                                                    <Col span={24}>
                                                        <FastField
                                                            name="name"
                                                            component={
                                                                InputField
                                                            }
                                                            type="text"
                                                            title="Họ tên"
                                                            placeholder="Ví dụ: Nguyễn Văn A"
                                                            maxLength={50}
                                                            titleCol={24}
                                                            inputCol={24}
                                                        />
                                                    </Col>
                                                    <Col span={24}>
                                                        <FastField
                                                            name="username"
                                                            component={
                                                                UserNameField
                                                            }
                                                            type="text"
                                                            title="Tài khoản"
                                                            placeholder="Nhập email/SĐT đăng ký"
                                                            maxLength={50}
                                                            titleCol={24}
                                                            inputCol={24}
                                                        />
                                                    </Col>

                                                    <Col span={24}>
                                                        <FastField
                                                            name="password"
                                                            component={
                                                                PasswordField
                                                            }
                                                            type="password"
                                                            title="Mật khẩu"
                                                            placeholder="Mật khẩu ít nhất 8 kí tự"
                                                            maxLength={200}
                                                            titleCol={24}
                                                            inputCol={24}
                                                        />
                                                    </Col>

                                                    <Col span={24}>
                                                        <FastField
                                                            name="passwordconfirm"
                                                            component={
                                                                PasswordField
                                                            }
                                                            type="password"
                                                            title=" Xác nhận mật khẩu"
                                                            placeholder="Nhập lại mật khẩu"
                                                            maxLength={200}
                                                            titleCol={24}
                                                            inputCol={24}
                                                        />
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
                                                        : 'Đăng ký'}
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
}

export default RegistryPage;
