import {
    ContactsTwoTone,
    LockOutlined,
    LogoutOutlined,
    MessageTwoTone,
    SettingTwoTone,
    UserOutlined,
} from '@ant-design/icons';
import { Badge, Button, Popover } from 'antd';
import PersonalIcon from 'features/Chat/components/PersonalIcon';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NavbarStyle from './NavbarStyle';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import ModalUpdateProfile from 'features/Chat/components/ModalUpdateProfile';
import ModalChangePassword from 'components/ModalChangePassword';
import './style.scss';
import { setTotalUnread } from 'features/Chat/slice/chatSlice';

NavbarContainer.propTypes = {
    onSaveCodeRevoke: PropTypes.func,
};

NavbarContainer.defaultProps = {
    onSaveCodeRevoke: null,
};
function NavbarContainer({ onSaveCodeRevoke }) {
    const { user } = useSelector((state) => state.global);
    const { conversations, toTalUnread } = useSelector((state) => state.chat);
    const { amountNotify } = useSelector((state) => state.friend);

    const location = useLocation();
    const dispatch = useDispatch();

    //model
    const [isModalUpdateProfileVisible, setIsModalUpdateProfileVisible] =
        useState(false);
    const [isModalChangePasswordVisible, setIsModalChangePasswordVisible] =
        useState(false);

    const checkCurrentPage = (iconName) => {
        if (iconName === 'MESSAGE' && location.pathname === '/chat') {
            return true;
        }
        if (iconName === 'FRIEND' && location.pathname === '/chat/friends') {
            return true;
        }
        return false;
    };

    useEffect(() => {
        dispatch(setTotalUnread());
    }, [conversations]);

    // --- Hangle update profile
    const handleUpdateProfile = () => {
        setIsModalUpdateProfileVisible(true);
    };
    const handleCancelModalUpdateProfile = (value) => {
        setIsModalUpdateProfileVisible(value);
    };
    //Logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        // navigate('/');
        window.location.reload();
    };
    const content = (
        <div className="pop_up-personal">
            <div
                className="pop_up-personal--item"
                onClick={handleUpdateProfile}
            >
                <div className="pop_up-personal--item-icon">
                    <UserOutlined />
                </div>

                <div className="pop_up-personal--item-text">Tài khoản</div>
            </div>

            <div className="pop_up-personal--item" onClick={handleLogout}>
                <div className="pop_up-personal--item-icon">
                    <LogoutOutlined />
                </div>

                <div className="pop_up-personal--item-text">Đăng xuất</div>
            </div>
        </div>
    );

    const handleChangePassword = () => {
        setIsModalChangePasswordVisible(true);
    };
    const setting = (
        <div className="pop_up-personal">
            <div
                className="pop_up-personal--item"
                onClick={handleChangePassword}
            >
                <div className="pop_up-personal--item-icon">
                    <LockOutlined />
                </div>

                <div className="pop_up-personal--item-text">Đổi mật khẩu</div>
            </div>
        </div>
    );

    return (
        <div id="sidebar_wrapper">
            <div className="sidebar-main">
                <ul className="sidebar_nav">
                    <li className="sidebar_nav_item icon-avatar">
                        <Popover
                            placement="bottomLeft"
                            content={content}
                            trigger="focus"
                        >
                            <Button style={NavbarStyle.BUTTON}>
                                <div className="user-icon-navbar">
                                    <PersonalIcon
                                        isActive={true}
                                        common={false}
                                        name={user.name}
                                        avatar={user.avatar.url}
                                    />
                                </div>
                            </Button>
                        </Popover>
                    </li>

                    <Link className="link-icon" to="/chat">
                        <li
                            className={`sidebar_nav_item  ${
                                checkCurrentPage('MESSAGE') ? 'active' : ''
                            }`}
                        >
                            <div className="sidebar_nav_item--icon">
                                <Badge
                                    count={toTalUnread > 0 ? toTalUnread : 0}
                                >
                                    <MessageTwoTone />
                                </Badge>
                            </div>
                        </li>
                    </Link>

                    <Link className="link-icon" to="/chat/friends">
                        <li
                            className={`sidebar_nav_item  ${
                                checkCurrentPage('FRIEND') ? 'active' : ''
                            }`}
                        >
                            <div className="sidebar_nav_item--icon">
                                <Badge count={amountNotify}>
                                    <ContactsTwoTone />
                                </Badge>
                            </div>
                        </li>
                    </Link>
                </ul>

                <ul className="sidebar_nav">
                    <li className="sidebar_nav_item">
                        <div className="sidebar_nav_item--icon">
                            <Popover
                                placement="rightTop"
                                content={setting}
                                trigger="focus"
                            >
                                <Button style={NavbarStyle.BUTTON_SETTING}>
                                    <SettingTwoTone />
                                </Button>
                            </Popover>
                        </div>
                    </li>
                </ul>
            </div>

            <ModalUpdateProfile
                isVisible={isModalUpdateProfileVisible}
                onCancel={handleCancelModalUpdateProfile}
            />

            <ModalChangePassword
                visible={isModalChangePasswordVisible}
                onCancel={() => setIsModalChangePasswordVisible(false)}
                onSaveCodeRevoke={onSaveCodeRevoke}
            />
        </div>
    );
}

export default NavbarContainer;
