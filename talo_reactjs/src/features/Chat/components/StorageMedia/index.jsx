import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CaretDownOutlined } from '@ant-design/icons';
import ThumbnailVideoCustom from '../ThumbnailVideoCustom';
import { Image } from 'antd';
import ImageItem from '../ImageItem';
import ModalVideoCustom from 'components/ModalVideoCustom';
import './style.scss';

StorageMedia.propTypes = {
    viewMediaClick: PropTypes.func,
    name: PropTypes.string,
    items: PropTypes.array,
};

StorageMedia.defaultProps = {
    viewMediaClick: null,
    name: '',
    items: [],
};
const styleIconDrop = {
    transform: 'rotate(-90deg)',
};
const styleInteract = {
    maxHeight: '0px',
};

function StorageMedia({ viewMediaClick, name, items }) {
    const [isDrop, setIsDrop] = useState(true);

    const [visible, setVisible] = useState(false);
    const [currentVideo, setCurrentVideo] = useState('');

    const handleOnClick = () => {
        setIsDrop(!isDrop);
    };
    const handleVisibleModal = (url) => {
        setVisible(true);
        setCurrentVideo(url);
    };
    const handleViewAllOnClick = () => {
        if (viewMediaClick) {
            if (name === 'Ảnh') {
                viewMediaClick(2, 1);
            } else if (name === 'Video') {
                viewMediaClick(2, 2);
            }
        }
    };
    const handleOnClose = () => {
        setVisible(false);
        setCurrentVideo('');
    };
    return (
        <div className="info_media">
            <div className="info_media-header" onClick={handleOnClick}>
                <div className="info_media-header-title">{name}</div>
                <div
                    className="info_media-header-icon"
                    style={isDrop ? {} : styleIconDrop}
                >
                    <CaretDownOutlined />
                </div>
            </div>

            <div
                className="info_media-interact"
                style={isDrop ? {} : styleInteract}
            >
                {items.length > 0 ? (
                    <>
                        <div className="info_media-interact-media">
                            {name === 'Video' ? (
                                <>
                                    {items.map((item, index) => {
                                        if (index < 8) {
                                            return (
                                                <ThumbnailVideoCustom
                                                    key={index}
                                                    url={item.content}
                                                    onVisibleVideoModal={
                                                        handleVisibleModal
                                                    }
                                                />
                                            );
                                        }
                                    })}
                                </>
                            ) : (
                                <Image.PreviewGroup>
                                    {items.map((item, index) => {
                                        if (index < 8) {
                                            return (
                                                <ImageItem
                                                    key={index}
                                                    width={80}
                                                    height={80}
                                                    url={item.content}
                                                    type={
                                                        name === 'Video'
                                                            ? name.toLowerCase()
                                                            : 'image'
                                                    }
                                                    onVisibleVideoModal={
                                                        handleVisibleModal
                                                    }
                                                />
                                            );
                                        }
                                    })}
                                </Image.PreviewGroup>
                            )}
                        </div>
                        <div className="info_media-interact-button">
                            <button onClick={handleViewAllOnClick}>
                                Xem tất cả
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {name === 'Video' ? (
                            <div className="info_media-interact-empty">
                                Chưa có video được chia sẻ trong hội thoại này
                            </div>
                        ) : (
                            <div className="info_media-interact-empty">
                                Chưa có hình ảnh được chia sẻ trong hội thoại
                                này
                            </div>
                        )}
                    </>
                )}
            </div>

            <ModalVideoCustom
                isVisible={visible}
                url={currentVideo}
                onClose={handleOnClose}
            />
        </div>
    );
}

export default StorageMedia;
