import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Badge, Button, Dropdown, Menu } from 'antd';
import SubMenuClassify from 'components/SubMenuClassify';
import ConversationAvatar from 'features/Chat/components/ConversationAvatar';
import { BsThreeDotsVertical } from 'react-icons/bs';
import classifyUtils from 'utils/classifyUtils';
import { useNavigate } from 'react-router-dom';
import {
    fetchChannels,
    fetchListMessages,
    getMembersConversation,
    setConversations,
    setCurrentConversation,
    setTypeOfConversation,
} from 'features/Chat/slice/chatSlice';
import './style.scss';
import conversationApi from 'api/conversationApi';

GroupCard.propTypes = {
    data: PropTypes.object,
    onRemove: PropTypes.func,
};

GroupCard.defaultProps = {
    data: {},
    onRemove: null,
};

function GroupCard({ data, onRemove }) {
    const dispatch = useDispatch();
    const { classifies } = useSelector((state) => state.chat);
    const [classify, setClassify] = useState(null);
    const navigate = useNavigate();
    const { conversations } = useSelector((state) => state.chat);

    useEffect(() => {
        if (classifies.length > 0) {
            setClassify(classifyUtils.getClassifyOfObject(data.id, classifies));
        }

        //eslint-disable-next-line
    }, [classifies]);

    const handleOnSelectMenu = ({ key }) => {
        if (key === '2') {
            if (onRemove) {
                onRemove(key, data.id);
            }
        }
    };

    const menu = (
        <Menu onClick={handleOnSelectMenu}>
            <SubMenuClassify data={classifies} idConver={data.id} />

            <Menu.Item key="2" danger>
                <span className="menu-item--highlight">Rời nhóm</span>
            </Menu.Item>
        </Menu>
    );

    const handleOnClick = async () => {
        try {
            dispatch(fetchListMessages({ conversationId: data.id, size: 10 }));
            dispatch(getMembersConversation({ conversationId: data.id }));
            dispatch(setCurrentConversation(data.id));
            navigate('/chat', { replace: true });
        } catch (error) {
            console.log(error);
        }
    };

    const mainCard = (
        <Dropdown overlay={menu} trigger={['contextMenu']}>
            <div className="group-card">
                <div className="group-card__interact">
                    <Dropdown overlay={menu} trigger={['click']}>
                        <Button type="text" icon={<BsThreeDotsVertical />} />
                    </Dropdown>
                </div>
                <div className="group-card__avatar-group">
                    <ConversationAvatar
                        avatar={data.avatar.url}
                        demension={52}
                        name={data.name}
                        type={data.type}
                        totalMembers={data.totalMembers}
                        members={data.members}
                        isGroupCard={true}
                        sizeAvatar={48}
                        frameSize={96}
                    />
                </div>

                <div className="group-card__name-group">{data.name}</div>

                <div className="group-card__total-member">
                    {`${data.totalMembers} thành viên`}
                </div>
                <div className="group-card__to-chat">
                    <Button onClick={handleOnClick}>Mở cuộc trò chuyện</Button>
                </div>
            </div>
        </Dropdown>
    );
    return (
        <>
            {classify ? (
                <Badge.Ribbon
                    text={classify.name}
                    color={classify.color.code}
                    placement="start"
                >
                    {mainCard}
                </Badge.Ribbon>
            ) : (
                mainCard
            )}
        </>
    );
}

export default GroupCard;
