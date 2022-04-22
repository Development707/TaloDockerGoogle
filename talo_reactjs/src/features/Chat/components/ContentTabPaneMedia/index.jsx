import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ThumbnailVideoCustom from '../ThumbnailVideoCustom';
import { Image } from 'antd';
import ImageItem from '../ImageItem';
import ModalVideoCustom from 'components/ModalVideoCustom';
import './style.scss';

ContentTabPaneMedia.propTypes = {
    items: PropTypes.array,
    type: PropTypes.string,
};

ContentTabPaneMedia.defaultProps = {
    items: [],
    type: 'image',
};

function ContentTabPaneMedia(props) {
    const { items, type } = props;

    const [visible, setVisible] = useState(false);
    const [currentVideo, setCurrentVideo] = useState('');

    const handleOnClose = () => {
        setVisible(false);
        setCurrentVideo('');
    };

    const handleVisibleModal = (url) => {
        setVisible(true);
        setCurrentVideo(url);
    };
    return (
        <div id="content-tabpane-media-wrapper">
            <div className="item-in-storage-media">
                <div className="list-item-sent">
                    {type === 'video' ? (
                        <>
                            {items.map((ele, index) => (
                                <ThumbnailVideoCustom
                                    key={index}
                                    url={ele.content}
                                    onVisibleVideoModal={handleVisibleModal}
                                    height={110}
                                    width={110}
                                />
                            ))}
                        </>
                    ) : (
                        <Image.PreviewGroup>
                            {items.map((itemEle, index) => (
                                <ImageItem
                                    key={index}
                                    url={itemEle.content}
                                    type={type}
                                    onVisibleVideoModal={handleVisibleModal}
                                />
                            ))}
                        </Image.PreviewGroup>
                    )}
                </div>
            </div>

            <ModalVideoCustom
                isVisible={visible}
                url={currentVideo}
                onClose={handleOnClose}
            />
        </div>
    );
}

export default ContentTabPaneMedia;
