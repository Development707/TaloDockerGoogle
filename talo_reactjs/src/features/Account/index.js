import { Spin } from 'antd';

import React from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import ForgotPage from './pages/ForgotPage';
import LoginPage from './pages/LoginPage';
import PhoneLogin from './pages/PhoneLogin';
import RegistryPage from './pages/RegistryPage';

import './style.scss';
function Account(props) {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.global);
    const { isLoadingAccount } = useSelector((state) => state.account);

    if (user) {
        if (user.role === 'ADMIN') navigate('/admin');
        else navigate('/chat');
    }
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
