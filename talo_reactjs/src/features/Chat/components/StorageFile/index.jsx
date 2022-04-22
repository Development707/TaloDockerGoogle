import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CaretDownOutlined } from '@ant-design/icons';
import FileItem from 'components/FileItem';
import './style.scss';
StorageFile.propTypes = {
    viewMediaClick: PropTypes.func,
    items: PropTypes.array,
};

StorageFile.defaultProps = {
    viewMediaClick: null,
    items: [],
};
const styleIconDrop = {
    transform: 'rotate(-90deg)',
};

const styleInteract = {
    maxHeight: '0px',
};
function StorageFile({ viewMediaClick, items }) {
    const [isDrop, setIsDrop] = useState(false);

    const handleOnClick = () => {
        setIsDrop(!isDrop);
    };
    const handleViewAllOnClick = () => {
        if (viewMediaClick) {
            viewMediaClick(2, 3);
        }
    };
    return (
        <div className="info_file">
            <div className="info_file-header" onClick={handleOnClick}>
                <div className="info_file-header-title">File</div>
                <div
                    className="info_file-header-icon"
                    style={isDrop ? {} : styleIconDrop}
                >
                    <CaretDownOutlined />
                </div>
            </div>

            <div
                className="info_file-interact"
                style={isDrop ? {} : styleInteract}
            >
                {items.length > 0 ? (
                    <>
                        <div className="info_file-interact-file">
                            {items.map((item, index) => {
                                if (index < 3) {
                                    return <FileItem key={index} file={item} />;
                                }
                            })}
                        </div>
                        <div className="info_file-interact-button">
                            <button onClick={handleViewAllOnClick}>
                                Xem Tất cả
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="info_file-interact-empty">
                        Chưa có file được chia sẻ trong cuộc hội thoại này
                    </div>
                )}
            </div>
        </div>
    );
}

export default StorageFile;
