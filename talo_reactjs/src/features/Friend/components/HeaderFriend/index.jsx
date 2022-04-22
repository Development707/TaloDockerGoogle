import React from 'react';
import PropTypes from 'prop-types';
import ICON_FRIEND from 'assets/images/icon/icon_friend.png';
import ICON_GROUP from 'assets/images/icon/icon_group.png';
import { LeftOutlined } from '@ant-design/icons';
import './style.scss';
HeaderFriend.propTypes = {
    subtab: PropTypes.number,
    onBack: PropTypes.func,
};

HeaderFriend.defaultProps = {
    subtab: 0,
    onBack: null,
};

function HeaderFriend({ subtab, onBack }) {
    const handleOnClick = () => {
        if (onBack) {
            onBack();
        }
    };

    return (
        <div id="header_friend">
            <div className="header-icon back-list" onClick={handleOnClick}>
                <LeftOutlined />
            </div>
            <div className="header_friend__img">
                {subtab === 0 && <img src={ICON_FRIEND} alt="thumbnail" />}

                {subtab === 1 && <img src={ICON_GROUP} alt="thumbnail" />}
            </div>

            <div className="header_friend__text">
                {subtab === 0 && 'Danh sách kết bạn'}
                {subtab === 1 && 'Danh sách nhóm'}
            </div>
        </div>
    );
}

export default HeaderFriend;
