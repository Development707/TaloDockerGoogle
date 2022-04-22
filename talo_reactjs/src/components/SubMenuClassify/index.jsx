import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Divider, Menu } from 'antd';
import { CheckOutlined, TagFilled, TagOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { fetchListClassify } from 'features/Chat/slice/chatSlice';
import classifyApi from 'api/ClassifyApi';
import ModalClassify from 'features/Chat/components/ModalClassify';
import classifyUtils from 'utils/classifyUtils';
import './style.scss';

SubMenuClassify.propTypes = {
    data: PropTypes.array,
    idConver: PropTypes.string.isRequired,
};

SubMenuClassify.defaultProps = {
    data: [],
};
function SubMenuClassify({ data, idConver }) {
    const { SubMenu } = Menu;
    const [visible, setVisible] = useState(false);
    const dispatch = useDispatch();
    const refClassify = useRef();

    useEffect(() => {
        if (data.length > 0) {
            const temp = classifyUtils.getClassifyOfObject(idConver, data);
            if (temp) {
                refClassify.current = temp;
            } else {
                refClassify.current = null;
            }
        }
        // eslint-disable-next-line
    }, [data, idConver]);
    const handleClickClassify = async (id) => {
        if (refClassify.current && refClassify.current.id === id) {
            await classifyApi.deleteClassifyFromConversation(id, idConver);
            dispatch(fetchListClassify());
        } else {
            await classifyApi.addClassifyForConversation(id, idConver);
            dispatch(fetchListClassify());
        }
    };
    return (
        <SubMenu
            title={<span className="menu-item--highlight">Phân loại</span>}
            key="sub-1"
        >
            {data.length > 0 &&
                data.map((ele) => (
                    <Menu.Item
                        className="sub-menu-classify-menu"
                        key={ele.id}
                        icon={
                            <div className="sub-menu-classify-menu-icon">
                                <div
                                    className={`sub-menu-classify-menu-icon-check ${
                                        refClassify.current &&
                                        refClassify.current.id === ele.id
                                            ? 'show'
                                            : 'hidden'
                                    }`}
                                >
                                    <CheckOutlined />
                                </div>

                                <TagFilled
                                    className="sub-menu-classify-menu-icon-tag"
                                    style={{
                                        color: `${ele.color}`,
                                        fontSize: '18px',
                                    }}
                                    rotate={45}
                                />
                            </div>
                        }
                        onClick={() => handleClickClassify(ele.id)}
                    >
                        <div className="sub-menu-classify-menu-name">
                            {ele.name}
                        </div>
                    </Menu.Item>
                ))}
            <Divider
                orientationMargin="100px"
                style={{ margin: '1rem 0 0 1rem' }}
            />
            <Menu.Item
                key="0"
                icon={
                    <TagOutlined
                        style={{
                            fontSize: '18px',
                            marginLeft: '2rem',
                        }}
                        rotate={45}
                    />
                }
                onClick={() => setVisible(true)}
            >
                <span className="menu-item--highlight">
                    Quản lý thẻ phân loại
                </span>
            </Menu.Item>

            <ModalClassify
                isVisible={visible}
                onCancel={() => setVisible(false)}
                onOpen={() => setVisible(true)}
            />
        </SubMenu>
    );
}

export default SubMenuClassify;
