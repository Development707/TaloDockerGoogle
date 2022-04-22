import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Menu, Popconfirm, Table, Tag } from 'antd';
import commonFunc from 'utils/commonFunc';
import Text from 'antd/lib/typography/Text';

TableUsers.propTypes = {
    usersPage: PropTypes.object,
    onUpdateStatus: PropTypes.func,
};

TableUsers.defaultProps = {
    usersPage: {},
};

function TableUsers({ usersPage, onUpdateStatus }) {
    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
        },
        {
            title: 'Tên người dùng',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Tài khoản',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
            render: (gender) => <>{gender ? <p>Nữ</p> : <p>Nam</p>}</>,
        },
        {
            title: 'Trạng thái kích hoạt',
            dataIndex: 'isActived',
            key: 'isActived',
            render: (isActived) => (
                <>
                    {isActived ? (
                        <Tag color="blue">Đã kích hoạt</Tag>
                    ) : (
                        <Tag color="red">Chưa kích hoạt </Tag>
                    )}
                </>
            ),
        },
        {
            title: 'Trạng thái tài khoản',
            dataIndex: 'isDeleted',
            key: 'isDeleted',
            render: (isDeleted, data) => (
                <Dropdown
                    overlay={
                        <Menu>
                            <Menu.Item>
                                <Popconfirm
                                    title={<Text>Thay đổi trạng thái?</Text>}
                                    onConfirm={() =>
                                        onUpdateStatus(
                                            data.id,
                                            isDeleted ? false : true
                                        )
                                    }
                                    okText="Có"
                                    cancelText="Không"
                                >
                                    {isDeleted
                                        ? 'Bỏ khóa tài khoản'
                                        : 'Khóa tài khoản'}
                                </Popconfirm>
                            </Menu.Item>
                        </Menu>
                    }
                    arrow
                >
                    {isDeleted ? (
                        <Tag color="red">Đã bị khóa</Tag>
                    ) : (
                        <Tag color="blue">Đang hoạt động</Tag>
                    )}
                </Dropdown>
            ),
        },
        {
            title: 'Quyền hạn',
            dataIndex: 'role',
            key: 'role',
        },
    ];
    return (
        <Table
            dataSource={commonFunc.addSTTForList(
                usersPage.data,
                usersPage.page * usersPage.size
            )}
            columns={columns}
            pagination={false}
            bordered
        ></Table>
    );
}

export default TableUsers;
