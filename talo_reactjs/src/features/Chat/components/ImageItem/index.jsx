import React from 'react';
import PropTypes from 'prop-types';
import { fallback } from 'assets/images/fallbackImage';
import { Image } from 'antd';
import OverlayImage from '../OverlayImage';
import './style.scss';

ImageItem.propTypes = {
    url: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number,
    type: PropTypes.string,
    onVisibleVideoModal: PropTypes.func,
};

ImageItem.defaultProps = {
    url: 'https://cdn.presslabs.com/wp-content/uploads/2018/10/upload-error.png',
    height: 110,
    width: 110,
    type: 'IMAGE',
    onVisibleVideoModal: null,
};

function ImageItem(props) {
    const { url, height, width, type, onVisibleVideoModal } = props;

    const dementionStyle = {
        width: width,
        height: height,
    };

    const handleOnClick = () => {
        if (type === 'video' && onVisibleVideoModal) {
            onVisibleVideoModal(url);
        }
    };
    return (
        <div className="item-img-wrapper" onClick={handleOnClick}>
            <div id="item-img" style={dementionStyle}>
                <Image
                    src={url}
                    fallback={fallback}
                    width={width}
                    height={height}
                    preview={{ mask: <OverlayImage /> }}
                />
            </div>
        </div>
    );
}

export default ImageItem;
