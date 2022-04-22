import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
    Avatar,
    Button,
    Checkbox,
    Form,
    Input,
    message,
    Modal,
    Spin,
} from 'antd';
import {
    CaretRightOutlined,
    MinusCircleOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import PersonalIcon from '../PersonalIcon';
import { equalsArray } from 'utils/arrayHelper';
import pollApi from 'api/pollApi';
import './style.scss';

ModalViewOption.propTypes = {
    isModalVisible: PropTypes.bool,
    onCancel: PropTypes.func,
    data: PropTypes.object,
    onShowDetail: PropTypes.func,
};

ModalViewOption.defaultProps = {
    isModalVisible: false,
    onCancel: null,
    data: {},
    onShowDetail: null,
};

function ModalViewOption({ isModalVisible, onCancel, data, onShowDetail }) {
    const [form] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [infoPoll, setInfoPoll] = useState(data);
    const { user } = useSelector((state) => state.global);
    const { memberInConversation } = useSelector((state) => state.chat);
    const [checkList, setCheckList] = useState([]);
    const [valueForm, setValueForm] = useState(null);
    const preValue = useRef();

    useEffect(() => {
        setInfoPoll(data);
    }, [data]);

    const getDefaultValues = () => {
        let tempValue = [];
        infoPoll.options.forEach((option) => {
            option.userIds.forEach((userId) => {
                if (userId.id === user.id) {
                    tempValue.push(option.name);
                }
            });
        });
        return tempValue;
    };

    useEffect(() => {
        if (isModalVisible) {
            preValue.current = getDefaultValues();
            setCheckList(getDefaultValues());
        } else {
            form.resetFields();
        }
    }, [isModalVisible]);

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
    };
    function handleOk() {
        form.validateFields()
            .then(async ({ options }) => {
                setConfirmLoading(true);
                try {
                    if (
                        preValue.current &&
                        !equalsArray(preValue.current, checkList)
                    ) {
                        if (preValue.current.length > 0) {
                            await pollApi.deleteSelect(
                                infoPoll.id,
                                preValue.current
                            );
                        }
                        await pollApi.selectPoll(infoPoll.id, checkList);
                        message.success('Cập nhật lựa chọn thành công');
                    }

                    if (options && options.length > 0) {
                        const newField = options.map((ele) => ele.name);
                        const tempSelect = options.filter(
                            (ele) => ele.checkbox === true
                        );
                        const realSelect = tempSelect.map((ele) => ele.name);

                        await pollApi.addPoll(infoPoll.id, newField);
                        if (realSelect.length > 0) {
                            await pollApi.selectPoll(infoPoll.id, realSelect);
                        }
                        message.success('Thêm lựa chọn thành công');
                    }
                    handleCancel();
                } catch (error) {
                    message.error('Đã có lỗi xảy ra');
                }
                setConfirmLoading(false);
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    }

    const footer = (
        <div className="footer_wrapper">
            <div className="footer_right-btn">
                <Button onClick={handleCancel}>Hủy</Button>
                <Button
                    type="primary"
                    onClick={handleOk}
                    icon={<Spin spinning={confirmLoading} />}
                >
                    Xác nhận
                </Button>
            </div>
        </div>
    );

    const getNumberJoinPoll = () => {
        let tempUserIds = [];
        infoPoll.options.forEach((option) => {
            option.userIds.forEach((userId) => {
                tempUserIds.push(userId);
            });
        });

        let uniqueUser = tempUserIds.filter((p, index) => {
            return tempUserIds.indexOf(p) === index;
        });

        return uniqueUser;
    };

    const getNumberPolls = () => {
        const amount = infoPoll.options.reduce((pre, cur) => {
            const amoutnPre = pre.userIds?.length || 0;
            const amountCur = cur.userIds.length || 0;
            return amoutnPre + amountCur;
        });
        return amount;
    };
    const handleShowDetail = () => {
        if (onShowDetail) {
            onShowDetail();
        }
    };

    const handleCheckboxChange = (values) => {
        setCheckList(values);

        let tempOptions = [...infoPoll.options];

        let newOptions = tempOptions.map((ele) => {
            let tempUserIds = ele.userIds.filter((ele) => {
                return ele.id !== user.id;
            });
            return {
                ...ele,
                userIds: tempUserIds,
            };
        });

        let options = newOptions.map((optionsEle) => {
            const flag = values.find((ele) => optionsEle.name === ele);
            if (flag) {
                let tempOptionSearch = {
                    ...optionsEle,
                    userIds: [...optionsEle.userIds],
                };
                tempOptionSearch.userIds.push(user);

                return tempOptionSearch;
            }
            return optionsEle;
        });
        console.log('options', options);

        setInfoPoll({ ...infoPoll, options });
    };

    const countingPercent = (amountVote) => {
        const result = (amountVote / getNumberJoinPoll().length) * 100;
        if (isNaN(result)) {
            return 0;
        }
        return result;
    };

    const getUserFromConver = (userId) => {
        return memberInConversation.find((ele) => ele.id === userId);
    };

    const handleValueChangeAdd = (_, allValues) => {
        setValueForm(allValues);
    };

    return (
        <Modal
            title="Bình chọn"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={footer}
            centered
            bodyStyle={{ padding: '2rem 1rem', background: '#f4f5f7' }}
        >
            <div className="modal-view-option">
                <div className="modal-view-option_title">
                    <h3>{infoPoll?.content}</h3>
                    <small>
                        Tạo bởi <strong>{infoPoll?.user?.name}</strong>
                    </small>

                    {getNumberPolls() > 0 && (
                        <p className="overview-text" onClick={handleShowDetail}>
                            {`${
                                getNumberJoinPoll().length
                            } người tham gia ${getNumberPolls()} lượt bình chọn `}
                            <CaretRightOutlined />
                        </p>
                    )}

                    <div className="modal-view-option_list">
                        <Checkbox.Group
                            onChange={handleCheckboxChange}
                            value={getDefaultValues()}
                        >
                            {infoPoll.options.map((ele, index) => (
                                <div
                                    className="modal-view-option_item"
                                    key={index}
                                >
                                    <div className="modal-view-option_checkbox">
                                        <Checkbox
                                            value={ele.name}
                                            checked={true}
                                        >
                                            <div className="poll-message_item">
                                                <span className="poll-message_name-option">
                                                    {ele.name}
                                                </span>
                                                <strong className="poll-message_number-voted">
                                                    {ele.userIds.length}
                                                </strong>

                                                <div
                                                    className="poll-message_progress"
                                                    style={{
                                                        width: `${countingPercent(
                                                            ele.userIds.length
                                                        )}%`,
                                                    }}
                                                />
                                            </div>
                                        </Checkbox>
                                    </div>

                                    <div className="modal-view-option_avatar">
                                        <Avatar.Group
                                            maxCount={1}
                                            maxStyle={{
                                                color: '#f56a00',
                                                backgroundColor: '#fde3cf',
                                            }}
                                        >
                                            {ele.userIds.length > 0 &&
                                                memberInConversation.length >
                                                    0 &&
                                                ele.userIds.map(
                                                    (ele, index) => {
                                                        if (
                                                            getUserFromConver(
                                                                ele.id
                                                            )
                                                        ) {
                                                            return (
                                                                <PersonalIcon
                                                                    key={index}
                                                                    name={
                                                                        ele?.name
                                                                    }
                                                                    avatar={
                                                                        ele
                                                                            ?.avatar
                                                                            .url
                                                                    }
                                                                    demention={
                                                                        32
                                                                    }
                                                                />
                                                            );
                                                        } else {
                                                            return (
                                                                <PersonalIcon
                                                                    key={index}
                                                                    noneUser={
                                                                        true
                                                                    }
                                                                    demention={
                                                                        32
                                                                    }
                                                                />
                                                            );
                                                        }
                                                    }
                                                )}
                                        </Avatar.Group>
                                    </div>
                                </div>
                            ))}
                        </Checkbox.Group>
                    </div>
                    <div className="modal-view-option_add">
                        <Form
                            name="dynamic_form_nest_item"
                            layout="vertical"
                            form={form}
                            onValuesChange={handleValueChangeAdd}
                        >
                            <Form.List name="options">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(
                                            (
                                                {
                                                    key,
                                                    name,
                                                    fieldKey,
                                                    ...restField
                                                },
                                                index
                                            ) => (
                                                <div
                                                    key={key}
                                                    className="modal-view-option_form"
                                                >
                                                    <div className="form-checkbox">
                                                        <Form.Item
                                                            {...restField}
                                                            name={[
                                                                name,
                                                                'checkbox',
                                                            ]}
                                                            fieldKey={[
                                                                fieldKey,
                                                                'checkbox',
                                                            ]}
                                                            valuePropName="checked"
                                                        >
                                                            <Checkbox />
                                                        </Form.Item>
                                                    </div>
                                                    <div className="form-input">
                                                        <Form.Item
                                                            {...restField}
                                                            name={[
                                                                name,
                                                                'name',
                                                            ]}
                                                            fieldKey={[
                                                                fieldKey,
                                                                'name',
                                                            ]}
                                                            validateTrigger={[
                                                                'onChange',
                                                                'onBlur',
                                                            ]}
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message:
                                                                        'Nhập thông tin lựa chọn',
                                                                },
                                                                ({
                                                                    getFieldValue,
                                                                }) => ({
                                                                    validator(
                                                                        _,
                                                                        value
                                                                    ) {
                                                                        const tempValue =
                                                                            value
                                                                                ? value.toLowerCase()
                                                                                : value;
                                                                        let count = 0;
                                                                        getFieldValue(
                                                                            'options'
                                                                        ).forEach(
                                                                            (
                                                                                ele
                                                                            ) => {
                                                                                if (
                                                                                    ele &&
                                                                                    ele.name.toLowerCase() ===
                                                                                        tempValue
                                                                                ) {
                                                                                    count += 1;
                                                                                }
                                                                            }
                                                                        );
                                                                        const checkDuplicate =
                                                                            infoPoll.options.find(
                                                                                (
                                                                                    ele
                                                                                ) =>
                                                                                    ele.name.toLowerCase() ===
                                                                                    tempValue
                                                                            );
                                                                        if (
                                                                            value &&
                                                                            checkDuplicate
                                                                        ) {
                                                                            return Promise.reject(
                                                                                new Error(
                                                                                    'Các lựa chọn không được trùng nhau'
                                                                                )
                                                                            );
                                                                        }
                                                                        if (
                                                                            value &&
                                                                            count >
                                                                                1
                                                                        ) {
                                                                            return Promise.reject(
                                                                                new Error(
                                                                                    'Các lựa chọn không được trùng nhau'
                                                                                )
                                                                            );
                                                                        }
                                                                        return Promise.resolve();
                                                                    },
                                                                }),
                                                            ]}
                                                        >
                                                            <Input
                                                                spellCheck={
                                                                    false
                                                                }
                                                                placeholder={`Lựa chọn ${
                                                                    infoPoll &&
                                                                    infoPoll
                                                                        .options
                                                                        .length +
                                                                        index +
                                                                        1
                                                                }`}
                                                                style={{
                                                                    width: '100%',
                                                                }}
                                                                suffix={
                                                                    fields.length >
                                                                    0 ? (
                                                                        <MinusCircleOutlined
                                                                            className="dynamic-delete-button"
                                                                            onClick={() =>
                                                                                remove(
                                                                                    name
                                                                                )
                                                                            }
                                                                        />
                                                                    ) : null
                                                                }
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                        <Form.Item>
                                            <Button
                                                type="default"
                                                onClick={() => add()}
                                                icon={<PlusOutlined />}
                                            >
                                                Thêm lựa chọn
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Form>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default ModalViewOption;
