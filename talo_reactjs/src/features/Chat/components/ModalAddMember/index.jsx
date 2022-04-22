import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Col, Divider, Input, Modal, Row } from 'antd';
import {
    EditOutlined,
    InfoCircleFilled,
    SearchOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import Text from 'antd/lib/typography/Text';
import PersonalIcon from '../PersonalIcon';
import ItemsSelected from 'components/ItemsSelected';
import { useEffect } from 'react';
import './style.scss';

ModalAddMember.propTypes = {
    onOk: PropTypes.func,
    loading: PropTypes.bool,
    onCancel: PropTypes.func,
    isVisible: PropTypes.bool.isRequired,
    typeModal: PropTypes.string.isRequired,
};

ModalAddMember.defaultProps = {
    onOk: null,
    loading: false,
    onCancel: null,
};
function ModalAddMember({ loading, onOk, onCancel, isVisible, typeModal }) {
    const { friends, memberInConversation } = useSelector(
        (state) => state.chat
    );
    const initialValue = memberInConversation.map((ele) => ele.id);
    const [nameGroup, setNameGroup] = useState('');
    const [checkListFriend, setCheckListFriend] = useState([]);
    const [isShowError, setIsShowError] = useState(false);
    const [itemSelected, setItemSelected] = useState([]);
    const [friendInput, setFriendInput] = useState('');

    const [initialFriend, setInitialFriend] = useState([]);

    useEffect(() => {
        if (isVisible) {
            setInitialFriend(friends);
        } else {
            setFriendInput('');
            setCheckListFriend([]);
            setItemSelected([]);
            setNameGroup('');
            setIsShowError(false);
        }
    }, [isVisible]);

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
    };

    // disable những người đã trong nhóm
    const checkInitialValue = (value) => {
        const index = initialValue.findIndex((ele) => ele === value);
        return index > -1;
    };

    const handleOk = () => {
        const userIds = itemSelected.map((ele) => ele.id);

        if (onOk) {
            if (typeModal === 'DUAL') {
                onOk([...checkListFriend], nameGroup);
            } else {
                onOk(userIds);
            }
        }
    };

    const handleOnBlur = (e) => {
        !nameGroup.length > 0 ? setIsShowError(true) : setIsShowError(false);
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setNameGroup(value);
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setFriendInput(value);

        if (!value && isVisible) {
            setInitialFriend(friends);
        } else {
            const realFriends = [];

            friends.forEach((ele) => {
                const index = ele.name.search(value);

                if (index > -1) {
                    realFriends.push(ele);
                }
            });
            setInitialFriend(friends);
        }
    };
    const handleChangeCheckBox = (e) => {
        const value = e.target.value;

        // console.log('value', value);
        // check checklist co data chua
        const index = checkListFriend.findIndex((item) => item === value);
        let checkListFriendTemp = [...checkListFriend];
        let itemSelectedTemp = [...itemSelected];

        //neu co trong checklist
        if (index !== -1) {
            itemSelectedTemp = itemSelectedTemp.filter(
                (item) => item.id !== value
            );

            checkListFriendTemp = checkListFriendTemp.filter(
                (item) => item !== value
            );
        } else {
            //neu chua co
            checkListFriendTemp.push(value);

            const index = initialFriend.findIndex((item) => item.id === value);

            if (index !== -1) {
                itemSelectedTemp.push(initialFriend[index]);
            }
        }

        setCheckListFriend(checkListFriendTemp);
        setItemSelected(itemSelectedTemp);
    };
    const handleRemoveItem = (id) => {
        let checkListFriendTemp = [...checkListFriend];
        let itemSelectedTemp = [...itemSelected];

        checkListFriendTemp = checkListFriendTemp.filter((item) => item !== id);
        itemSelectedTemp = itemSelectedTemp.filter((item) => item.id !== id);
        // console.log('checkListFriendTemp', checkListFriendTemp);
        // console.log('itemSelectedTemp', itemSelectedTemp);

        setCheckListFriend(checkListFriendTemp);
        setItemSelected(itemSelectedTemp);

        setFriendInput('');
        setInitialFriend(friends);
    };
    return (
        <Modal
            title={typeModal === 'GROUP' ? 'Thêm thành viên' : 'Tạo nhóm'}
            visible={isVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            centered={true}
            okText="Xác nhận"
            cancelText="Hủy"
            okButtonProps={{
                disabled:
                    (!nameGroup.trim().length > 0 && typeModal === 'DUAL') ||
                    checkListFriend.length < 1,
            }}
            confirmLoading={loading}
        >
            <div id="modal-add-member">
                {typeModal === 'DUAL' && (
                    <>
                        <div className="heading-create-group">
                            <div className="create-name-icon">
                                <EditOutlined />
                            </div>

                            <div className="input-name-create-group">
                                <Input
                                    size="middle"
                                    placeholder="Nhập tên nhóm"
                                    style={{ width: '100%' }}
                                    onBlur={handleOnBlur}
                                    value={nameGroup}
                                    onChange={handleChange}
                                />

                                {isShowError && (
                                    <Text type="danger">
                                        <InfoCircleFilled /> Tên nhóm không được
                                        để trống
                                    </Text>
                                )}
                            </div>
                        </div>

                        <div className="addMember-title">Thêm bạn vào nhóm</div>
                    </>
                )}

                <div className="search-friend-input">
                    <Input
                        size="middle"
                        placeholder="Nhập tên bạn muốn tìm kiếm"
                        style={{ width: '100%' }}
                        prefix={<SearchOutlined />}
                        onChange={handleSearch}
                        value={friendInput}
                    />
                </div>

                <Divider />

                <div className="list-friend-interact">
                    <div className="list-friend-interact--left">
                        <div className="title-list-friend">
                            <span>Danh sách bạn bè</span>
                        </div>
                        <div className="checkbox-list-friend">
                            <Checkbox.Group
                                style={{ width: '100%' }}
                                value={checkListFriend}
                            >
                                <Row gutter={[0, 12]}>
                                    {initialFriend.map((ele, index) => (
                                        <Col span={24} key={index}>
                                            <Checkbox
                                                disabled={checkInitialValue(
                                                    ele.id
                                                )}
                                                value={ele.id}
                                                onChange={handleChangeCheckBox}
                                            >
                                                <div className="item-checkbox">
                                                    <PersonalIcon
                                                        demention={36}
                                                        avatar={ele.avatar?.url}
                                                        name={ele.name}
                                                    />

                                                    <span className="item-name">
                                                        {ele.name}
                                                    </span>
                                                </div>
                                            </Checkbox>
                                        </Col>
                                    ))}
                                </Row>
                            </Checkbox.Group>
                        </div>
                    </div>

                    <div
                        className={`list-friend-interact--right ${
                            itemSelected.length > 0 ? '' : 'close'
                        } `}
                    >
                        <div className="title-list-friend-checked">
                            <strong>
                                Đã chọn:{' '}
                                {itemSelected.length > 0 && itemSelected.length}
                            </strong>
                        </div>

                        <div className="checkbox-list-friend">
                            <ItemsSelected
                                items={itemSelected}
                                onRemove={handleRemoveItem}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default ModalAddMember;
