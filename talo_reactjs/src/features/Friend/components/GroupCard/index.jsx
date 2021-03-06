import { Badge, Button, Dropdown, Menu } from 'antd';
import SubMenuClassify from 'components/SubMenuClassify';
import ConversationAvatar from 'features/Chat/components/ConversationAvatar';
import {
    fetchListMessages,
    fetchMembersConversation,
    setCurrentConversation,
} from 'features/Chat/slice/chatSlice';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import classifyUtils from 'utils/classifyUtils';
import './style.scss';

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
            dispatch(fetchMembersConversation({ conversationId: data.id }));
            dispatch(setCurrentConversation(data.id));
            navigate('/chat', { replace: true });
        } catch (error) {}
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
                    color={classify.color}
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
