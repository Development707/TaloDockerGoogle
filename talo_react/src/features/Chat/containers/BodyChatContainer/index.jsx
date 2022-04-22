import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Scrollbars from 'react-custom-scrollbars';
import { Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import UserMessage from 'features/Chat/components/UserMessage';
import DividerCustom from 'features/Chat/components/DividerCustom';
import {
    fetchNextPageMessage,
    fetchNextPageOfChannel,
    setRollUpPage,
} from 'features/Chat/slice/chatSlice';
import './style.scss';

BodyChatContainer.propTypes = {
    scrollId: PropTypes.string,
    onSCrollDown: PropTypes.string,
    onBackToBottom: PropTypes.func,
    onLoading: PropTypes.func,
    onReply: PropTypes.func,
    onMention: PropTypes.func,
};

BodyChatContainer.defaultProps = {
    scrollId: '',
    onSCrollDown: '',
    onBackToBottom: null,
    onLoading: null,
    onReply: null,
    onMention: null,
};

function BodyChatContainer({
    scrollId,
    onSCrollDown,
    onBackToBottom,
    onResetScrollButton,
    turnOnScrollButoon,
    onReply,
    onMention,
}) {
    const { user } = useSelector((state) => state.global);

    const {
        messages,
        currentConversation,
        currentPage,
        lastViewOfMember,
        currentChannel,
    } = useSelector((state) => state.chat);

    const [loading, setLoading] = useState(false);
    const [position, setPosition] = useState(1);

    const scrollbars = useRef();
    const previousHeight = useRef();
    const tempPosition = useRef();

    const dispatch = useDispatch();

    useEffect(() => {
        if (turnOnScrollButoon) {
            scrollbars.current.scrollToBottom();
            onResetScrollButton(false);
        }
        //eslint-disable-next-line
    }, [turnOnScrollButoon]);

    useEffect(() => {
        const fetchMessageWhenRollUp = async () => {
            if (currentChannel) {
                dispatch(
                    fetchNextPageOfChannel({
                        channelId: currentChannel,
                        page: currentPage,
                        size: 10,
                    })
                );
            } else {
                dispatch(
                    fetchNextPageMessage({
                        conversationId: currentConversation,
                        page: currentPage,
                        size: 10,
                    })
                );
            }
        };
        async function fetchNextListMessage() {
            if (currentPage > 0) {
                setLoading(true);
                await fetchMessageWhenRollUp();
                setLoading(false);

                scrollbars.current.scrollTop(
                    scrollbars.current.getScrollHeight() -
                        previousHeight.current
                );
            }
        }
        fetchNextListMessage();

        //eslint-disable-next-line
    }, [currentPage]);

    useEffect(() => {
        if (
            onSCrollDown &&
            scrollbars.current.getScrollHeight() >
                scrollbars.current.getClientHeight()
        ) {
            if (position >= 0.95) {
                scrollbars.current.scrollToBottom();
            } else {
                if (onBackToBottom) {
                    onBackToBottom(true, 'Có tin nhắn mới');
                }
            }
        }
        //eslint-disable-next-line
    }, [onSCrollDown]);

    const renderMessages = (messages) => {
        const result = [];

        for (let i = 0; i < messages.length; i++) {
            const preMessage = messages[i - 1];
            const currentMessage = messages[i];

            const senderId = currentMessage.user.id;
            const isMyMessage = senderId === user.id ? true : false;

            // =============
            if (i === 0) {
                result.push(
                    <UserMessage
                        key={i}
                        message={currentMessage}
                        isMyMessage={isMyMessage}
                        conditionTime={true}
                        onOpenModalShare={handleOpenModalShare}
                        onReply={onReply}
                        onMention={onMention}
                    />
                );
                continue;
            }
            const dateTempt1 = new Date(preMessage.createdAt);
            const dateTempt2 = new Date(currentMessage.createdAt);

            const isSameUser =
                currentMessage.user.id === preMessage.user.id &&
                preMessage.type !== 'NOTIFY'
                    ? true
                    : false;

            const timeIsEqual =
                dateTempt2.setHours(dateTempt2.getHours() - 6) > dateTempt1
                    ? true
                    : false;

            // tin nhắn cuối
            const viewUsers = [];
            if (i === messages.length - 1) {
                const lastViewNotMe = lastViewOfMember.filter((ele) => {
                    if (
                        ele.user.id === messages[i].user.id ||
                        ele.user.id === user.id
                    )
                        return false;

                    return true;
                });

                lastViewNotMe.forEach((ele) => {
                    const { lastView, user } = ele;

                    if (new Date(lastView) >= new Date(messages[i].createdAt))
                        viewUsers.push(user);
                });
            }

            if (timeIsEqual) {
                result.push(
                    <div key={i}>
                        <DividerCustom dateString={dateTempt2} />
                        <UserMessage
                            key={i}
                            message={currentMessage}
                            isMyMessage={isMyMessage}
                            viewUsers={viewUsers}
                            onOpenModalShare={handleOpenModalShare}
                            onReply={onReply}
                            onMention={onMention}
                        />
                    </div>
                );
            } else
                result.push(
                    <UserMessage
                        key={i}
                        message={currentMessage}
                        isMyMessage={isMyMessage}
                        isSameUser={isSameUser}
                        viewUsers={viewUsers}
                        onOpenModalShare={handleOpenModalShare}
                        onReply={onReply}
                        onMention={onMention}
                    />
                );
        }

        return result;
    };

    const handleOnScrolling = ({ scrollTop, scrollHeight, top }) => {
        tempPosition.current = top;
        if (
            scrollbars.current.getScrollHeight() ===
            scrollbars.current.getClientHeight()
        ) {
            onBackToBottom(false);
            return;
        }

        if (scrollTop === 0) {
            previousHeight.current = scrollHeight;
            dispatch(setRollUpPage());
        }

        if (top < 0.85) {
            if (onBackToBottom) {
                onBackToBottom(true);
            }
        } else {
            if (onBackToBottom) {
                onBackToBottom(false);
            }
        }
    };
    useEffect(() => {
        if (scrollId) {
            scrollbars.current.scrollToBottom();
        }
    }, [scrollId]);
    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    useEffect(() => {
        if (messages.length > 0) {
            sleep(500).then(() => {
                if (scrollbars.current) {
                    scrollbars.current.scrollToBottom();
                }
            });
        }
    }, [currentConversation, currentChannel]);

    const handleOnStop = () => {
        setPosition(tempPosition.current);
    };
    const handleOpenModalShare = () => {};

    return (
        <Scrollbars
            autoHide={true}
            autoHideTimeout={1000}
            autoHideDuration={200}
            ref={scrollbars}
            onScrollFrame={handleOnScrolling}
            onScrollStop={handleOnStop}
        >
            <div className="spinning-custom">
                <Spin spinning={loading} />
            </div>

            {renderMessages(messages)}
        </Scrollbars>
    );
}

export default BodyChatContainer;
