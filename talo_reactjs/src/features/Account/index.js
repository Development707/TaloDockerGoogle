import { Spin } from 'antd';

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import ForgotPage from './pages/ForgotPage';
import LoginPage from './pages/LoginPage';
import PhoneLogin from './pages/PhoneLogin';
import RegistryPage from './pages/RegistryPage';

import './style.scss';
function Account() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.global);
    const { isLoadingAccount } = useSelector((state) => state.account);

    console.log('user', user);
    useEffect(() => {
        if (user) {
            if (user.role === 'USER') navigate('/chat');
            else navigate('/admin');
        }
        //eslint-disable-next-line
    }, []);

    return (
        <Spin spinning={isLoadingAccount}>
            <div id="account_page">
                <Routes>
                    <Route path="" index element={<LoginPage />} />
                    <Route path="registry" element={<RegistryPage />} />
                    <Route path="forgot" element={<ForgotPage />} />
                    <Route path="phone-login" element={<PhoneLogin />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Spin>
    );
}

export default Account;
