import { DeleteFilled, MoreOutlined, TagFilled } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import SubMenuClassify from 'components/SubMenuClassify';
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
    deleteGroup: PropTypes.func,
};
ConversationSingle.defaultProps = {
    onClick: null,
    deleteGroup: null,
};
function ConversationSingle({ conversation, onClick, deleteGroup }) {
    const {
        id,
        name,
        avatar,
        numberUnread,
        lastMessage,
        members,
        totalMembers,
        leaderId,
    } = conversation;

    const { type, createdAt } = lastMessage;
    const { conversations, classifies } = useSelector((state) => state.chat);
    const { user } = useSelector((state) => state.global);
    const [classify, setClassify] = useState(null);
    useEffect(() => {
        if (classifies.length > 0) {
            const temp = classifyUtils.getClassifyOfObject(id, classifies);
            if (temp) {
                setClassify(temp);
            } else {
                setClassify(null);
            }
        } else {
            setClassify(null);
        }
        // eslint-disable-next-line
    }, [conversation, conversations, classifies]);

    const handleClick = () => {
        if (onClick) onClick(id);
    };
    const menu = (
        <Menu>
            <SubMenuClassify data={classifies} idConver={id} />
            {user.id === leaderId && (
                <Menu.Item
                    onClick={(e) => deleteGroup(e, id)}
                    danger
                    key="1"
                    icon={<DeleteFilled />}
                >
                    Xoá hội thoại
                </Menu.Item>
            )}
        </Menu>
    );

    return (
        <>
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

                                <ShortMessage
                                    message={lastMessage}
                                    type={type}
                                />
                            </div>
                        </div>

                        <div className="right-side-box">
                            <span className="lastest-time">
                                {dateUtils.toTime(createdAt)}
                            </span>

                            <span className="message-count">
                                {numberUnread}
                            </span>
                        </div>
                    </>
                ) : (
                    ''
                )}
            </div>

            <div className="right-side-box">
                <div className="right-side-box-interact">
                    <Dropdown overlay={menu} trigger={['click']}>
                        <Button
                            type="text"
                            icon={<MoreOutlined rotate={90} />}
                            style={{
                                background: 'eeeff2',
                                width: '28px',
                                height: '28px',
                            }}
                        />
                    </Dropdown>
                </div>
            </div>
        </>
    );
}

export default ConversationSingle;
