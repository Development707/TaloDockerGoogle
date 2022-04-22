import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { EditOutlined } from '@ant-design/icons';
import './style.scss';

UploadConverPhoto.propTypes = {
    coverPhoto: PropTypes.string,
    getFile: PropTypes.func,
    isClear: PropTypes.bool,
};
UploadConverPhoto.defaultProps = {
    coverPhoto: '',
    getFile: null,
    isClear: false,
};
function UploadConverPhoto({ coverPhoto, getFile, isClear }) {
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        if (isClear) {
            setImagePreview('');
        }
    }, [isClear]);

    const handleOnChange = (e) => {
        const files = e.target.files;
        const filePhoto = files[0];
        const reader = new FileReader();
        if (filePhoto && filePhoto.type.match('image.*')) {
            reader.readAsDataURL(filePhoto);
            reader.onloadend = function (e) {
                setImagePreview(reader.result);
            };

            if (getFile) {
                getFile(filePhoto);
            }
        }
    };
    return (
        <div className="upload-cover-wrapper">
            <div className="upload-cover_photo">
                {coverPhoto || imagePreview ? (
                    <img
                        src={imagePreview ? imagePreview : coverPhoto}
                        alt=""
                    />
                ) : (
                    <label
                        className="upload-cover_text-select"
                        htmlFor="upload-cover_custom"
                    >
                        Chọn hình ảnh
                    </label>
                )}
            </div>

            <div className="upload-cover_icon">
                <label htmlFor="upload-cover_custom">
                    <EditOutlined style={{ fontSize: '13px' }} />
                </label>
                <input
                    id="upload-cover_custom"
                    type="file"
                    hidden
                    onChange={handleOnChange}
                    accept="image/*"
                />
            </div>
        </div>
    );
}

export default UploadConverPhoto;
