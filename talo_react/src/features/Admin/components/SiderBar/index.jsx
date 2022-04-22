import {
    AliwangwangOutlined,
    PoweroffOutlined,
    UsergroupAddOutlined,
} from '@ant-design/icons';
import { Button, Menu } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import React from 'react';
import { Link } from 'react-router-dom';

const SiderBar = () => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');

        window.location.reload();
    };
    return (
        <Sider
            style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
            }}
        >
            <div className="logo" />
            <div className="button-logout">
                <Button
                    type="primary"
                    danger
                    icon={<PoweroffOutlined />}
                    onClick={handleLogout}
                >
                    Đăng xuất
                </Button>
            </div>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item key="1" icon={<UsergroupAddOutlined />}>
                    <Link to="/admin"> Quản lý người dùng</Link>
                </Menu.Item>

                <Menu.Item key="2" icon={<AliwangwangOutlined />}>
                    <Link to="/admin/stickers"> Quản lý sticker</Link>
                </Menu.Item>
            </Menu>
        </Sider>
    );
};

export default SiderBar;
