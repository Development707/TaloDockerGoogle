import React from 'react';
import PropTypes from 'prop-types';
import PersonalIcon from 'features/Chat/components/PersonalIcon';
import './style.scss';

SuggestCard.propTypes = {
    suggestFriend: PropTypes.object,
    onClick: PropTypes.func,
};

SuggestCard.defaultProps = {
    suggestFriend: {},
    onClick: null,
};

function SuggestCard({ suggestFriend, onClick }) {
    const handleOnClick = () => {
        if (onClick) {
            onClick(suggestFriend);
        }
    };

    return (
        <div className="suggest_card" onClick={handleOnClick}>
            <div className="suggest_card-img">
                <PersonalIcon
                    avatar={suggestFriend.avatar?.url}
                    name={suggestFriend.name}
                    demention={90}
                />
            </div>
            <div className="suggest_card-info">
                <strong className="suggest_card-info--name">
                    {suggestFriend.name}
                </strong>
                <span className="suggest_card-info--common">
                    {`${suggestFriend.numberMutualGroup} nhóm chung`}
                </span>
                <span className="suggest_card-info--common">
                    {`${suggestFriend.numberMutualFriend} bạn chung`}
                </span>
            </div>
        </div>
    );
}

export default SuggestCard;
