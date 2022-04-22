import { Col, message, Modal, Row } from 'antd';
import conversationApi from 'api/conversationApi';
import { fetchListGroup } from 'features/Friend/friendSlice';
import React from 'react';
import { useDispatch } from 'react-redux';
import GroupCard from '../GroupCard';

const ListGroup = ({ data }) => {
    const dispatch = useDispatch();

    const handleOkModal = async (id) => {
        try {
            await conversationApi.leaveGroup(id);
            message.success(`Rời nhóm thành công`);
            dispatch(fetchListGroup({ name: '', type: 'GROUP' }));
        } catch (error) {
            message.error(`Rời nhóm thất bại`);
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
