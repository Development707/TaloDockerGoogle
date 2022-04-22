import {
    DeleteOutlined,
    EditOutlined,
    InfoCircleFilled,
    LeftOutlined,
    PlusOutlined,
    TagFilled,
    TagTwoTone,
} from '@ant-design/icons';
import { Button, Input, message, Modal, Popover } from 'antd';
import Text from 'antd/lib/typography/Text';
import classifyApi from 'api/ClassifyApi';
import { fetchListClassify } from 'features/Chat/slice/chatSlice';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { SketchPicker } from 'react-color';
import { useDispatch, useSelector } from 'react-redux';
import './style.scss';

ModalClassify.propTypes = {
    isVisible: PropTypes.bool,
    onCancel: PropTypes.func,
    onOpen: PropTypes.func,
};

ModalClassify.defaultProps = {
    isVisible: false,
    onCancel: null,
    onOpen: null,
};

function ModalClassify({ isVisible, onCancel, onOpen }) {
    const { classifies } = useSelector((state) => state.chat);
    const [isShowModalAdd, setIsShowModalAdd] = useState(false);
    const [isModalEdit, setIsModalEdit] = useState(false);
    const dispatch = useDispatch();

    const [nameTag, setNameTag] = useState('');
    const [isShowError, setIsShowError] = useState(false);
    const [color, setColor] = useState('');
    const previousClassify = useRef();

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
    };
    const handleEditClassify = (classify) => {
        setIsModalEdit(true);
        setIsShowModalAdd(true);
        setNameTag(classify.name);
        setColor(classify.color);
        previousClassify.current = classify;
        if (onCancel) {
            onCancel();
        }
    };
    const handleDeleteClassify = (classify) => {
        confirm(classify);
    };

    const deleteClassify = async (classify) => {
        try {
            await classifyApi.deleteClassify(classify.id);
            message.success('Xóa phân loại thành công');
            dispatch(fetchListClassify());
        } catch (error) {
            message.error('Xóa phân loại thất bại');
        }
    };

    function confirm(classify) {
        Modal.confirm({
            title: 'Cảnh báo',
            content: `Bạn có thực sự muốn xóa phân loại ${classify.name}? `,
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk: () => {
                deleteClassify(classify);
            },
        });
    }

    const handleShowModalAdd = () => {
        setIsShowModalAdd(true);
        setIsModalEdit(false);
        setNameTag('');
        if (onCancel) {
            onCancel();
        }
    };

    //Modal add
    const handleCancelModalAdd = () => {
        setIsShowModalAdd(false);
    };
    const handleBackModal = () => {
        setIsShowModalAdd(false);
        setIsModalEdit(false);

        if (onOpen) {
            onOpen();
        }
    };
    const handleInputChange = (e) => {
        const value = e.target.value;
        const index = classifies.findIndex(
            (ele) => ele.name.toLowerCase() === value.toLowerCase()
        );

        if (index >= 0) {
            if (isModalEdit) {
                if (
                    previousClassify.current.name.toLowerCase() !==
                    classifies[index].name.toLowerCase()
                ) {
                    setIsShowError(true);
                }
            } else {
                setIsShowError(true);
            }
        } else {
            setIsShowError(false);
        }
        setNameTag(value);
    };

    const handleCreateClassify = async () => {
        if (isModalEdit) {
            try {
                await classifyApi.updateClassify(
                    previousClassify.current.id,
                    nameTag,
                    color
                );
                message.success('Cập nhật thành công');
                dispatch(fetchListClassify());

                if (onOpen) {
                    onOpen();
                }
            } catch (error) {
                message.error('Cập nhật thất bại');
            }
        } else {
            try {
                await classifyApi.addClassify(nameTag, color);
                message.success('Thêm phân loại thành công');
                dispatch(fetchListClassify());
            } catch (error) {
                message.error('Thêm phân loại thất bại');
            }
        }
        setIsShowModalAdd(false);

        setIsModalEdit(false);
    };
    const content = (
        <div className="popup-change-color">
            <span>Thay đổi màu thẻ</span>
            <div className="list-color">
                <SketchPicker
                    color={color}
                    onChangeComplete={(color) => {
                        setColor(color.hex);
                    }}
                />
            </div>
        </div>
    );
    return (
        <>
            <Modal
                title="Quản lý thẻ phân loại"
                visible={isVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <div className="modal-classify_wrapper">
                    <span className="modal-classify_title">
                        Danh sách thẻ phân loại
                    </span>

                    <div className="modal-classify_list">
                        {classifies.map((classify, index) => (
                            <div className="modal-classify-item" key={index}>
                                <div className="modal-classify-item--left">
                                    <div className="classify-item-tag">
                                        <TagFilled
                                            style={{
                                                color: `${classify.color}`,
                                                fontSize: '24px',
                                            }}
                                            rotate={45}
                                        />
                                    </div>
                                    <div className="classify-item-name">
                                        {classify.name}
                                    </div>
                                </div>

                                <div className="modal-classify-item--right">
                                    <div
                                        className="classify-item-edit icon-classify"
                                        onClick={() =>
                                            handleEditClassify(classify)
                                        }
                                    >
                                        <EditOutlined />
                                    </div>

                                    <div
                                        className="classify-item-remove icon-classify"
                                        onClick={() =>
                                            handleDeleteClassify(classify)
                                        }
                                    >
                                        <DeleteOutlined />
                                    </div>
                                </div>
                                <div className="modal-classify-item-amount">
                                    {classify.conversationIds.length}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div
                        className="modal-classify_add"
                        onClick={handleShowModalAdd}
                    >
                        <PlusOutlined />
                        &nbsp;Thêm phân loại
                    </div>
                </div>
            </Modal>

            <Modal
                title={
                    <div className="modal-add_header">
                        <div
                            className="modal-add_header--icon"
                            onClick={handleBackModal}
                        >
                            <LeftOutlined />
                        </div>
                        <span>
                            {isModalEdit
                                ? 'Chi tiết thẻ phân loại'
                                : 'Thêm thẻ phân loại'}
                        </span>
                    </div>
                }
                visible={isShowModalAdd}
                onOk={handleCreateClassify}
                onCancel={handleCancelModalAdd}
                okButtonProps={{
                    disabled:
                        (nameTag.trim().length > 0 ? false : true) ||
                        isShowError ||
                        !(
                            previousClassify.current?.name !== nameTag ||
                            previousClassify.current?.color !== color
                        ),
                }}
                okText={isModalEdit ? 'Cập nhật' : 'Thêm phân loại'}
                cancelText="Hủy"
            >
                <div className="modal-add-classify_wrapper">
                    <div className="modal-add-classify--title">
                        Tên thẻ phân loại
                    </div>
                    <div className="modal-add-classify--input">
                        <Input
                            placeholder="Nhập tên thẻ phân loại"
                            spellCheck={false}
                            value={nameTag}
                            size="middle"
                            onChange={handleInputChange}
                            suffix={
                                <div className="tag-select-icon">
                                    <Popover content={content} trigger="click">
                                        <Button
                                            type="text"
                                            icon={
                                                <TagFilled
                                                    style={{
                                                        color: `${color}`,
                                                        fontSize: '24px',
                                                    }}
                                                    rotate={45}
                                                />
                                            }
                                        />
                                    </Popover>
                                </div>
                            }
                        />
                    </div>

                    <div className="check-name-classify">
                        {isShowError && (
                            <Text type="danger">
                                <InfoCircleFilled />
                                Tên phân loại đã tồn tại
                            </Text>
                        )}
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default ModalClassify;
