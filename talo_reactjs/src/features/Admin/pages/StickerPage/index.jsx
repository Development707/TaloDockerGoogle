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
            message.success('???? t???o nh??n d??n th??nh c??ng');
        } catch (error) {
            message.error('T???o nh??n d??n th???t b???i');
        }
    };
    const handleDeleteSticker = async (id) => {
        try {
            await stickerApi.deleteSticker(id);
            message.success('???? xo?? nh??n d??n');
            setDataSource(await handleGetAllSticker());
        } catch (error) {
            message.error('X??a th???t b???i v?? nh??n d??n c?? ch???a emoji');
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
            message.success('Ch???nh s???a nh??n d??n ho??n t???t');
            setDataSource(await handleGetAllSticker());
            onCloseUpdate();
        } catch (error) {
            message.error('Ch???nh s???a nh??n d??n ???? x???y ra l???i');
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
            message.success('Th??m c???m x??c v??o nh??n d??n ho??n t???t');

            handleCloseAddEmoji();
        } catch (error) {
            message.error('Th??m c???m x??c v??o nh??n d??n ???? x???y ra l???i');
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
            title: 'T??n',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'M?? t???',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Thao t??c',
            key: 'action',
            render: (data, row) => (
                <Space size="middle">
                    <Popconfirm
                        title="B???n c?? mu???n xo?? ?"
                        onConfirm={() => handleDeleteSticker(data.id)}
                        onCancel={onCancel}
                        okText="X??a"
                        cancelText="H???y"
                    >
                        <Link alt="xo?? nh??n d??n">
                            <DeleteOutlined />
                            Xo??{' '}
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
                        S???a{' '}
                    </Link>
                    <Link onClick={() => showDrawerCreateEmoji(data.id)}>
                        <PlusCircleTwoTone />
                        Th??m c???m x??c{' '}
                    </Link>

                    <Link
                        alt="xem c???m x??c"
                        onClick={() => handleViewEmoji(data.id, data.emojis)}
                    >
                        <EyeTwoTone />
                        Xem c???m x??c{' '}
                    </Link>
                </Space>
            ),
        },
    ];

    return (
        <div className="sticker-page" style={{ padding: '10px 20px' }}>
            <Divider orientation="left">Qu???n l?? nh??n d??n</Divider>
            <div style={{ textAlign: 'center' }}>
                <Search
                    placeholder="Nh??n d??n"
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
                    T???o nh??n d??n
                </Button>
            </Col>
            <Drawer
                title="T???o nh??n d??n"
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
                                label="T??n"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui l??ng nh???p t??n nh??n d??n',
                                    },
                                    {
                                        min: 5,
                                        message:
                                            'T??n nh??n d??n ph???i c?? ??t nh???t 5 k?? t???',
                                    },
                                ]}
                            >
                                <Input placeholder="Nh???p t??n nh??n d??n" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="description"
                                label="M?? t???"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui l??ng nh???p m?? t???',
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    rows={4}
                                    placeholder="Nh???p m?? t???"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Button type="primary" htmlType="submit">
                        L??u
                    </Button>
                </Form>
            </Drawer>

            <Drawer
                visible={visibleUpdate}
                title="Ch???nh s???a nh??n d??n"
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
                                label="T??n"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui l??ng nh???p t??n nh??n d??n',
                                    },
                                    {
                                        min: 5,
                                        message:
                                            'T??n nh??n d??n ph???i c?? ??t nh???t 5 k?? t???',
                                    },
                                ]}
                            >
                                <Input placeholder="Nh???p t??n nh??n d??n m???i" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="M?? t???"
                                name="description"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui l??ng nh???p m?? t???',
                                    },
                                ]}
                            >
                                <Input placeholder="Nh???p m?? t??? m???i" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Button type="primary" htmlType="submit">
                        Ch???nh s???a
                    </Button>
                </Form>
            </Drawer>

            <Drawer
                visible={visibleAddEmoji}
                title="Th??m c???m x??c v??o nh??n d??n"
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
                    <Button icon={<UploadOutlined />}>T???i l??n</Button>
                </Upload>
                <Button
                    style={{ marginTop: '2rem' }}
                    type="primary"
                    onClick={handleAddEmoji}
                >
                    Th??m
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
