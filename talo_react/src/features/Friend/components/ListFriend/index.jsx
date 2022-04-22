import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import FriendItem from '../FriendItem';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { message, Modal } from 'antd';
import { useDispatch } from 'react-redux';
import { fetchFriends } from '../../friendSlice';
import friendApi from 'api/friendApi';
import userApi from 'api/userApi';
import UserCard from 'components/UserCard';

ListFriend.propTypes = {
    data: PropTypes.array,
};

ListFriend.defaultProps = {
    data: [],
};

function ListFriend({ data }) {
    const [isVisible, setIsVisible] = useState(false);
    const [userIsFind, setUserIsFind] = useState({});
    const dispatch = useDispatch();

    const handleOnClickMenu = async (key, id) => {
        if (key === '2') {
            confirm(id);
        } else {
            setIsVisible(true);
            const tempUser = data.find((item) => item.id === id);
            const realUser = await userApi.fetchUser(tempUser.username);
            setUserIsFind(realUser);
        }
    };

    const handleCancelModalUserCard = () => {
        setIsVisible(false);
    };

    function confirm(id) {
        Modal.confirm({
            title: 'Xác nhận',
            icon: <ExclamationCircleOutlined />,
            content: (
                <span>
                    Bạn có thực sự muốn xóa{' '}
                    <b>{data.find((item) => item.id === id).name}</b> khỏi danh
                    sách bạn bè{' '}
                </span>
            ),
            okText: 'Xóa',
            cancelText: 'Hủy',
            onOk: () => handleOkModal(id),
        });
    }
    const handleOkModal = async (id) => {
        try {
            await friendApi.deleteFriend(id);
            dispatch(fetchFriends({ name: '' }));
            message.success('Xóa bạn bè thành công');
            setIsVisible(false);
        } catch (error) {
            message.error('Xóa thất bại');
        }
    };

    return (
        <Scrollbars
            autoHide={true}
            autoHideTimeout={1000}
            autoHideDuration={200}
            style={{ height: '100%', width: '100%' }}
        >
            {data.length > 0 &&
                data.map((item, index) => (
                    <FriendItem
                        key={index}
                        data={item}
                        onClickMenu={handleOnClickMenu}
                    />
                ))}

            <UserCard
                user={userIsFind}
                isVisible={isVisible}
                onCancel={handleCancelModalUserCard}
            />
        </Scrollbars>
    );
}

export default ListFriend;
