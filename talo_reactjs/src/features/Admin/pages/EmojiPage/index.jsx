import { DeleteOutlined } from '@ant-design/icons';
import {
    Breadcrumb,
    Divider,
    message,
    Popconfirm,
    Space,
    Table,
    Typography,
} from 'antd';
import stickerApi from 'api/stickerApi';

import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
const { Link } = Typography;
const EmojiPage = () => {
    const location = useLocation();
    const emojis = location.state;
    const { id } = useParams();

    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const onCancel = () => {};
    const handleBack = () => {
        navigate(-1);
    };
    const handleDeleteEmoji = async (emoji) => {
        try {
            await stickerApi.deleteEmoji(id, emoji.name);
            navigate(-1);
            message.success('Xóa emoji thành công', 5);
        } catch (error) {
            message.error('Xóa emoji thất bại', 5);
        }
    };
    const columns = [
        {
            title: 'Emoji',
            key: 'emoji',
            render: (emojis) => (
                <span>
                    <Link key={emojis}>
                        <img
                            width="100px"
                            height="75px"
                            src={emojis?.url}
                            border="1px solid black"
                            alt=""
                        />
                        <br />
                    </Link>
                </span>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (emojis) => (
                <Space size="middle">
                    <Popconfirm
                        title="Bạn có muốn xoá ?"
                        onConfirm={() => handleDeleteEmoji(emojis)}
                        onCancel={onCancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Link alt="xoá emoji">
                            <DeleteOutlined />
                            Xoá Emoji{' '}
                        </Link>
                    </Popconfirm>
                </Space>
            ),
        },
    ];
    return (
        <div>
            <div className="ant-col-xs-8">
                <h1>DANH SÁCH STICKER</h1>
            </div>
            <Divider />
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item>&ensp; Admin</Breadcrumb.Item>
                    <Breadcrumb.Item>
                        {' '}
                        <Link onClick={handleBack}>Danh sách sticker</Link>
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <Divider />

            <Table
                columns={columns}
                dataSource={emojis}
                bordered
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    showSizeChanger: false,

                    onChange: (page, pageSize) => {
                        setPage(page);
                        setPageSize(pageSize);
                    },
                }}
                rowKey={(record) => record.emojis}
            ></Table>
        </div>
    );
};

export default EmojiPage;
