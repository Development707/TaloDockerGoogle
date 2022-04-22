import { Button, Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SiderBar from './components/SiderBar';
import EmojiPage from './pages/EmojiPage';
import StickerPage from './pages/StickerPage';
import UserPage from './pages/UserPage';
import './style.scss';

const Admin = () => {
    return (
        <>
            <Layout hasSider>
                <SiderBar />
                <Layout
                    className="site-layout"
                    style={{
                        marginLeft: 200,
                    }}
                >
                    <Content
                        style={{
                            margin: '24px 16px 0',
                            overflow: 'initial',
                        }}
                    >
                        <div
                            className="site-layout-background"
                            style={{
                                padding: 24,
                                textAlign: 'center',
                            }}
                        >
                            <Routes>
                                <Route path="/" element={<UserPage />} />
                                <Route
                                    path="/stickers"
                                    element={<StickerPage />}
                                />
                                <Route
                                    path="/stickers/:id"
                                    element={<EmojiPage />}
                                />
                            </Routes>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </>
    );
};

export default Admin;
