import React from 'react';

import PropTypes from 'prop-types';
import './style.scss';
import { PlayCircleFilled } from '@ant-design/icons';

ThumbnailVideoCustom.propTypes = {
    url: PropTypes.string.isRequired,
    onVisibleVideoModal: PropTypes.func,
    height: PropTypes.number,
    width: PropTypes.number,
};

ThumbnailVideoCustom.defaultProps = {
    url: PropTypes.string.isRequired,
    onVisibleVideoModal: null,
    height: 80,
    width: 80,
};
function ThumbnailVideoCustom({ url, onVisibleVideoModal, height, width }) {
    const handlePlayVideo = () => {
        if (onVisibleVideoModal) {
            onVisibleVideoModal(url);
        }
    };
    return (
        <div
            className="thumbnail-video_custom"
            onClick={handlePlayVideo}
            style={{ height: `${height}px`, width: `${width}px` }}
        >
            <video>
                <source
                    height={height}
                    width={width}
                    src={url}
                    type="video/mp4"
                />
            </video>

            <div className="overlay">
                <PlayCircleFilled />
            </div>
        </div>
    );
}

export default ThumbnailVideoCustom;
