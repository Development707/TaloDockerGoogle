import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

SliderItem.propTypes = {
    image: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
};

SliderItem.defaultProps = {
    image: '',
    title: '',
    description: '',
};

function SliderItem({ image, title, description }) {
    return (
        <div className="carousel-slider--item">
            <div className="slider-img">
                <img src={image} alt="" />
            </div>
            <div className="slider-content">
                <div className="slider-content--title">
                    <span>{title}</span>
                </div>

                <div className="slider-content--description">
                    <span>{description}</span>
                </div>
            </div>
        </div>
    );
}

export default SliderItem;
