import { CaretRightOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useState } from 'react';
import ModalDetailPoll from '../../ModalDetailPoll';
import ModalViewOption from '../../ModalViewOption';
import './style.scss';
const PollMessage = ({ data }) => {
    const [isVisibleDetail, setIsVisibleDetail] = useState(false);
    const [isVisibleOption, setIsVisibleOption] = useState(false);

    const getNumberJoinVote = () => {
        let tempUserIds = [];
        data.options.forEach((option) => {
            option.userIds.forEach((userId) => {
                tempUserIds.push(userId);
            });
        });

        let uniqueUser = tempUserIds.filter((p, index) => {
            return tempUserIds.indexOf(p) === index;
        });
        return uniqueUser;
    };
    const checkNumberUserSelected = () => {
        let count = 0;
        data.options.forEach((option) => {
            if (option.userIds.length > 0) {
                count += option.userIds.length;
            }
        });
        return count;
    };

    const countingPercent = (amoutVote) => {
        return (amoutVote / getNumberJoinVote().length) * 100;
    };

    const handleDetailVote = () => {
        setIsVisibleDetail(true);
    };

    const handleViewOption = () => {
        setIsVisibleOption(true);
    };
    return (
        <div className="poll-message-wrapper">
            <div className="poll-message">
                <h3>{data.content}</h3>

                {getNumberJoinVote().length > 0 && (
                    <span
                        onClick={handleDetailVote}
                        className="poll-message_number-voted"
                    >
                        Đã có {checkNumberUserSelected()} lượt bình chọn{' '}
                        <CaretRightOutlined />
                    </span>
                )}
                <div className="poll-message_list">
                    {data.options.map((ele, index) => {
                        if (index < 3) {
                            return (
                                <div className="poll-message_item" key={index}>
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
                            );
                        }
                    })}
                </div>
                {data.options.length > 3 && (
                    <small>{`* Còn ${
                        data.options.length - 3
                    } lựa chọn khác `}</small>
                )}

                <div className="vote-message_view-all">
                    <Button
                        onClick={handleViewOption}
                        type="primary"
                        style={{ width: '100%' }}
                    >
                        Xem lựa chọn
                    </Button>
                </div>
            </div>
            <ModalDetailPoll
                visible={isVisibleDetail}
                onCancel={() => setIsVisibleDetail(false)}
                data={data.options}
            />
            <ModalViewOption
                isModalVisible={isVisibleOption}
                onCancel={() => setIsVisibleOption(false)}
                data={data}
                onShowDetail={() => setIsVisibleDetail(true)}
            />
        </div>
    );
};

export default PollMessage;
