import { Empty, Skeleton } from 'antd';
import ConversationAvatar from 'features/Chat/components/ConversationAvatar';
import {
    fetchListMessages,
    setCurrentConversation,
} from 'features/Chat/slice/chatSlice';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ConverGroupSearch = ({ data }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClickItem = (value) => {
        dispatch(setCurrentConversation(value.id));
        dispatch(fetchListMessages({ conversationId: value.id, size: 10 }));
        navigate('/chat');
    };

    return (
        <div className="list-filter">
            {data.length === 0 && <Empty />}

            {data.map((item, index) => (
                <div
                    key={index}
                    className="list-filter_item"
                    onClick={() => handleClickItem(item)}
                >
                    <ConversationAvatar
                        avatar={item.avatar.url}
                        totalMembers={item.totalMembers}
                        type={item.type}
                        name={item.name}
                    />

                    <div className="list-filter_name">{item.name}</div>
                </div>
            ))}
        </div>
    );
};

export default ConverGroupSearch;
