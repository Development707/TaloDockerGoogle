import React from 'react';
import { Button, Col, Divider, Row, Typography } from 'antd';
import { FastField, Form, Formik } from 'formik';
import UserNameField from 'customfield/UserNameField';
import { Link } from 'react-router-dom';
import { forgotValues } from 'features/Account/initValues';

const { Text, Title } = Typography;

ForgotPage.propTypes = {};

function ForgotPage(props) {
    const handleSubmit = (values) => {
        console.log(values);
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
                            validationSchema={forgotValues.validationSchema}
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
                                                    Nhập email/SĐT để nhận mã
                                                    xác thực
                                                </Text>
                                            </Col>
                                            <>
                                                <Col span={24}>
                                                    <FastField
                                                        name="username"
                                                        component={
                                                            UserNameField
                                                        }
                                                        type="text"
                                                        title="Tài khoản"
                                                        placeholder="Nhập tài khoản"
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
                                        </Row>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </div>
                    <Divider>Hoặc</Divider>
                    <div className="addtional-link">
                        <Link to="/">Đăng nhập</Link>
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
