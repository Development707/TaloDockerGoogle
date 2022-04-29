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
import loginApi from 'api/loginAPI';
import InputField from 'customfield/InputField';
import PasswordField from 'customfield/PasswordField';
import UserNameField from 'customfield/UserNameField';
import { setLoadingAccount } from 'features/Account/accountSlice';
import { forgotValues } from 'features/Account/initValues';
import { FastField, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;

const RESEND_OTP_TIME_LIMIT = 120;

function ForgotPage(props) {
    const [isSubmit, setIsSubmit] = useState(false);
    const [counter, setCounter] = useState(0);
    const [account, setAccount] = useState(null);
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const handleSubmit = async (values) => {
        console.log(values);

        dispatch(setLoadingAccount(true));

        const { username, password, otpValue } = values;

        if (isSubmit) {
            try {
                if (account.isActived) {
                    await loginApi.forgotPassword(username, otpValue, password);
                } else {
                    await loginApi.confirmAccount(username, otpValue);
                    await loginApi.forgotPassword(username, otpValue, password);
                }
                success();
            } catch (error) {
                message.error('Mã OTP đã hết hạn');
            }
        } else {
            try {
                setCounter(RESEND_OTP_TIME_LIMIT);
                startResendOTPTimer();
                const account = await loginApi.fetchUser(username);
                setAccount(account);
                await loginApi.forgotOTP(username);
                openNotification(username);
                setIsSubmit(true);
            } catch (error) {
                message.error('Tài khoản không tồn tại');
            }
        }
        dispatch(setLoadingAccount(false));
    };

    function success() {
        Modal.success({
            content: 'Cập nhật mật khẩu mới thành công!',
            onOk: () => {
                navigate('/');
            },
            onCancel: () => {
                navigate('/');
            },
        });
    }

    let resendOTPTimerInterval;
    const openNotification = (mes) => {
        const args = {
            message: `Đã gửi OTP đến ${mes}`,
        };
        notification.info(args);
    };

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

    useEffect(() => {
        startResendOTPTimer();
        return () => {
            if (resendOTPTimerInterval) {
                clearInterval(resendOTPTimerInterval);
            }
        };
    }, [counter]);

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
                    <Divider>Tìm tài khoản của bạn</Divider>
                    <div className="form-account">
                        <Formik
                            initialValues={{ ...forgotValues.initial }}
                            onSubmit={(values) => handleSubmit(values)}
                            validationSchema={
                                isSubmit
                                    ? forgotValues.validationSchema
                                    : forgotValues.validationSchemaUser
                            }
                            enableReinitialize={true}
                        >
                            {(formikProps) => {
                                return (
                                    <Form>
                                        <Row gutter={[0, 8]}>
                                            <Col span={24}>
                                                <Text
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent:
                                                            'center',
                                                    }}
                                                >
                                                    Nhập email để nhận mã xác
                                                    thực
                                                </Text>
                                            </Col>

                                            {isSubmit ? (
                                                <>
                                                    <Col span={24}>
                                                        <FastField
                                                            name="password"
                                                            title="Mật khẩu mới"
                                                            type="password"
                                                            placeholder="Nhập mật khẩu"
                                                            component={
                                                                PasswordField
                                                            }
                                                            maxLength={200}
                                                            titleCol={24}
                                                            inputCol={24}
                                                        />
                                                    </Col>

                                                    <Col span={24}>
                                                        <FastField
                                                            name="passwordconfirm"
                                                            title="Xác nhận mật khẩu"
                                                            type="password"
                                                            placeholder="Xác nhận mật khẩu"
                                                            component={
                                                                PasswordField
                                                            }
                                                            maxLength={200}
                                                            titleCol={24}
                                                            inputCol={24}
                                                        />
                                                    </Col>

                                                    <Col span={24}>
                                                        <FastField
                                                            name="otpValue"
                                                            title="Xác thực mã OTP"
                                                            type="text"
                                                            placeholder="Nhập 6 ký tự OTP"
                                                            component={
                                                                InputField
                                                            }
                                                            maxLength={50}
                                                            titleCol={24}
                                                            inputCol={24}
                                                        />
                                                    </Col>

                                                    <Col span={24}>
                                                        <Button
                                                            block
                                                            type="primary"
                                                            disabled={
                                                                counter > 0
                                                                    ? true
                                                                    : false
                                                            }
                                                            onClick={() =>
                                                                handleResendOTP(
                                                                    formikProps
                                                                        .values
                                                                        .username
                                                                )
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
                                                    <Col span={24}>
                                                        <Button
                                                            htmlType="submit"
                                                            block
                                                            type="primary"
                                                        >
                                                            Xác thực
                                                        </Button>
                                                    </Col>
                                                </>
                                            ) : (
                                                <>
                                                    <Col span={24}>
                                                        <FastField
                                                            name="username"
                                                            type="text"
                                                            title="Tài khoản"
                                                            placeholder="Nhập tài khoản"
                                                            component={
                                                                UserNameField
                                                            }
                                                            maxLength={50}
                                                            titleCol={24}
                                                            inputCol={24}
                                                        />
                                                    </Col>
                                                    <Col span={24}>
                                                        <Button
                                                            htmlType="submit"
                                                            block
                                                            type="primary"
                                                        >
                                                            Xác nhận
                                                        </Button>
                                                    </Col>
                                                </>
                                            )}
                                        </Row>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </div>
                    <Divider>Hoặc</Divider>
                    <div className="addtional-link">
                        <Text>
                            <Link to="/">Đăng nhập</Link>
                        </Text>
                        <Text>
                            Bạn chưa có tài khoản?
                            <Link to="/registry">
                                {' '}
                                <u>Đăng ký ngay!</u>
                            </Link>
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPage;
