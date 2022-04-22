import { TagFilled } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import classifyUtils from 'utils/classifyUtils';
import dateUtils from 'utils/dateUtils';
import ConversationAvatar from '../ConversationAvatar';
import ShortMessage from '../ShortMessage';
import './style.scss';

ConversationSingle.propTypes = {
    conversation: PropTypes.object,
    onClick: PropTypes.func,
};
function ConversationSingle({ conversation, onClick }) {
    const {
        id,
        name,
        avatar,
        numberUnread,
        lastMessage,
        members,
        totalMembers,
    } = conversation;
    const { type, createdAt } = lastMessage;
    const { conversations, classifies } = useSelector((state) => state.chat);
    const [classify, setClassify] = useState(null);
    useEffect(() => {
        if (classifies.length > 0) {
            const temp = classifyUtils.getClassifyOfObject(id, classifies);
            if (temp) {
                setClassify(temp);
            } else {
                setClassify(null);
            }
        }
        // eslint-disable-next-line
    }, [conversation, conversations, classifies]);
    const handleClick = () => {
        if (onClick) onClick(id);
    };
    return (
        <div className="conversation-item_box" onClick={handleClick}>
            <div className="left-side-box">
                <div className="icon-users">
                    <ConversationAvatar
                        members={members}
                        totalMembers={totalMembers}
                        avatar={avatar?.url}
                        type={conversation.type}
                        name={name}
                    />
                </div>
            </div>
            {lastMessage ? (
                <>
                    <div className="middle-side-box">
                        <span className="name-box">{name}</span>
                        <div className="lastest-message">
                            {classify ? (
                                <span className="tag-classify">
                                    <TagFilled
                                        style={{
                                            color: `${classify.color}`,
                                        }}
                                        rotate={45}
                                    />
                                </span>
                            ) : (
                                <></>
                            )}

                            <ShortMessage message={lastMessage} type={type} />
                        </div>
                    </div>

                    <div className="right-side-box">
                        <span className="lastest-time">
                            {dateUtils.toTime(createdAt)}
                        </span>

                        <span className="message-count">{numberUnread}</span>
                    </div>
                </>
            ) : (
                ''
            )}
        </div>
    );
}

export default ConversationSingle;
