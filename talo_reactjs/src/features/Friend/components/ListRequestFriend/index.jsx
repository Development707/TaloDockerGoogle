import { message } from 'antd';
import friendApi from 'api/friendApi';
import { fetchListFriends } from 'features/Chat/slice/chatSlice';
import {
    fetchFriends,
    fetchListRequestFriend,
    setAmountNotify,
} from 'features/Friend/friendSlice';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FriendCard from '../FriendCard';

const ListRequestFriend = ({ data }) => {
    const { amountNotify } = useSelector((state) => state.friend);
    const dispatch = useDispatch();

    const handeDenyRequest = async (value) => {
        await friendApi.deleteRequestFriend(value.id);
        dispatch(setAmountNotify(amountNotify - 1));
        dispatch(fetchListRequestFriend());
    };
    const handleOnAccept = async (value) => {
        await friendApi.acceptRequestFriend(value.id);

        dispatch(fetchListRequestFriend());
        dispatch(fetchFriends({ name: '' }));
        dispatch(fetchListFriends({ name: '' }));
        dispatch(setAmountNotify(amountNotify - 1));
        message.success('Thêm bạn thành công');
    };
    return (
        <div>
            {data &&
                data.length > 0 &&
                data.map((ele, index) => (
                    <FriendCard
                        key={index}
                        data={ele}
                        onDeny={handeDenyRequest}
                        onAccept={handleOnAccept}
                    />
                ))}
        </div>
    );
};

export default ListRequestFriend;
