import {
    AlignLeftOutlined,
    AppstoreAddOutlined,
    SearchOutlined,
    UserAddOutlined,
    UsergroupAddOutlined,
} from '@ant-design/icons';
import { Input, message, Radio } from 'antd';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ModalAddFriend from 'components/ModalAddFriend';

import './style.scss';
import userApi from 'api/userApi';
import UserCard from 'components/UserCard';
import ModalCreateGroup from 'components/ModalCreateGroup';
import {
    createGroup,
    fetchListConversations,
} from 'features/Chat/slice/chatSlice';
import ModalClassify from 'features/Chat/components/ModalClassify';
// const { TabPane } = Tabs;

SearchContainer.propTypes = {
    onVisibleFilter: PropTypes.func,
    onSearchChange: PropTypes.func,
    valueText: PropTypes.string,
    onSubmitSearch: PropTypes.func,
    isFriendPage: PropTypes.bool,
    onFilterClasify: PropTypes.func,
    valueClassify: PropTypes.string.isRequired,
};

SearchContainer.defaultProps = {
    onVisibleFilter: null,
    valueText: '',
    onSearchChange: null,
    onSubmitSearch: null,
    isFriendPage: false,
    onFilterClasify: null,
};
function SearchContainer({
    valueText,
    onSearchChange,
    onSubmitSearch,
    isFriendPage,
    onFilterClasify,
    valueClassify,
}) {
    const { classifies } = useSelector((state) => state.chat);
    const refSearch = useRef(null);
    const [isShowModalAddFriend, setIsShowModalAddFriend] = useState(false);
    const [isShowModalClasify, setIsShowModalClasify] = useState(false);
    const [userIsFind, setUserIsFind] = useState({});
    const [isModalCreateGroupVisible, setIsModalCreateGroupVisible] =
        useState(false);
    const [visibleUserCard, setVisbleUserCard] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const dispatch = useDispatch();

    // Handle add friend===========================================
    const handleOpenModalAddFriend = () => {
        setIsShowModalAddFriend(true);
    };

    const handeCancelModalAddFriend = () => {
        setIsShowModalAddFriend(false);
    };

    const handFindUser = async (value) => {
        try {
            const user = await userApi.fetchUser(value);
            setUserIsFind(user);
            setVisbleUserCard(true);
            setIsShowModalClasify(false);
        } catch (error) {
            message.error('Không tìm thấy người dùng');
        }
    };

    const handOnSearchUser = (value) => {
        handFindUser(value);
    };

    const handleOnEnter = (value) => {
        handFindUser(value);
    };

    // Handle create group===========================================
    const handleOpenModalGroup = () => {
        setIsModalCreateGroupVisible(true);
    };

    const handleCancelModalCreatGroup = (value) => {
        setIsModalCreateGroupVisible(value);
    };

    const handleOklModalCreatGroup = (value) => {
        try {
            // console.log(value);
            setConfirmLoading(true);
            dispatch(createGroup(value));
            // dispatch(fetchListConversations());
            setConfirmLoading(false);
            setIsModalCreateGroupVisible(false);
            message.success('Tạo nhóm thành công');
        } catch (error) {
            message.error('Tạo nhóm không thành công');
        }
    };

    // handle input search===========================================
    const handleInputChange = (event) => {
        const value = event.target.value;

        if (onSearchChange) {
            onSearchChange(value);
        }

        if (refSearch.current) {
            clearTimeout(refSearch.current);
        }

        refSearch.current = setTimeout(() => {
            if (onSubmitSearch) {
                onSubmitSearch();
            }
        }, 100);
    };

    // Handle User Card
    const handleCancelModalUserCard = () => {
        setVisbleUserCard(false);
        setIsShowModalAddFriend(false);
    };
    // Classify====================
    const handleOnChangeClassify = (e) => {
        const value = e.target.value;
        if (onFilterClasify) {
            onFilterClasify(value);
        }
    };
    const handleCreateClasify = () => {
        setIsShowModalClasify(true);
    };

    const handleOpenModalClassify = () => {
        setIsShowModalClasify(true);
    };
    const handleCancelClassifyModal = () => {
        setIsShowModalClasify(false);
    };
    return (
        <div id="search-wrapper">
            <div className="search-main">
                <div className="search-top">
                    <div className="search-top_input-search">
                        <Input
                            placeholder="Tìm kiếm"
                            prefix={<SearchOutlined />}
                            allowClear
                            value={valueText}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div
                        className="search-top_add-friend"
                        onClick={handleOpenModalAddFriend}
                    >
                        <UserAddOutlined />
                    </div>

                    <div
                        className="search-top_create-group"
                        onClick={handleOpenModalGroup}
                    >
                        <UsergroupAddOutlined />
                    </div>
                </div>
                {!isFriendPage && (
                    <>
                        {!(valueText.trim().length > 0) && (
                            <div className="search-bottom">
                                <div className="classify-title">
                                    {/* <Scrollbars
                                        autoHide={true}
                                        autoHideTimeout={1000}
                                        autoHideDuration={200}
                                        style={{
                                            height: '30px',
                                            width: '100%',
                                        }}
                                    >
                                        <Radio.Group size="small">
                                            <Radio value={'0'}>Tất cả</Radio>
                                            <Radio value={'1'}>Chưa đọc</Radio>
                                        </Radio.Group>
                                    </Scrollbars> */}

                                    <div
                                        className="add-classify"
                                        onClick={handleCreateClasify}
                                    >
                                        <span>Phân loại</span>&nbsp;
                                        <AppstoreAddOutlined />
                                    </div>
                                </div>
                                <div className="classify-element">
                                    <div className="classify-element-title">
                                        <AlignLeftOutlined />{' '}
                                    </div>
                                    <Scrollbars
                                        autoHide={true}
                                        autoHideTimeout={1000}
                                        autoHideDuration={200}
                                        style={{
                                            height: '42px',
                                            width: '100%',
                                        }}
                                    >
                                        <Radio.Group
                                            size="small"
                                            value={valueClassify}
                                            onChange={handleOnChangeClassify}
                                        >
                                            <Radio value={'0'}>Tất cả</Radio>
                                            {classifies.map((item, index) => (
                                                <Radio
                                                    key={index}
                                                    value={item.id}
                                                >
                                                    {item.name}
                                                </Radio>
                                            ))}
                                        </Radio.Group>
                                    </Scrollbars>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <ModalAddFriend
                isVisible={isShowModalAddFriend}
                onCancel={handeCancelModalAddFriend}
                onSearch={handOnSearchUser}
                onEnter={handleOnEnter}
            />
            <UserCard
                user={userIsFind}
                isVisible={visibleUserCard}
                onCancel={handleCancelModalUserCard}
            />

            <ModalCreateGroup
                loading={confirmLoading}
                isVisible={isModalCreateGroupVisible}
                onCancel={handleCancelModalCreatGroup}
                onOk={handleOklModalCreatGroup}
            />

            <ModalClassify
                isVisible={isShowModalClasify}
                onCancel={handleCancelClassifyModal}
                onOpen={handleOpenModalClassify}
            />
        </div>
    );
}

export default SearchContainer;
