import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';
import { Image } from 'antd';
import { fallback } from 'assets/images/fallbackImage';
import MESSAGE_STYLE from 'constants/messageStyle';
import OverlayImage from '../../OverlayImage';

ImageMessage.propTypes = {
    content: PropTypes.string,
    dateAt: PropTypes.object,
    isSeen: PropTypes.bool,
};

ImageMessage.defaultProps = {
    content: '',
    dateAt: null,
    isSeen: false,
};

function ImageMessage({ content, children, dateAt, isSeen }) {
    return (
        <>
            <div className="message-image-wrapper">
                <div className="message-image--main">
                    <Image
                        src={content}
                        fallback={fallback}
                        style={MESSAGE_STYLE.imageStyle}
                        preview={{ mask: <OverlayImage /> }}
                    />
                </div>

                {children}
            </div>

            <div className="time-and-last_view">
                <div className="time-send">
                    <span>
                        {`0${dateAt.getHours()}`.slice(-2)}:
                        {`0${dateAt.getMinutes()}`.slice(-2)}
                    </span>
                </div>

                {isSeen && <div className="is-seen-message">Đã xem</div>}
            </div>
        </>
    );
}

export default ImageMessage;
