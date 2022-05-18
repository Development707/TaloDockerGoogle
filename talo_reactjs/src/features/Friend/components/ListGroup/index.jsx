import { Col, message, Modal, Row } from 'antd';
import conversationApi from 'api/conversationApi';
import { leftGroup } from 'features/Chat/slice/chatSlice';
import { fetchListGroup } from 'features/Friend/friendSlice';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from 'utils/socketClient';
import GroupCard from '../GroupCard';

const ListGroup = ({ data }) => {
    const dispatch = useDispatch();
    const { currentConversation } = useSelector((state) => state.chat);
    const handleOkModal = async (id) => {
        try {
            await conversationApi.leaveGroup(id);
            message.success(`Rời nhóm thành công`);
            socket.emit('ConversationLeft', id);
            dispatch(fetchListGroup({ name: '', type: 'GROUP' }));
            dispatch(leftGroup(currentConversation));
        } catch (error) {
            message.error(`Không thể rời nhóm vì bạn là trưởng nhóm`);
        }
    };

    const handleOnRemoveGroup = (key, id) => {
        confirm(id);
    };

    function confirm(id) {
        Modal.confirm({
            title: 'Xác nhận',
            content:
                'Rời nhóm sẽ đồng thời xóa toàn bộ tin nhắn của nhóm đó. Bạn có muốn tiếp tục?',
            okText: 'Rời nhóm',
            cancelText: 'Không',
            onOk: () => handleOkModal(id),
        });
    }
    return (
        <Row gutter={[16, 16]}>
            {data &&
                data.length > 0 &&
                data.map((item) => (
                    <Col
                        span={6}
                        xl={{ span: 6 }}
                        lg={{ span: 8 }}
                        md={{ span: 12 }}
                        sm={{ span: 12 }}
                        xs={{ span: 24 }}
                    >
                        <GroupCard
                            key={item.id}
                            data={item}
                            onRemove={handleOnRemoveGroup}
                        />
                    </Col>
                ))}
        </Row>
    );
};

export default ListGroup;
