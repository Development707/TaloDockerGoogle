import PropTypes from 'prop-types';
import { useEffect } from 'react';
import {
    DeleteOutlined,
    PushpinOutlined,
    UndoOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Menu, message as mesageNotify } from 'antd';
import messageApi from 'api/messageApi';
import MESSAGE_STYLE from 'constants/messageStyle';
import { useState } from 'react';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { MdQuestionAnswer } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { checkLeader, checkManager } from 'utils/groupUtils';
import LastView from '../LastView';
import ListReaction from '../ListReaction';
import ListReactionOfUser from '../ListReactionOfUser';
import FileMessage from '../MessageType/FileMessage';
import HTMLMessage from '../MessageType/HTMLMessage';
import ImageMessage from '../MessageType/ImageMessage';
import NotifyMessage from '../MessageType/NotifyMessage';
import PollMessage from '../MessageType/PollMessage';
import StickerMessage from '../MessageType/StickerMessage';
import TextMessage from '../MessageType/TextMessage';
import VideoMessage from '../MessageType/VideoMessage';
import PersonalIcon from '../PersonalIcon';
import './style.scss';

import pinMessageApi from 'api/pinMessageApi';
import {
    deleteMessageClient,
    fetchPinMessages,
} from 'features/Chat/slice/chatSlice';
import ModalChangePinMessage from '../ModalChangePinMessage';

UserMessage.propTypes = {
    message: PropTypes.object,
    isMyMessage: PropTypes.bool,
    isSameUser: PropTypes.bool,
    viewUsers: PropTypes.array,
    onOpenModalShare: PropTypes.func,
    onReply: PropTypes.func,
    onMention: PropTypes.func,
};

UserMessage.defaultProps = {
    message: {},
    isMyMessage: false,
    isSameUser: false,
    viewUsers: [],
    onOpenModalShare: null,
    onReply: null,
    onMention: null,
};
function UserMessage({
    message,
    isMyMessage,
    isSameUser,
    viewUsers,
    onOpenModalShare,
    onReply,
    onMention,
}) {
    const {
        id,
        content,
        user,
        createdAt,
        type,
        isDeleted,
        reacts,
        tags,
        replyMessageId,
    } = message;

    const { name, avatar } = user;
    const {
        messages,
        currentConversation,
        conversations,
        pinMessages,
        currentChannel,
    } = useSelector((state) => state.chat);

    const global = useSelector((state) => state.global);

    const [isLeader, setIsLeader] = useState(false);
    const [isManager, setIsManager] = useState(false);
    const [isVisibleModal, setVisibleModal] = useState(false);

    const dispatch = useDispatch();

    const isGroup = conversations.find(
        (ele) => ele.id === currentConversation
    ).type;

    const setMarginTopAndBottom = (id) => {
        const index = messages.findIndex((message) => message.id === id);

        if (index === 0) {
            return 'top';
        }
        if (index === messages.length - 1) {
            return 'bottom';
        }
        return '';
    };

    //react
    const [listReactionCurrent, setListReactionCurrent] = useState([]);

    const myReact =
        reacts &&
        reacts.length > 0 &&
        reacts.find((ele) => ele.userId.id === global.user.id);

    const dateAt = new Date(createdAt);

    const listReaction = ['👍', '❤️', '😆', '😮', '😭', '😡', '👎'];

    const transferValueToText = (value) => {
        if (value === 1) {
            return 'LIKE';
        }
        if (value === 2) {
            return 'HEART';
        }
        if (value === 3) {
            return 'LAUGH';
        }
        if (value === 4) {
            return 'WOW';
        }
        if (value === 5) {
            return 'SAD';
        }
        if (value === 6) {
            return 'ANGRY';
        }
        if (value === 7) {
            return 'DISLIKE';
        }
    };

    const transferTextToValue = (text) => {
        if (text === 'LIKE') {
            return 1;
        }
        if (text === 'HEART') {
            return 2;
        }
        if (text === 'LAUGH') {
            return 3;
        }
        if (text === 'WOW') {
            return 4;
        }
        if (text === 'SAD') {
            return 5;
        }
        if (text === 'ANGRY') {
            return 6;
        }
        if (text === 'DISLIKE') {
            return 7;
        }
    };

    useEffect(() => {
        setIsLeader(checkLeader(user.id, conversations, currentConversation));
        setIsManager(checkManager(user.id, conversations, currentConversation));
        //eslint-disable-next-line
    }, [messages]);

    useEffect(() => {
        let temp = [];
        if (reacts && reacts.length > 0) {
            reacts.forEach((ele) => {
                if (!temp.includes(ele.type)) {
                    temp.push(ele.type);
                }
            });
        }
        setListReactionCurrent(temp);

        //eslint-disable-next-line
    }, [message]);

    const transferIcon = (type) => {
        return listReaction[parseInt(transferTextToValue(type)) - 1];
    };

    const handleClickLike = () => {
        sendReaction('LIKE');
    };
    const handleClickReaction = (value) => {
        const type = listReaction.findIndex((ele) => ele === value) + 1;
        sendReaction(transferValueToText(type));
    };

    const sendReaction = async (type) => {
        await messageApi.expressionReaction(id, type);
    };

    const handleReplyMessage = () => {
        if (onReply) {
            onReply(message);
        }
        if (onMention) {
            onMention(user);
        }
    };

    const handleOnClick = async ({ key }) => {
        if (key === '1') {
            if (pinMessages.length === 3) {
                setVisibleModal(true);
            } else {
                try {
                    await pinMessageApi.pinMessage(id);
                    dispatch(
                        fetchPinMessages({
                            conversationId: currentConversation,
                        })
                    );
                    mesageNotify.success('Ghim tin nhắn thành công');
                } catch (error) {
                    mesageNotify.error('Ghim tin nhắn thất bại');
                }
            }
        }
        if (key === '2') {
            await messageApi.undoMessage(id);
        }
        if (key === '3') {
            await messageApi.deleteMessageClientSide(id);
            dispatch(deleteMessageClient(id));
        }
    };
    const menu = (
        <Menu onClick={handleOnClick}>
            {isGroup === 'GROUP' && !currentChannel && type !== 'STICKER' && (
                <Menu.Item
                    key="1"
                    icon={<PushpinOutlined />}
                    style={MESSAGE_STYLE.dropDownStyle}
                    title="Ghim tin nhắn"
                >
                    Ghim tin nhắn
                </Menu.Item>
            )}

            {isMyMessage && (
                <Menu.Item
                    key="2"
                    icon={<UndoOutlined />}
                    style={MESSAGE_STYLE.dropDownStyle}
                    title="Thu hồi tin nhắn"
                >
                    Thu hồi tin nhắn
                </Menu.Item>
            )}
            <Menu.Item
                key="3"
                icon={<DeleteOutlined />}
                style={MESSAGE_STYLE.dropDownStyle}
                danger
                title="Xóa chỉ ở phía tôi"
            >
                Xóa chỉ ở phía tôi
            </Menu.Item>
        </Menu>
    );

    return (
        <>
            {!isDeleted && type === 'NOTIFY' ? (
                <>
                    <NotifyMessage message={message} />
                    <div className="last-view-avatar center">
                        {viewUsers && viewUsers.length > 0 && (
                            <LastView lastView={viewUsers} />
                        )}
                    </div>
                </>
            ) : (
                <>
                    {type === 'VOTE' && <PollMessage data={message} />}

                    <div
                        className={`${setMarginTopAndBottom(id)} user-message ${
                            type === 'VOTE' ? 'hidden' : ''
                        }`}
                    >
                        <div
                            className={`interact-conversation ${
                                isMyMessage ? 'reverse' : ''
                            } `}
                        >
                            <div
                                className={`avatar-user ${
                                    isSameUser ? 'hidden' : ''
                                }`}
                            >
                                <PersonalIcon
                                    isHost={isLeader}
                                    isManager={isManager}
                                    demention={40}
                                    avatar={avatar?.url}
                                    name={name}
                                />
                            </div>
                            <div className="list-conversation">
                                <div className="message" id={`${id}`}>
                                    <div
                                        className={`sub-message ${
                                            isMyMessage ? 'reverse' : ''
                                        }
                                    ${isSameUser ? 'same-user' : ''}`}
                                    >
                                        <div
                                            className={`content-message ${
                                                type === 'IMAGE' ||
                                                type === 'VIDEO' ||
                                                type === 'STICKER'
                                                    ? 'content-media'
                                                    : ''
                                            }
                                            ${
                                                isMyMessage &&
                                                type !== 'IMAGE' &&
                                                type !== 'VIDEO' &&
                                                type !== 'STICKER'
                                                    ? 'my-message-bg'
                                                    : ''
                                            }
                                            `}
                                        >
                                            <span className="author-message">
                                                {isSameUser && isMyMessage
                                                    ? ''
                                                    : isSameUser && !isMyMessage
                                                    ? ''
                                                    : !isSameUser && isMyMessage
                                                    ? ''
                                                    : name}
                                            </span>
                                            <div className="content-message-description">
                                                {isDeleted ? (
                                                    <>
                                                        {' '}
                                                        <span className="undo-message">
                                                            {' '}
                                                            Tin nhắn đã được thu
                                                            hồi
                                                        </span>
                                                        <div className="time-and-last_view">
                                                            <div className="time-send">
                                                                <span>
                                                                    {`0${dateAt.getHours()}`.slice(
                                                                        -2
                                                                    )}
                                                                    :
                                                                    {`0${dateAt.getMinutes()}`.slice(
                                                                        -2
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        {type === 'TEXT' ? (
                                                            <TextMessage
                                                                tags={tags}
                                                                content={
                                                                    content
                                                                }
                                                                dateAt={dateAt}
                                                                isSeen={
                                                                    viewUsers &&
                                                                    viewUsers.length >
                                                                        0
                                                                }
                                                                replyMessage={
                                                                    replyMessageId
                                                                }
                                                            >
                                                                {!myReact && (
                                                                    <ListReaction
                                                                        isMyMessage={
                                                                            isMyMessage
                                                                        }
                                                                        onClickLike={
                                                                            handleClickLike
                                                                        }
                                                                        listReaction={
                                                                            listReaction
                                                                        }
                                                                        onClickReaction={
                                                                            handleClickReaction
                                                                        }
                                                                    />
                                                                )}
                                                            </TextMessage>
                                                        ) : type === 'IMAGE' ? (
                                                            <ImageMessage
                                                                content={
                                                                    content
                                                                }
                                                                dateAt={dateAt}
                                                                isSeen={
                                                                    viewUsers &&
                                                                    viewUsers.length >
                                                                        0
                                                                }
                                                            >
                                                                {type ===
                                                                    'IMAGE' &&
                                                                    !myReact && (
                                                                        <ListReaction
                                                                            type="media"
                                                                            isMyMessage={
                                                                                isMyMessage
                                                                            }
                                                                            onClickLike={
                                                                                handleClickLike
                                                                            }
                                                                            listReaction={
                                                                                listReaction
                                                                            }
                                                                            onClickReaction={
                                                                                handleClickReaction
                                                                            }
                                                                        />
                                                                    )}
                                                            </ImageMessage>
                                                        ) : type === 'VIDEO' ? (
                                                            <VideoMessage
                                                                content={
                                                                    content
                                                                }
                                                                dateAt={dateAt}
                                                                isSeen={
                                                                    viewUsers &&
                                                                    viewUsers.length >
                                                                        0
                                                                }
                                                            >
                                                                {!myReact && (
                                                                    <ListReaction
                                                                        type="media"
                                                                        isMyMessage={
                                                                            isMyMessage
                                                                        }
                                                                        onClickLike={
                                                                            handleClickLike
                                                                        }
                                                                        listReaction={
                                                                            listReaction
                                                                        }
                                                                        onClickReaction={
                                                                            handleClickReaction
                                                                        }
                                                                    />
                                                                )}
                                                            </VideoMessage>
                                                        ) : type ===
                                                          'STICKER' ? (
                                                            <StickerMessage
                                                                content={
                                                                    content
                                                                }
                                                                dateAt={dateAt}
                                                                isSeen={
                                                                    viewUsers &&
                                                                    viewUsers.length >
                                                                        0
                                                                }
                                                            />
                                                        ) : type === 'FILE' ? (
                                                            <FileMessage
                                                                content={
                                                                    content
                                                                }
                                                                dateAt={dateAt}
                                                                isSeen={
                                                                    viewUsers &&
                                                                    viewUsers.length >
                                                                        0
                                                                }
                                                            >
                                                                {!myReact && (
                                                                    <ListReaction
                                                                        type="media"
                                                                        isMyMessage={
                                                                            isMyMessage
                                                                        }
                                                                        onClickLike={
                                                                            handleClickLike
                                                                        }
                                                                        listReaction={
                                                                            listReaction
                                                                        }
                                                                        onClickReaction={
                                                                            handleClickReaction
                                                                        }
                                                                    />
                                                                )}
                                                            </FileMessage>
                                                        ) : type === 'HTML' ? (
                                                            <HTMLMessage
                                                                content={
                                                                    content
                                                                }
                                                                dateAt={dateAt}
                                                                isSeen={
                                                                    viewUsers &&
                                                                    viewUsers.length >
                                                                        0
                                                                }
                                                            >
                                                                {!myReact && (
                                                                    <ListReaction
                                                                        type="media"
                                                                        isMyMessage={
                                                                            isMyMessage
                                                                        }
                                                                        onClickLike={
                                                                            handleClickLike
                                                                        }
                                                                        listReaction={
                                                                            listReaction
                                                                        }
                                                                        onClickReaction={
                                                                            handleClickReaction
                                                                        }
                                                                    />
                                                                )}
                                                            </HTMLMessage>
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </>
                                                )}
                                            </div>

                                            <div
                                                className={`reacted-block ${
                                                    type === 'IMAGE' ||
                                                    type === 'VIDEO'
                                                        ? 'media'
                                                        : ''
                                                }
                                                ${
                                                    isMyMessage
                                                        ? 'left'
                                                        : 'right'
                                                }`}
                                            >
                                                {listReactionCurrent.length >
                                                    0 &&
                                                    !isDeleted && (
                                                        <ListReactionOfUser
                                                            listReactionCurrent={
                                                                listReactionCurrent
                                                            }
                                                            reacts={reacts}
                                                            isMyMessage={
                                                                isMyMessage
                                                            }
                                                            onTransferIcon={
                                                                transferIcon
                                                            }
                                                        />
                                                    )}

                                                {myReact && !isDeleted && (
                                                    <div
                                                        className={`your-react ${
                                                            isMyMessage
                                                                ? 'bg-white'
                                                                : ''
                                                        }`}
                                                    >
                                                        <span className="react-current">
                                                            {myReact
                                                                ? transferIcon(
                                                                      myReact.type
                                                                  )
                                                                : ''}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div
                                            className={`interaction ${
                                                isDeleted ? 'hidden' : ''
                                            }`}
                                        >
                                            <div className="icon-interact">
                                                <Button
                                                    style={
                                                        MESSAGE_STYLE.styleButton
                                                    }
                                                    onClick={handleReplyMessage}
                                                >
                                                    <MdQuestionAnswer />
                                                </Button>
                                            </div>

                                            <div className="additional icon-interact">
                                                <Dropdown
                                                    overlay={menu}
                                                    trigger={['click']}
                                                >
                                                    <Button
                                                        style={
                                                            MESSAGE_STYLE.styleButton
                                                        }
                                                    >
                                                        <BiDotsHorizontalRounded />
                                                    </Button>
                                                </Dropdown>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className={`last-view-avatar  ${
                                isMyMessage ? 'reverse' : ''
                            } `}
                        >
                            {viewUsers && viewUsers.length > 0 && (
                                <LastView lastView={viewUsers} />
                            )}
                        </div>
                    </div>
                </>
            )}

            <ModalChangePinMessage
                visible={isVisibleModal}
                message={pinMessages}
                messageId={id}
                onCloseModal={() => setVisibleModal(false)}
            />
        </>
    );
}

export default UserMessage;
