import React from 'react';
import PropTypes from 'prop-types';
import { GiftOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import ListSticker from '../ListSticker';
import './style.scss';

Sticker.propTypes = {
    data: PropTypes.array,
    onClose: PropTypes.func,
    onScroll: PropTypes.func,
};

Sticker.defaultProps = {
    data: [],
    onClose: null,
    onScroll: null,
};

function Sticker({ data, onClose, onScroll }) {
    const { TabPane } = Tabs;

    const handleOnClose = () => {
        if (onClose) {
            onClose();
        }
    };
    return (
        <div id="sticker">
            <Tabs defaultActiveKey="1">
                <TabPane
                    tab={
                        <span className="menu-item">
                            <GiftOutlined /> STICKER
                        </span>
                    }
                    key="1"
                >
                    <ListSticker
                        data={data}
                        onClose={handleOnClose}
                        onScroll={onScroll}
                    />
                </TabPane>
            </Tabs>
        </div>
    );
}

export default Sticker;
