import { CaretDownOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import pollApi from 'api/pollApi';
import { fetchPolls, updatePoll } from 'features/Chat/slice/chatSlice';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PollMessage from '../MessageType/PollMessage';

const TabPanePoll = () => {
    const { currentConversation, polls, totalPagesVote } = useSelector(
        (state) => state.chat
    );
    const dispatch = useDispatch();

    const [query, setQuery] = useState({
        page: 0,
        size: 4,
    });

    useEffect(() => {
        setQuery({
            page: 0,
            size: 4,
        });
        dispatch(
            fetchPolls({
                conversationId: currentConversation,
                ...query,
            })
        );
    }, [currentConversation]);

    const handleIncreasePage = async () => {
        const res = await pollApi.getPolls(
            currentConversation,
            query.page + 1,
            query.size
        );
        const { data } = res;
        dispatch(updatePoll([...polls, ...data]));
        setQuery({
            size: query.size,
            page: query.page + 1,
        });
    };
    return (
        <div className="tabpane-poll">
            {polls.map((ele, index) => (
                <div className="tabpane-poll-item" key={index}>
                    <PollMessage data={ele} />
                </div>
            ))}

            {query.page + 1 < totalPagesVote && (
                <Button
                    icon={<CaretDownOutlined />}
                    block
                    type="primary"
                    onClick={handleIncreasePage}
                >
                    Xem thêm
                </Button>
            )}
        </div>
    );
};

export default TabPanePoll;
