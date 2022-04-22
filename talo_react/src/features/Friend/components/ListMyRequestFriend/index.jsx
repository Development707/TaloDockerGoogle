import friendApi from 'api/friendApi';
import { fetchListMyRequestFriend } from 'features/Friend/friendSlice';
import React from 'react';
import { useDispatch } from 'react-redux';
import FriendCard from '../FriendCard';

const ListMyRequestFriend = ({ data }) => {
    const dispatch = useDispatch();

    const handleRemoveMyRequest = async (value) => {
        await friendApi.deleteSentRequestFriend(value.id);
        dispatch(fetchListMyRequestFriend());
    };
    return (
        <div className="list-my-request-friend">
            {data &&
                data.length > 0 &&
                data.map((item, index) => (
                    <FriendCard
                        key={index}
                        isMyRequest={true}
                        data={item}
                        onCancel={handleRemoveMyRequest}
                    />
                ))}
        </div>
    );
};

export default ListMyRequestFriend;
