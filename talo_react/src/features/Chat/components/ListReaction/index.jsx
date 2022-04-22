import React from 'react';
import PropTypes from 'prop-types';
import { LikeOutlined } from '@ant-design/icons';

import './style.scss';

ListReaction.propTypes = {
    type: PropTypes.string,
    isMyMessage: PropTypes.bool.isRequired,
    listReaction: PropTypes.array,
    onClickLike: PropTypes.func,
    onClickReaction: PropTypes.func,
    isLikeButton: PropTypes.bool,
};

ListReaction.defaultProps = {
    type: '',
    onClick: null,
    listReaction: [],
    onClickLike: null,
    onClickReaction: null,
    isLikeButton: true,
};

function ListReaction(props) {
    const {
        type,
        isMyMessage,
        listReaction,
        onClickLike,
        onClickReaction,
        isLikeButton,
    } = props;

    const handleOnClickLike = () => {
        if (onClickLike) {
            onClickLike();
        }
    };

    const handleClickReaction = (item) => {
        onClickReaction(item);
    };

    return (
        <>
            {isLikeButton ? (
                <div
                    className={`reaction ${
                        isMyMessage ? 'left' : 'right'
                    } ${type}`}
                >
                    {
                        <div className="reaction-thumbnail">
                            <div onClick={handleOnClickLike}>
                                <LikeOutlined />
                            </div>

                            <div className="list_icon-reaction">
                                {listReaction.map((item, index) => (
                                    <span
                                        key={index}
                                        onClick={() =>
                                            handleClickReaction(item)
                                        }
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    }
                </div>
            ) : (
                <div className="list_icon_reaction">
                    {listReaction.map((item, index) => (
                        <span
                            key={index}
                            onClick={() => handleClickReaction(item)}
                        >
                            {item}
                        </span>
                    ))}
                </div>
            )}
        </>
    );
}

export default ListReaction;
