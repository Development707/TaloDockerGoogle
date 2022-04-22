import {
    DeleteOutlined,
    EditOutlined,
    EyeTwoTone,
    PlusCircleTwoTone,
    PlusOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import {
    Button,
    Col,
    Divider,
    Drawer,
    Form,
    Input,
    Menu,
    message,
    Popconfirm,
    Row,
    Space,
    Table,
    Typography,
    Upload,
} from 'antd';
import stickerApi from 'api/stickerApi';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const { Search } = Input;
const { Link } = Typography;
const StickerPage = () => {
    const [dataSource, setDataSource] = useState([]);
    const [dataTemp, setDataTemp] = useState([]);

    const [visibleCreate, setVisibleCreate] = useState(false);
    const [visibleUpdate, setVisibleUpdate] = useState(false);
    const [visibleAddEmoji, setVisibleAddemoji] = useState(false);

    const [temp, setTemp] = useState('');
    const [tempName, setName] = useState('');
    const [tempDescription, setDescription] = useState('');
    const [file, setFile] = useState([]);
    const navigate = useNavigate();

    const onSearch = (value) => {
        console.log('value', value);
        const filterTable = dataSource.filter((name) =>
            Object.keys(name).some((k) =>
                String(name[k]).toLowerCase().includes(value.toLowerCase())
            )
        );

        if (value === '') {
            setDataSource(dataTemp);
        } else {
            setDataSource(filterTable);
        }
    };

    const handleGetAllSticker = async () => {
        try {
            const listSticker = await stickerApi.fetchAllSticker();
            return listSticker;
        } catch (error) {}
    };
    useEffect(() => {
        handleGetAllSticker()
            .then((result) => {
                setDataSource(result);
                setDataTemp(result);
            })
            .catch((err) => {
                throw err;
            });
    }, []);

    const showDrawerCreateSticker = () => {
        setVisibleCreate(true);
    };
    const onCloseCreate = () => {
        setVisibleCreate(false);
    };
    const handleCreateSticker = async (values) => {
        const { name, description } = values;

        try {
            await stickerApi.createSticker(name, description);
            setDataSource([...dataSource, values]);
            message.success('Đã tạo sticker thành công', 5);
        } catch (error) {
            message.error('Tạo sticker thất bại', 5);
        }
    };
    const handleDeleteSticker = async (id) => {
        try {
            await stickerApi.deleteSticker(id);
            message.success('Đã xoá group sticker', 5);
            setDataSource(await handleGetAllSticker());
        } catch (error) {
            message.error('Xóa thất bại vì sticker có chứa emoji', 5);
        }
    };
    const onCancel = () => {};
    const showDrawerUpdate = (id, name, description) => {
        setVisibleUpdate(true);
        setTemp(id);
        setName(name);
        setDescription(description);
    };

    const handleUpdateSticker = async (values) => {
        const { name, description } = values;
        try {
            await stickerApi.updateSticker(temp, name, description);
            message.success('Chỉnh sửa sticker hoàn tất', 5);
            setDataSource(await handleGetAllSticker());
            onCloseUpdate();
        } catch (error) {
            message.error('Chỉnh sửa sticker đã xảy ra lỗi', 5);
        }
    };
    const onCloseUpdate = () => {
        setVisibleUpdate(false);
        setTemp('');
        setName('');
        setDescription('');
    };

    const showDrawerCreateEmoji = (id) => {
        setTemp(id);
        setVisibleAddemoji(true);
    };
    const handleFileChange = async ({ file, fileList }) => {
        setFile(fileList);
    };
    const handleAddEmoji = async () => {
        try {
            for (let index = 0; index < file.length; index++) {
                const item = file[index].originFileObj;
                const frmData = new FormData();
                frmData.append('file', item);
                await stickerApi.addEmoji(temp, frmData);
            }
            message.success('Thêm emoji vào sticker hoàn tất', 5);
        } catch (error) {
            message.error('Thêm emoji vào sticker đã xảy ra lỗi', 5);
        }

        const listSticker = await stickerApi.fetchAllSticker();
        setDataSource(listSticker);
    };

    const handleViewEmoji = async (id, emojis) => {
        try {
            console.log(emojis);

            navigate(`/admin/stickers/${id}`, { state: emojis });
        } catch (error) {}
    };

    const columns = [
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (data, row) => (
                <Space size="middle">
                    <Popconfirm
                        title="Bạn có muốn xoá ?"
                        onConfirm={() => handleDeleteSticker(data.id)}
                        onCancel={onCancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Link alt="xoá sticker">
                            <DeleteOutlined />
                            Xoá{' '}
                        </Link>
                    </Popconfirm>

                    <Link
                        onClick={() =>
                            showDrawerUpdate(
                                data.id,
                                data.name,
                                data.description
                            )
                        }
                    >
                        <EditOutlined />
                        Sửa{' '}
                    </Link>
                    <Link onClick={() => showDrawerCreateEmoji(data.id)}>
                        <PlusCircleTwoTone />
                        Thêm Sticker{' '}
                    </Link>

                    <Link
                        alt="xem sticker emoji"
                        onClick={() => handleViewEmoji(data.id, data.emojis)}
                    >
                        <EyeTwoTone />
                        Xem Sticker emoji{' '}
                    </Link>
                </Space>
            ),
        },
    ];

    return (
        <div className="sticker-page" style={{ padding: '10px 20px' }}>
            <Divider orientation="left">Quản lý sticker</Divider>
            <div style={{ textAlign: 'center' }}>
                <Search
                    placeholder="Sticker"
                    onSearch={onSearch}
                    enterButton
                    style={{ width: '40%' }}
                />
            </div>
            <Divider />
            <Col offset={20} span={6}>
                <Button
                    type="primary"
                    placement="right"
                    onClick={showDrawerCreateSticker}
                    icon={<PlusOutlined />}
                >
                    Add Sticker
                </Button>
            </Col>
            <Drawer
                title="Tạo sticker"
                width={720}
                onClose={onCloseCreate}
                visible={visibleCreate}
                bodyStyle={{ paddingBottom: 80 }}
            >
                <Form
                    layout="vertical"
                    onFinish={handleCreateSticker}
                    hideRequiredMark
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Tên"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên sticker',
                                    },
                                ]}
                            >
                                <Input placeholder="Nhập tên sticker" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="description"
                                label="Mô tả"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập mô tả',
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    rows={4}
                                    placeholder="Nhập mô tả"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Button type="primary" htmlType="submit">
                        Lưu
                    </Button>
                </Form>
            </Drawer>

            <Drawer
                visible={visibleUpdate}
                title="Chỉnh sửa sticker"
                width={720}
                bodyStyle={{ paddingBottom: 80 }}
                onClose={onCloseUpdate}
            >
                <Form
                    layout="vertical"
                    initialValues={{
                        name: tempName,
                        description: tempDescription,
                    }}
                    hideRequiredMark
                    onFinish={handleUpdateSticker}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Tên"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Nhập tên sticker',
                                    },
                                ]}
                            >
                                <Input placeholder="Nhập tên sticker" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Mô tả"
                                name="description"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập mô tả',
                                    },
                                ]}
                            >
                                <Input placeholder="Nhập mô tả" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Button type="primary" htmlType="submit">
                        Chỉnh sửa
                    </Button>
                </Form>
            </Drawer>

            <Drawer
                visible={visibleAddEmoji}
                title="Thêm emoji vào sticker"
                width={720}
                onClose={() => setVisibleAddemoji(false)}
                bodyStyle={{ paddingBottom: 80 }}
            >
                <Upload
                    listType="picture"
                    defaultFileList={[...file]}
                    onChange={handleFileChange}
                >
                    <Button icon={<UploadOutlined />}>Tải lên</Button>
                </Upload>
                <Button
                    style={{ marginTop: '2rem' }}
                    type="primary"
                    onClick={handleAddEmoji}
                >
                    Thêm
                </Button>
            </Drawer>

            <Table
                dataSource={dataSource}
                columns={columns}
                bordered={false}
            ></Table>
        </div>
    );
};

export default StickerPage;
