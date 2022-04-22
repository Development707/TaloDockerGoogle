import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Drawer } from 'antd';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import SummedPinMessage from '../SummedPinMessage';
import './style.scss';
import DrawerPinMessageStyle from './DrawerPinMessageStyle';

DrawerPinMessage.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    message: PropTypes.array,
};

DrawerPinMessage.defaultProps = {
    onOpen: null,
    onClose: null,
    message: [],
};

function DrawerPinMessage({ isOpen, onClose, message }) {
    const handleOnCloseDrawer = () => {
        if (onClose) {
            onClose();
        }
    };

    const handlViewNews = () => {
        if (onClose) {
            onClose();
        }
    };

    return (
        <div id="drawer-pin">
            <div id="drawer-container">
                <Drawer
                    visible={isOpen}
                    onClose={handleOnCloseDrawer}
                    getContainer={false}
                    placement="top"
                    style={{ position: 'absolute', overflow: 'hidden' }}
                    closable={false}
                    bodyStyle={DrawerPinMessageStyle.WRAPPER_STYLE}
                >
                    <div className="drawer-header">
                        <div className="drawer-header-title">
                            {`Danh sách ghim (${message.length})`}
                        </div>

                        <div
                            className="drawer-header-collapse"
                            onClick={handleOnCloseDrawer}
                        >
                            Thu gọn <CaretUpOutlined />
                        </div>
                    </div>

                    <div className="drawer-body">
                        {message.map((mes, index) => (
                            <SummedPinMessage
                                key={index}
                                message={mes}
                                isItem={true}
                            />
                        ))}
                    </div>

                    <div className="drawer-footer" onClick={handlViewNews}>
                        <CaretDownOutlined rotate={180} />
                    </div>
                </Drawer>
            </div>
        </div>
    );
}

export default DrawerPinMessage;
