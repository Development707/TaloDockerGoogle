import React from 'react';
import './style.scss';

const OverlayImage = (props) => {
    return <div className="overlay-item">{props.children}</div>;
};

export default OverlayImage;
