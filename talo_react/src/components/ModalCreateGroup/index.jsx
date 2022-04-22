import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Col, Divider, Input, Modal, Row } from 'antd';
import {
    EditOutlined,
    InfoCircleFilled,
    SearchOutlined,
} from '@ant-design/icons';
import Text from 'antd/lib/typography/Text';
import PersonalIcon from 'features/Chat/components/PersonalIcon';
import ItemsSelected from 'components/ItemsSelected';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import './style.scss';

ModalCreateGroup.propTypes = {
    loading: PropTypes.bool,
    isVisible: PropTypes.bool,
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
};

ModalCreateGroup.defaultProps = {
    loading: false,
    isVisible: false,
    onCancel: null,
    onOk: null,
};
function ModalCreateGroup({ loading, isVisible, onCancel, onOk }) {
    const [itemSelected, setItemSelected] = useState([]);
    const [nameGroup, setNameGroup] = useState('');
    const [isShowError, setIsShowError] = useState(false);
    const [valueInputFriend, setvalueInputFriend] = useState('');
    const [checkListFriend, setCheckListFriend] = useState([]);
    const [initialFriend, setInitialFriend] = useState([]);

    const { friends } = useSelector((state) => state.chat);

    useEffect(() => {
        if (isVisible) {
            setInitialFriend(friends);
        } else {
            setvalueInputFriend('');
            setCheckListFriend([]);
            setNameGroup('');
            setIsShowError(false);
        }
        //eslint-disable-next-line
    }, [isVisible]);

    const handleOnOk = () => {
        const userIds = itemSelected.map((item) => item.id);

        if (onOk) {
            onOk({ name: nameGroup, userIds: userIds });
        }
    };

    const handleOnCancel = () => {
        if (onCancel) {
            onCancel();
        }
    };

    const handleOnBlur = () => {
        !nameGroup.length > 0 ? setIsShowError(true) : setIsShowError(false);
    };

    const handleOnChangeInput = (e) => {
        const value = e.target.value;
        setNameGroup(value);
    };

    const handleOnChangeFriend = (e) => {
        const value = e.target.value;
        setvalueInputFriend(value);

        if (!value && isVisible) {
            setInitialFriend(friends);
        } else {
            // const tempFriends = [...initalFriend];
            const realFriends = [];
            friends.forEach((item) => {
                const index = item.name.search(value);
                if (index > -1) {
                    realFriends.push(item);
                }
            });
            setInitialFriend(realFriends);
        }
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

        setvalueInputFriend('');
        setInitialFriend(friends);
    };

    const handleOnChangeCheckBox = (e) => {
        const value = e.target.value;

        // console.log('value', value);
        // checklish value ton tai
        const index = checkListFriend.findIndex((item) => item === value);
        let checkListFriendTemp = [...checkListFriend];
        let itemSelectedTemp = [...itemSelected];

        //value ton tai trong checklist
        if (index !== -1) {
            itemSelectedTemp = itemSelectedTemp.filter(
                (item) => item.id !== value
            );

            checkListFriendTemp = checkListFriendTemp.filter(
                (item) => item !== value
            );
        } else {
            //chua co trong checklist
            checkListFriendTemp.push(value);

            const index = initialFriend.findIndex((item) => item.id === value);

            if (index !== -1) {
                itemSelectedTemp.push(initialFriend[index]);
            }
        }

        setCheckListFriend(checkListFriendTemp);
        setItemSelected(itemSelectedTemp);
    };

    return (
        <Modal
            title="Tạo nhóm"
            confirmLoading={loading}
            visible={isVisible}
            onOk={handleOnOk}
            onCancel={handleOnCancel}
            okText="Tạo nhóm"
            cancelText="Hủy"
            okButtonProps={{
                disabled: !(itemSelected.length > 1 && nameGroup.length > 0),
            }}
            style={{ top: 20 }}
        >
            <div id="modal-create-group">
                <div className="heading-group">
                    <div className="select-icon">
                        <EditOutlined />
                    </div>

                    <div className="input-name-group">
                        <Input
                            size="middle"
                            placeholder="Nhập tên nhóm"
                            style={{ width: '100%' }}
                            onBlur={handleOnBlur}
                            value={nameGroup}
                            onChange={handleOnChangeInput}
                            allowClear
                        />

                        {isShowError && (
                            <Text type="danger">
                                <InfoCircleFilled /> Tên nhóm không được để
                                trống
                            </Text>
                        )}
                    </div>
                </div>
                <div className="span-title">
                    <span>Thêm bạn vào nhóm</span>
                </div>

                <div className="search-friend-input">
                    <Input
                        size="middle"
                        placeholder="Nhập tên"
                        style={{ width: '100%' }}
                        prefix={<SearchOutlined />}
                        onChange={handleOnChangeFriend}
                        value={valueInputFriend}
                        allowClear
                    />
                </div>

                <Divider />
                <div className="list-friend-interact">
                    <div
                        className={`list-friend-interact--left ${
                            itemSelected.length > 0 ? '' : 'full-container'
                        }`}
                    >
                        <div className="title-list-friend">
                            <span>Danh sách bạn bè</span>
                        </div>

                        <div className="checkbox-list-friend">
                            <Checkbox.Group
                                style={{ width: '100%' }}
                                value={checkListFriend}
                            >
                                <Row gutter={[0, 12]}>
                                    {initialFriend.map((item, index) => (
                                        <Col span={24} key={index}>
                                            <Checkbox
                                                value={item.id}
                                                onChange={
                                                    handleOnChangeCheckBox
                                                }
                                            >
                                                <div className="item-checkbox">
                                                    <PersonalIcon
                                                        demention={36}
                                                        avatar={item.avatar.url}
                                                        name={item.name}
                                                    />

                                                    <span className="item-name">
                                                        {item.name}
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
                        }`}
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

export default ModalCreateGroup;
