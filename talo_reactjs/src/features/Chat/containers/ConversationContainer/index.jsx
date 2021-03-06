import { Dropdown, Menu, message, Modal } from 'antd';
import conversationApi from 'api/conversationApi';
import reportApi from 'api/reportApi';
import SubMenuClassify from 'components/SubMenuClassify';
import ConversationSingle from 'features/Chat/components/ConversationSingle';
import ModalReportConversation from 'features/Chat/components/ModalReportConversation';
import {
    fetchChannels,
    fetchListMessages,
    fetchMembersConversation,
    getLastViewOfMembers,
    setCurrentChannel,
} from 'features/Chat/slice/chatSlice';
import PropTypes from 'prop-types';
import { useState } from 'react';
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
    const [visible, setVisible] = useState(false);
    const [idConversation, setIdConversation] = useState('');
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
        dispatch(fetchMembersConversation({ conversationId }));
        dispatch(fetchChannels({ conversationId }));
    };

    const handleOnClickItem = (e, id) => {
        if (e.key === '1') {
            confirm(id);
        }
    };

    const handleOnClickReport = (e, id) => {
        if (e.key === '2') {
            setVisible(true);
            setIdConversation(id);
        }
    };

    const handleCancelModal = () => {
        setVisible(false);
        setIdConversation('');
    };

    const handleOnOk = async (titleReport) => {
        try {
            await reportApi.reportConversation(titleReport, idConversation);
            message.success('B??o c??o th??nh c??ng');
        } catch (error) {
            message.error('???? c?? l???i x???y ra');
        }
        handleCancelModal();
    };

    const deleteConver = async (id) => {
        try {
            await conversationApi.deleteConversation(id);
            message.success('X??a th??nh c??ng');
        } catch (error) {
            message.error('???? c?? l???i x???y ra');
        }
    };

    function confirm(id) {
        Modal.confirm({
            title: 'X??c nh???n',
            content: (
                <span>
                    To??n b??? n???i dung cu???c tr?? chuy???n s??? b??? x??a v??nh vi???n, b???n c??
                    ch???c ch???n mu???n x??a?
                </span>
            ),
            okText: 'X??a',
            cancelText: 'Kh??ng',
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
                                            <Menu>
                                                <SubMenuClassify
                                                    data={classifies}
                                                    idConver={
                                                        conversationEle.id
                                                    }
                                                />
                                                {user.id ===
                                                    conversationEle.leaderId && (
                                                    <Menu.Item
                                                        onClick={(e) =>
                                                            handleOnClickItem(
                                                                e,
                                                                conversationEle.id
                                                            )
                                                        }
                                                        danger
                                                        key="1"
                                                    >
                                                        Xo?? h???i tho???i
                                                    </Menu.Item>
                                                )}
                                                <Menu.Item
                                                    onClick={(e) =>
                                                        handleOnClickReport(
                                                            e,
                                                            conversationEle.id
                                                        )
                                                    }
                                                    key="2"
                                                >
                                                    B??o c??o
                                                </Menu.Item>
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
                                                deleteGroup={handleOnClickItem}
                                                report={handleOnClickReport}
                                            />
                                        </li>
                                    </Dropdown>
                                );
                            }
                        }
                    })}
                </ul>
            </div>

            <ModalReportConversation
                visible={visible}
                onCancel={handleCancelModal}
                onOk={handleOnOk}
            />
        </>
    );
}

export default ConversationContainer;
