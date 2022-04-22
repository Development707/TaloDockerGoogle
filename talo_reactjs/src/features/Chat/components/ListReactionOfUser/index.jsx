import React from 'react';
import PropTypes from 'prop-types';
ListReactionOfUser.propTypes = {
    isMyMessage: PropTypes.bool.isRequired,
    listReactionCurrent: PropTypes.array,
    reacts: PropTypes.array,
    onTransferIcon: PropTypes.func,
};

ListReactionOfUser.defaultProps = {
    isMyMessage: PropTypes.bool,
    listReactionCurrent: [],
    reacts: [],
    onTransferIcon: null,
};

function ListReactionOfUser(props) {
    const { isMyMessage, listReactionCurrent, reacts, onTransferIcon } = props;
    return (
        <div className={`list-user-react ${isMyMessage ? 'bg-white' : ''}`}>
            <div className="list-user-react-icon">
                <div>
                    {listReactionCurrent.map((item, index) => (
                        <span key={index}>{onTransferIcon(item)}</span>
                    ))}

                    <span className="count-reated">
                        {reacts && reacts.length > 0 && reacts.length}
                    </span>
                </div>

                {reacts && reacts.length > 0 && (
                    <div className="list-user-detail">
                        {reacts.map((item, index) => {
                            if (index < 5) {
                                return (
                                    <span key={index}>{item.userId.name}</span>
                                );
                            } else {
                                return (
                                    <span>{`và ${
                                        reacts.length - 5
                                    } người khác`}</span>
                                );
                            }
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ListReactionOfUser;
