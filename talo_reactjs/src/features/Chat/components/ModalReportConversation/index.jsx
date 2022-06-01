import { Modal, Radio, Space } from 'antd';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Input } from 'antd';
const { TextArea } = Input;

ModalReportConversation.propTypes = {
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
};

ModalReportConversation.defaultProps = {
    visible: false,
    onOk: null,
    onCancel: null,
};

function ModalReportConversation({ visible, onOk, onCancel }) {
    const [value, setValue] = useState(null);
    const [reportInput, setReportInput] = useState('');

    const onChange = (e) => {
        setValue(e.target.value);
    };

    const onChangeInput = (e) => {
        setReportInput(e.target.value);
    };

    const handleOnCancel = () => {
        if (onCancel) {
            onCancel();
            setValue(null);
            setReportInput('');
        }
    };
    const handleOnOk = (titleReport) => {
        switch (value) {
            case 1:
                titleReport = 'Nội dung nhạy cảm';
                break;
            case 2:
                titleReport = 'Làm phiền';
                break;
            case 3:
                titleReport = 'Lừa đảo';
                break;
            case 4:
                titleReport = reportInput;
                break;
            default:
        }
        if (onOk) {
            onOk(titleReport);
            setReportInput('');
        }
    };
    return (
        <Modal
            title="Báo cáo"
            visible={visible}
            okText="Báo cáo"
            cancelText="Hủy"
            width={400}
            onCancel={handleOnCancel}
            onOk={handleOnOk}
        >
            <p>
                Bạn lo ngại về hội thoại này, chọn một trong những lý do dưới
                đây rồi gửi cho chúng tôi.
            </p>
            <Radio.Group onChange={onChange} value={value}>
                <Space direction="vertical">
                    <Radio value={1}>Nội dung nhạy cảm</Radio>
                    <Radio value={2}>Làm phiền</Radio>
                    <Radio value={3}>Lừa đảo</Radio>
                    <Radio value={4}>
                        Lý do khác...
                        {value === 4 ? (
                            <>
                                <div style={{ marginTop: '8px', fontSize: 13 }}>
                                    Vấn đề khác:
                                </div>
                                <TextArea
                                    showCount
                                    placeholder="Nhập lý do báo cáo"
                                    maxLength={100}
                                    style={{ width: 300, height: 100 }}
                                    onChange={onChangeInput}
                                    value={reportInput}
                                />
                            </>
                        ) : null}
                    </Radio>
                </Space>
            </Radio.Group>
        </Modal>
    );
}

export default ModalReportConversation;
