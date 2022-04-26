import { DeleteFilled } from '@ant-design/icons';
import { Dropdown, Menu, message, Modal } from 'antd';
import conversationApi from 'api/conversationApi';
import SubMenuClassify from 'components/SubMenuClassify';
import ConversationSingle from 'features/Chat/components/ConversationSingle';
import {
    fetchChannels,
    fetchListMessages,
    getLastViewOfMembers,
    getMembersConversation,
    setCurrentChannel,
} from 'features/Chat/slice/chatSlice';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import './style.scss';

ConversationContainer.propTypes = {
    valueClassify: PropTypes.string.isRequired,
};

ConversationContainer.defaultProps = {
    valueClassify: '',
};
function ConversationContainer({ valueClassify }) {
    const { user } = useSelector((state) => state.global);
    const { conversations, classifies } = useSelector((state) => state.chat);
    const dispatch = useDispatch();

    const tempClassify =
        classifies.find((ele) => ele.id === valueClassify) || 0;

    const checkConverInClassify = (idConver) => {
        if (tempClassify === 0) return true;
        const index = tempClassify.conversationIds.findIndex(
            (ele) => ele === idConver
        );

        return index > -1;
    };
    const converFilter = [...conversations].filter((ele) => {
        if (checkConverInClassify(ele.id)) return true;
    });

    const handleConversationClick = async (conversationId) => {
        dispatch(setCurrentChannel(''));
        dispatch(getLastViewOfMembers({ conversationId }));
        dispatch(fetchListMessages({ conversationId, size: 10 }));
        dispatch(getMembersConversation({ conversationId }));
        dispatch(fetchChannels({ conversationId }));
    };

    const handleOnClickItem = (e, id) => {
        if (e.key === 1) {
            confirm(id);
        }
    };

    const deleteConver = async (id) => {
        try {
            await conversationApi.deleteConversation(id);
            message.success('Xóa thành công');
        } catch (error) {
            message.error('Đã có lỗi xảy ra');
        }
    };

    function confirm(id) {
        Modal.confirm({
            title: 'Xác nhận',
            content: (
                <span>
                    Toàn bộ nội dung cuộc trò chuyện sẽ bị xóa vĩnh viễn, bạn có
                    chắc chắn muốn xóa?
                </span>
            ),
            okText: 'Xóa',
            cancelText: 'Không',
            onOk: () => {
                deleteConver(id);
            },
        });
    }
    return (
        <>
            <div id="conversation-main">
                <ul className="list_conversation">
                    {converFilter.map((conversationEle, index) => {
                        if (true) {
                            const { numberUnread } = conversationEle;
                            if (conversationEle.lastMessage) {
                                return (
                                    <Dropdown
                                        key={index}
                                        overlay={
                                            <Menu
                                                onClick={(e) =>
                                                    handleOnClickItem(
                                                        e,
                                                        conversationEle.id
                                                    )
                                                }
                                            >
                                                <SubMenuClassify
                                                    data={classifies}
                                                    idConver={
                                                        conversationEle.id
                                                    }
                                                />
                                                {user.id ===
                                                    conversationEle.leaderId && (
                                                    <Menu.Item
                                                        onClick={() =>
                                                            confirm(
                                                                conversationEle.id
                                                            )
                                                        }
                                                        danger
                                                        key="1"
                                                        icon={<DeleteFilled />}
                                                    >
                                                        Xoá hội thoại
                                                    </Menu.Item>
                                                )}
                                            </Menu>
                                        }
                                        trigger={['contextMenu']}
                                    >
                                        <li
                                            key={index}
                                            className={`conversation-item ${
                                                numberUnread === 0
                                                    ? ''
                                                    : 'arrived-message'
                                            } `}
                                        >
                                            <ConversationSingle
                                                conversation={conversationEle}
                                                onClick={
                                                    handleConversationClick
                                                }
                                            />
                                        </li>
                                    </Dropdown>
                                );
                            }
                        }
                    })}
                </ul>
            </div>
        </>
    );
}

export default ConversationContainer;
