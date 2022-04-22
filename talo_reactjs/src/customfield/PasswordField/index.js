import React from 'react';
import PropTypes from 'prop-types';
import { Col, Input, Row, Typography } from 'antd';
import { ErrorMessage } from 'formik';
import TagCustom from 'components/TagCustom';
import { LockOutlined } from '@ant-design/icons';

const { Text } = Typography;

PasswordField.propTypes = {
    title: PropTypes.string,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    maxLength: PropTypes.number,
    isRequire: PropTypes.bool,
    disabled: PropTypes.bool,
    titleCol: PropTypes.number,
    inputCol: PropTypes.number,
    size: PropTypes.string,
};

PasswordField.defaultProps = {
    title: '',
    type: 'text',
    placeholder: '',
    maxLength: 50,
    isRequire: false,
    disabled: false,
    titleCol: 24,
    inputCol: 24,
    size: 'middle',
};

function PasswordField(props) {
    const {
        field,
        title,
        type,
        placeholder,
        maxLength,
        disabled,
        isRequire = false,
        titleCol,
        inputCol,
        size,
    } = props;
    const { name } = field;

    return (
        <Row>
            <Col span={titleCol}>
                <Text strong>
                    {title}

                    {isRequire && <Text type="danger"> *</Text>}
                </Text>
            </Col>
            <Col span={inputCol}>
                <Input.Password
                    {...field}
                    prefix={<LockOutlined />}
                    type={type}
                    maxLength={maxLength}
                    placeholder={placeholder}
                    disabled={disabled}
                    size={size}
                />
                <ErrorMessage name={name}>
                    {(text) => <TagCustom title={text} color="error" />}
                </ErrorMessage>
            </Col>
        </Row>
    );
}

export default PasswordField;
