import React from 'react';
import PropTypes from 'prop-types';
import fileHelpers from 'utils/fileHelpers';
import { defaultStyles, FileIcon } from 'react-file-icon';
import { CloudDownloadOutlined } from '@ant-design/icons';
import './style.scss';

FileItem.propTypes = {
    file: PropTypes.object.isRequired,
};

function FileItem({ file }) {
    const fileName = fileHelpers.getFileName(file.content);
    const fileExtension = fileHelpers.getFileExtension(fileName);

    const handleOnClickDownLoad = () => {
        window.open(file.content, '_blank');
    };

    return (
        <div className="item-file">
            <div className="item-file--icon">
                <FileIcon
                    extension={fileExtension}
                    {...defaultStyles[fileExtension]}
                />
            </div>
            <div className="item-file--name">{fileName}</div>

            <div className="item-file--interact">
                <div
                    className="item-file_button"
                    onClick={handleOnClickDownLoad}
                >
                    <CloudDownloadOutlined />
                </div>
            </div>
        </div>
    );
}

export default FileItem;
