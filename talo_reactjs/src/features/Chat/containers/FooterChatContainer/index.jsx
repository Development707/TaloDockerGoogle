import { LikeOutlined, LockFilled, SendOutlined } from '@ant-design/icons';
import { Mentions } from 'antd';
import { Option } from 'antd/lib/mentions';
import NavigationChatBox from 'features/Chat/components/NavigationChatBox';
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import MENTION_STYLE from './MentionStyle.js';
import PersonalIcon from 'features/Chat/components/PersonalIcon';
import { useEffect } from 'react';
import messageApi from 'api/messageApi';
import './style.scss';
import ReplyBlock from 'features/Chat/components/ReplyBlock/index.jsx';
import TextEditor from 'features/Chat/components/TextEditor/index.jsx';

FooterChatContainer.propTypes = {
    onScrollWhenSentText: PropTypes.func,
    socket: PropTypes.object,
    replyMessage: PropTypes.object,
    onCloseReply: PropTypes.func,
    userMention: PropTypes.object,
    onRemoveMention: PropTypes.func,
    onViewPolls: PropTypes.func,
    onOpenInfoBlock: PropTypes.func,
};

FooterChatContainer.defaultProps = {
    onScrollWhenSentText: null,
    socket: null,
    replyMessage: {},
    onCloseReply: null,
    userMention: {},
    onRemoveMention: null,
    onViewPolls: null,
    onOpenInfoBlock: null,
};
const style_EditorText = {
    flexDirection: 'column',
};
function FooterChatContainer({
    onScrollWhenSentText,
    onOpenInfoBlock,
    socket,
    replyMessage,
    onCloseReply,
    userMention,
    onRemoveMention,
    onViewPolls,
}) {
    const {
        currentConversation,
        conversations,
        currentChannel,
        memberInConversation,
    } = useSelector((state) => state.chat);
    const { user } = useSelector((state) => state.global);

    const [valueText, setValueText] = useState('');
    const [showTextFormat, setShowTextFormat] = useState(false);
    const [mentionSelect, setMentionSelect] = useState([]);
    const [mentionList, setMentionsList] = useState([]);
    const [isShowLike, setShowLike] = useState(true);
    const [isHightLight, setHightLight] = useState(false);

    const checkGroup = conversations.find(
        (ele) => ele.id === currentConversation
    );

    const [detailConver, setDetailConver] = useState({});
    const preMention = useRef();

    const getTypeConversation = conversations.find(
        (ele) => ele.id === currentConversation
    ).type;

    useEffect(() => {
        if (currentConversation) {
            const tempConver = conversations.find(
                (conver) => conver.id === currentConversation
            );
            if (tempConver) {
                setDetailConver(tempConver);
            }
        }
    }, [currentConversation]);

    const handleOnChangeInput = (value) => {
        if (mentionSelect.length > 0) {
            mentionSelect.forEach((ele, index) => {
                const regex = new RegExp(`@${ele.name}`);
                if (regex.exec(value) === null) {
                    const tempMensionList = [...mentionList];
                    const checkExist = mentionList.every(
                        (temp) => ele.id !== temp.id
                    );
                    if (checkExist) {
                        tempMensionList.push(ele);
                    }
                    setMentionsList(tempMensionList);
                    setMentionSelect(
                        mentionSelect.filter((select) => select.id !== ele.id)
                    );
                    if (onRemoveMention) {
                        onRemoveMention();
                    }
                    return false;
                }
            });
        }

        value.length > 0 ? setShowLike(false) : setShowLike(true);
        setValueText(value);

        if (value.length > 0 && !currentChannel) {
            socket.emit('ConversationUserTyping', currentConversation, user);
        } else {
            socket.emit(
                'ConversationUserTypingFinish',
                currentConversation,
                user
            );
        }
    };

    const checkIsExistInSelect = (userMen) => {
        if (mentionSelect.length > 0) {
            const index = mentionSelect.findIndex(
                (ele) => ele.id === userMen.id
            );
            return index >= 0;
        } else {
            return false;
        }
    };

    useEffect(() => {
        if (memberInConversation.length > 0) {
            setMentionsList(memberInConversation);
        }
    }, [memberInConversation]);

    useEffect(() => {
        setValueText('');
        setMentionSelect([]);
    }, [currentConversation]);

    useEffect(() => {
        if (userMention && Object.keys(userMention).length > 0) {
            let tempMensionSelect = [...mentionSelect];
            let tempMensionList = [...mentionList];
            let tempValueText = valueText;

            if (preMention.current) {
                if (checkIsExistInSelect(preMention.current)) {
                    const regex = new RegExp(`^@${preMention.current.name}`);
                    const newText = valueText.replace(regex, '');
                    tempValueText = newText;

                    tempMensionSelect = mentionSelect.filter(
                        (ele) => ele.id !== preMention.current.id
                    );
                    tempMensionList = [...mentionList, preMention.current];
                }
            }

            const checkExist = checkIsExistInSelect(userMention);

            if (!checkExist) {
                if (getTypeConversation) {
                    tempValueText = `@${userMention.name} ${tempValueText}`;
                }
                setValueText(tempValueText);
                setMentionSelect([...tempMensionSelect, userMention]);
                tempMensionList = tempMensionList.filter(
                    (ele) => ele.id !== userMention.id
                );
                setMentionsList(tempMensionList);
            }
            preMention.current = userMention;
        }
        //eslint-disable-next-line
    }, [userMention]);

    async function sendMessage(value, type) {
        const listMentionId = mentionSelect.map((ele) => ele.id);

        const newMessage = {
            content: value,
            type: type,
            tags: listMentionId,
        };
        if (currentChannel) {
            newMessage.channelId = currentChannel;
        }

        if (replyMessage && Object.keys(replyMessage).length > 0) {
            newMessage.replyMessageId = replyMessage.id;
        }

        await messageApi
            .sendTextMessage(currentConversation, newMessage)
            .then((res) => {
                const { id } = res;
                handleOnScroll(id);
                // console.log('Send Message Success');
            })
            .catch((err) => console.log('Send Message Fail'));

        setMentionsList(memberInConversation);
        setMentionSelect([]);

        if (onCloseReply) {
            onCloseReply();
        }
        if (onRemoveMention) {
            onRemoveMention();
        }
    }
    const handleKeyPress = (event) => {
        if (event.nativeEvent.keyCode === 13) {
            if (!event.shiftKey) {
                const valueInput = event.target.value;

                if (valueInput.trim().length > 0) {
                    sendMessage(valueInput, 'TEXT');
                    setValueText('');
                    setShowLike(true);
                    socket.emit(
                        'ConversationUserTypingFinish',
                        currentConversation,
                        user
                    );
                }

                event.preventDefault();
            }
        }
    };
    const handleOnFocus = () => {
        if (currentChannel) {
            socket.emit(
                'ConversationsChannelViewLast',
                currentConversation,
                currentChannel
            );
        } else {
            socket.emit('ConversationsChannelViewLast', currentConversation);
        }

        setHightLight(true);
    };
    const handleOnBlur = () => {
        setHightLight(false);

        socket.emit('ConversationUserTypingFinish', currentConversation, user);
    };

    const handleSelectMention = ({ object }, _) => {
        setMentionSelect([...mentionSelect, object]);
        setMentionsList(mentionList.filter((ele) => ele.id !== object.id));
    };

    const handleSentMessage = () => {
        if (valueText.trim()) {
            if (showTextFormat) {
                sendMessage(valueText, 'HTML');
            } else {
                sendMessage(valueText, 'TEXT');
            }
            setValueText('');
            setShowLike(true);
            socket.emit(
                'ConversationUserTypingFinish',
                currentConversation,
                user
            );
        }
    };
    const handleSentLike = () => {
        sendMessage('👍', 'TEXT');
    };
    const handleOnScroll = (id) => {
        if (onScrollWhenSentText) {
            onScrollWhenSentText(id);
        }
    };

    const handleClickTextFormat = () => {
        setShowTextFormat(!showTextFormat);
        setValueText('');
    };

    const handleOnCloseReply = () => {
        if (onCloseReply) {
            onCloseReply();
        }
    };
    const handleShowLike = (value) => {
        setShowLike(value);
    };
    const handleSetValueEditor = (content) => {
        setValueText(content);
    };
    return (
        <div id="main-footer-chat">
            <div className="navigation">
                <NavigationChatBox
                    isFocus={isHightLight}
                    onClickTextFormat={handleClickTextFormat}
                    onScroll={handleOnScroll}
                    onViewPolls={onViewPolls}
                    onOpenInfoBlock={onOpenInfoBlock}
                />
            </div>

            {replyMessage && Object.keys(replyMessage).length > 0 && (
                <ReplyBlock
                    replyMessage={replyMessage}
                    onCloseReply={handleOnCloseReply}
                />
            )}

            <div
                className="chat-editor"
                style={showTextFormat ? style_EditorText : {}}
            >
                <div className="main-editor">
                    {showTextFormat ? (
                        <TextEditor
                            showFormat={showTextFormat}
                            onFocus={handleOnFocus}
                            onBlur={handleOnBlur}
                            showLike={handleShowLike}
                            valueHtml={valueText}
                            onSetValue={handleSetValueEditor}
                        />
                    ) : (
                        <Mentions
                            autoSize={{ minRows: 1, maxRows: 5 }}
                            placeholder={`Nhập @, tin nhắn tới ${detailConver.name}`}
                            size="large"
                            bordered={false}
                            style={{
                                whiteSpace: 'pre-wrap',
                                border: 'none',
                                outline: 'none',
                            }}
                            spellCheck={false}
                            value={valueText}
                            onChange={handleOnChangeInput}
                            onKeyPress={handleKeyPress}
                            onFocus={handleOnFocus}
                            onBlur={handleOnBlur}
                            onSelect={handleSelectMention}
                            split=" "
                        >
                            {checkGroup &&
                                mentionList.map((ele, index) => {
                                    if (ele.id !== user.id) {
                                        return (
                                            <Option
                                                key={index}
                                                value={ele.name}
                                                object={ele}
                                            >
                                                <div
                                                    className="mention-option_wrapper"
                                                    style={
                                                        MENTION_STYLE.MENTION_ITEM
                                                    }
                                                >
                                                    <div className="icon-user-item">
                                                        <PersonalIcon
                                                            demention={24}
                                                            avatar={
                                                                ele.avatar?.url
                                                            }
                                                            name={ele.name}
                                                        />
                                                    </div>

                                                    <div
                                                        style={
                                                            MENTION_STYLE.NAME_ITEM
                                                        }
                                                        className="name-user-item"
                                                    >
                                                        {ele.name}
                                                    </div>
                                                </div>
                                            </Option>
                                        );
                                    }
                                })}
                        </Mentions>
                    )}
                </div>
                <div className="addtion-interaction">
                    <div className={`like-emoji ${isShowLike ? '' : 'hidden'}`}>
                        <div
                            className="send-text-thumb"
                            onClick={handleSentLike}
                        >
                            <LikeOutlined />
                        </div>
                    </div>
                    <div className={`like-emoji ${isShowLike ? 'hidden' : ''}`}>
                        <div
                            className="send-text-thumb"
                            onClick={handleSentMessage}
                        >
                            <SendOutlined />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FooterChatContainer;
