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
    message,
    Popconfirm,
    Row,
    Space,
    Table,
    Typography,
    Upload,
} from 'antd';
import stickerApi from 'api/stickerApi';
import { useEffect, useRef, useState } from 'react';
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
    const [tempName, setTempName] = useState('');
    const [tempDescription, setTempDescription] = useState('');
    const [file, setFile] = useState([]);
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const prevVisibleCreate = useRef();
    const prevVisibleUpdate = useRef();

    useEffect(() => {
        prevVisibleCreate.current = visibleCreate;
        prevVisibleUpdate.current = visibleUpdate;
    }, [visibleCreate, visibleUpdate]);

    useEffect(() => {
        if (!visibleCreate && prevVisibleCreate) {
            form.resetFields();
        }
        if (!visibleUpdate && prevVisibleUpdate) {
            form.resetFields();
        }

        //eslint-disable-next-line
    }, [visibleCreate, visibleUpdate]);

    const onSearch = (value) => {
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
            setDataSource(await handleGetAllSticker());
            onCloseCreate();
            message.success('Đã tạo nhãn dán thành công');
        } catch (error) {
            message.error('Tạo nhãn dán thất bại');
        }
    };
    const handleDeleteSticker = async (id) => {
        try {
            await stickerApi.deleteSticker(id);
            message.success('Đã xoá nhãn dán');
            setDataSource(await handleGetAllSticker());
        } catch (error) {
            message.error('Xóa thất bại vì nhãn dán có chứa emoji');
        }
    };
    const onCancel = () => {};
    const showDrawerUpdate = (id, name, description) => {
        setTemp(id);
        setTempName(name);
        setTempDescription(description);
        setVisibleUpdate(true);
    };

    const handleUpdateSticker = async (values) => {
        const { name, description } = values;
        try {
            await stickerApi.updateSticker(temp, name, description);
            message.success('Chỉnh sửa nhãn dán hoàn tất');
            setDataSource(await handleGetAllSticker());
            onCloseUpdate();
        } catch (error) {
            message.error('Chỉnh sửa nhãn dán đã xảy ra lỗi');
        }
    };

    const onCloseUpdate = () => {
        setVisibleUpdate(false);
        setTemp('');
        setTempName('');
        setTempDescription('');
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
            message.success('Thêm cảm xúc vào nhãn dán hoàn tất');

            handleCloseAddEmoji();
        } catch (error) {
            message.error('Thêm cảm xúc vào nhãn dán đã xảy ra lỗi');
        }

        const listSticker = await stickerApi.fetchAllSticker();
        setDataSource(listSticker);
    };

    const handleViewEmoji = async (id, emojis) => {
        try {
            navigate(`/admin/stickers/${id}`, { state: emojis });
        } catch (error) {}
    };
    const handleCloseAddEmoji = () => {
        setVisibleAddemoji(false);
        setFile([]);
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
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Link alt="xoá nhãn dán">
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
                        Thêm cảm xúc{' '}
                    </Link>

                    <Link
                        alt="xem cảm xúc"
                        onClick={() => handleViewEmoji(data.id, data.emojis)}
                    >
                        <EyeTwoTone />
                        Xem cảm xúc{' '}
                    </Link>
                </Space>
            ),
        },
    ];

    return (
        <div className="sticker-page" style={{ padding: '10px 20px' }}>
            <Divider orientation="left">Quản lý nhãn dán</Divider>
            <div style={{ textAlign: 'center' }}>
                <Search
                    placeholder="Nhãn dán"
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
                    style={{ marginBottom: '1rem' }}
                >
                    Tạo nhãn dán
                </Button>
            </Col>
            <Drawer
                title="Tạo nhãn dán"
                width={720}
                onClose={onCloseCreate}
                visible={visibleCreate}
                bodyStyle={{ paddingBottom: 80 }}
            >
                <Form
                    layout="vertical"
                    onFinish={handleCreateSticker}
                    hideRequiredMark
                    form={form}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Tên"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên nhãn dán',
                                    },
                                    {
                                        min: 5,
                                        message:
                                            'Tên nhãn dán phải có ít nhất 5 ký tự',
                                    },
                                ]}
                            >
                                <Input placeholder="Nhập tên nhãn dán" />
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
                title="Chỉnh sửa nhãn dán"
                width={720}
                bodyStyle={{ paddingBottom: 80 }}
                onClose={onCloseUpdate}
            >
                <Form
                    layout="vertical"
                    hideRequiredMark
                    onFinish={handleUpdateSticker}
                    initialValues={{
                        name: tempName,
                        description: tempDescription,
                    }}
                    form={form}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Tên"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên nhãn dán',
                                    },
                                    {
                                        min: 5,
                                        message:
                                            'Tên nhãn dán phải có ít nhất 5 ký tự',
                                    },
                                ]}
                            >
                                <Input placeholder="Nhập tên nhãn dán mới" />
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
                                <Input placeholder="Nhập mô tả mới" />
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
                title="Thêm cảm xúc vào nhãn dán"
                width={720}
                onClose={handleCloseAddEmoji}
                bodyStyle={{ paddingBottom: 80 }}
                destroyOnClose={true}
            >
                <Upload
                    listType="picture"
                    defaultFileList={[...file]}
                    onChange={handleFileChange}
                    beforeUpload={() => false}
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
