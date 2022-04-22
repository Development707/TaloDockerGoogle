import React, { useCallback, useState } from 'react';
import { Button, Col, Divider, message, Row, Tag, Typography } from 'antd';
import { FastField, Form, Formik } from 'formik';
import UserNameField from 'customfield/UserNameField';
import PasswordField from 'customfield/PasswordField';
import { Link, useNavigate } from 'react-router-dom';
import { loginValues } from 'features/Account/initValues';
import { useDispatch } from 'react-redux';
import loginApi from 'api/loginAPI';
import { fetchUserProfile, setLogin } from 'app/globalSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { setLoadingAccount } from 'features/Account/accountSlice';
import {
    CloseCircleOutlined,
    FacebookOutlined,
    GoogleOutlined,
    PhoneOutlined,
} from '@ant-design/icons';
import {
    FacebookAuthProvider,
    GoogleAuthProvider,
    signInWithPopup,
} from 'firebase/auth';
import auth from 'utils/FirebaseApp';
import firebaseApi from 'api/firebaseApi';

const { Text, Title } = Typography;

LoginPage.propTypes = {};

function LoginPage(props) {
    const [isError, setError] = useState(false);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        const { username, password } = values;
        try {
            dispatch(setLoadingAccount(true));
            const { token, refreshToken } = await loginApi.login(
                username,
                password
            );
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
            dispatch(setLogin(true));
            const { role } = unwrapResult(await dispatch(fetchUserProfile()));
            if (role === 'USER') navigate('/chat', { replace: true });
            else navigate('/admin', { replace: true });
        } catch (error) {
            setError(true);
            // console.log(error);
        }
        dispatch(setLoadingAccount(false));
    };
    const handleLogin = async (username, accessToken) => {
        try {
            dispatch(setLoadingAccount(true));
            await firebaseApi.signInToken(username, accessToken).then((res) => {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('refreshToken', res.data.refreshToken);
                dispatch(setLogin(true));
                const { role } = unwrapResult(dispatch(fetchUserProfile()));
                if (role === 'USER') navigate('/chat', { replace: true });
                else navigate('/admin', { replace: true });
            });
        } catch (error) {}
    };

    const signInFacebook = async () => {
        const provider = new FacebookAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential =
                    FacebookAuthProvider.credentialFromResult(result);
                const user = result.user;
                // Send token here
                handleLogin(credential.accessToken, user.accessToken);
                console.log('user', user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.email;
                const credential =
                    FacebookAuthProvider.credentialFromError(error);
                console.log(errorCode, errorMessage, email, credential);
            });
    };
    const signInGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                // Send token here
                handleLogin(user.email, user.accessToken);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.email;
                const credential =
                    GoogleAuthProvider.credentialFromError(error);
                console.log(errorCode, errorMessage, email, credential);
            });
    };
    const handleOnClick = useCallback(
        () => navigate('/phone-login', { replace: true }),
        [navigate]
    );
    return (
        <div className="account-common-page">
            <div className="account-wrapper">
                <div className="account">
                    <Title level={2} style={{ textAlign: 'center' }}>
                        <Text style={{ color: '#4d93ff' }}>TALO</Text>
                    </Title>
                    <Divider />
                    <div className="form-account">
                        <Formik
                            initialValues={{ ...loginValues.initial }}
                            onSubmit={(values) => handleSubmit(values)}
                            validationSchema={loginValues.validationSchema}
                            enableReinitialize={true}
                        >
                            {(formikProps) => {
                                return (
                                    <Form>
                                        <Row gutter={[0, 8]}>
                                            <Col span={24}>
                                                <FastField
                                                    name="username"
                                                    component={UserNameField}
                                                    type="text"
                                                    title="Tài khoản"
                                                    placeholder="Tài khoản"
                                                    maxLength={50}
                                                    titleCol={24}
                                                    inputCol={24}
                                                />
                                            </Col>

                                            <Col span={24}>
                                                <FastField
                                                    name="password"
                                                    component={PasswordField}
                                                    type="password"
                                                    title="Mật khẩu"
                                                    placeholder="Mật khẩu"
                                                    maxLength={200}
                                                    titleCol={24}
                                                    inputCol={24}
                                                />
                                            </Col>
                                            {isError ? (
                                                <Col span={24}>
                                                    <Tag
                                                        color="error"
                                                        style={{
                                                            fontWeight: 'bold',
                                                        }}
                                                        icon={
                                                            <CloseCircleOutlined />
                                                        }
                                                    >
                                                        Tài khoản không hợp lệ
                                                    </Tag>
                                                </Col>
                                            ) : (
                                                ''
                                            )}
                                            <Col span={24}>
                                                <br />
                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                    block
                                                >
                                                    Đăng nhập
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </div>
                    <Divider>Hoặc</Divider>
                    <div className="form-account">
                        <Row gutter={[0, 8]}>
                            <Col span={24}>
                                <div className="button-login-fb">
                                    <Button
                                        block
                                        type="primary"
                                        icon={<PhoneOutlined />}
                                        onClick={handleOnClick}
                                    >
                                        Đăng nhập với số điện thoại
                                    </Button>
                                </div>
                            </Col>
                            <Col span={24}>
                                <div className="button-login-fb">
                                    <Button
                                        block
                                        type="primary"
                                        icon={<FacebookOutlined />}
                                        onClick={signInFacebook}
                                    >
                                        Đăng nhập với Facebook
                                    </Button>
                                </div>
                            </Col>
                            <Col span={24}>
                                <div className="button-login-gg">
                                    <Button
                                        block
                                        type="primary"
                                        icon={<GoogleOutlined />}
                                        onClick={signInGoogle}
                                    >
                                        Đăng nhập với Google
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    <div className="addtional-link">
                        <Link to="/forgot">Quên mật khẩu?</Link>
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

export default LoginPage;
