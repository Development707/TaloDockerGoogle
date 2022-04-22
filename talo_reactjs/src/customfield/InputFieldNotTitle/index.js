import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { ErrorMessage } from 'formik';
import TagCustom from 'components/TagCustom';

InputFieldNotTitle.propTypes = {
    type: PropTypes.string,
    placeHolder: PropTypes.string,
    maxLength: PropTypes.number,
    disabled: PropTypes.bool,
};

InputFieldNotTitle.defaultProps = {
    type: 'text',
    placeHolder: '',
    maxLength: 100,
    disabled: false,
};
function InputFieldNotTitle(props) {
    const { field, type, placeHolder, maxLength, disabled } = props;
    const { name } = field;
    return (
        <div>
            <Input
                {...field}
                type={type}
                maxLength={maxLength}
                placeholder={placeHolder}
                disabled={disabled}
            />
            <ErrorMessage name={name}>
                {(text) => <TagCustom title={text} color="error" />}
            </ErrorMessage>
        </div>
    );
}

export default InputFieldNotTitle;
