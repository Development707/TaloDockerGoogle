import FileItem from 'components/FileItem';
import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

ContentTabPaneFile.propTypes = {
    items: PropTypes.array,
};

ContentTabPaneFile.defaultProps = {
    items: [],
};

function ContentTabPaneFile({ items }) {
    return (
        <div id="content-tabpane-file">
            {items.map((item, index) => (
                <FileItem key={index} file={item} inArchive={true} />
            ))}
        </div>
    );
}

export default ContentTabPaneFile;
