import { Divider, Input, message, Pagination } from 'antd';
import adminApi from 'api/adminApi';
import { setLoadingAccount } from 'features/Account/accountSlice';
import TableUsers from 'features/Admin/components/TableUsers';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
const { Search } = Input;

const UserPage = () => {
    const [dataSource, setDataSource] = useState({});
    const [query, setQuery] = useState({
        username: '',
        page: 0,
        size: 20,
    });
    const dispatch = useDispatch();

    useEffect(() => {
        adminApi
            .getListUsersByUserName(query.username, query.page, query.size)
            .then((res) => setDataSource(res));
    }, [query]);

    const onSearch = (value) => {
        setQuery({ ...query, username: value });
    };
    const handleUpdateStatus = async (id, isDeleted) => {
        try {
            dispatch(setLoadingAccount(true));
            await adminApi.updateIsDeleted(id, isDeleted);
            message.success('Đã thay đổi trạng thái', 5);
            setQuery({ ...query });
        } catch (error) {
            message.error(
                'Tài khoản đang được sử dụng...! không thể đổi trạng thái',
                5
            );
        }
        dispatch(setLoadingAccount(false));
    };

    const onchangePage = (page, _) => {
        setQuery({ ...query, page: page - 1 });
    };
    return (
        <div className="user-page" style={{ padding: '10px 20px' }}>
            <Divider orientation="left">Quản lý người dùng</Divider>

            <div style={{ textAlign: 'center' }}>
                <Search
                    placeholder="SĐT/Email người dùng"
                    onSearch={onSearch}
                    enterButton
                    style={{ width: '40%' }}
                />
            </div>
            <Divider />
            <div className="users-table">
                <TableUsers
                    usersPage={dataSource}
                    onUpdateStatus={handleUpdateStatus}
                />
            </div>
            <div style={{ textAlign: 'right', marginTop: '10px' }}>
                <Pagination
                    defaultCurrent={dataSource.page + 1}
                    total={dataSource.totalPages * 10}
                    onChange={onchangePage}
                />
            </div>
        </div>
    );
};

export default UserPage;
