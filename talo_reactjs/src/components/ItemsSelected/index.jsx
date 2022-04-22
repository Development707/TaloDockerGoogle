import React from 'react';
import PropTypes from 'prop-types';
import PersonalIcon from 'features/Chat/components/PersonalIcon';
import { CloseCircleFilled, UsergroupAddOutlined } from '@ant-design/icons';
import { Avatar, Tooltip } from 'antd';
import './style.scss';

ItemsSelected.propTypes = {
    items: PropTypes.array,
    onRemove: PropTypes.func,
};

ItemsSelected.defaultProps = {
    items: [],
    onRemove: null,
};

function ItemsSelected({ items, onRemove }) {
    const handleRemoveSelect = (id) => {
        if (onRemove) {
            // console.log('onremove', id);
            onRemove(id);
        }
    };
    // console.log('itemsselect', items);
    return (
        <>
            {items &&
                items.length > 0 &&
                items.map((item, index) => (
                    <div className="item-selected_wrapper">
                        <div className="item-selected--text" key={index}>
                            <div className="item-selected-avatar">
                                {!item.type && (
                                    <PersonalIcon
                                        demention={20}
                                        avatar={item.avatar.url}
                                        name={item.name}
                                    />
                                )}

                                {item.type &&
                                    typeof item.avatar.url === 'string' && (
                                        <PersonalIcon
                                            demention={20}
                                            avatar={item.avatar.url}
                                            name={item.name}
                                        />
                                    )}

                                {item.type && typeof item.avatar === 'object' && (
                                    <Tooltip>
                                        <Avatar
                                            style={{
                                                backgroundColor: '#f56a00',
                                            }}
                                            icon={<UsergroupAddOutlined />}
                                            size={20}
                                        />
                                    </Tooltip>
                                )}
                            </div>

                            <div className="item-selected-name">
                                <span>{item.name}</span>
                            </div>
                        </div>

                        <div
                            className="item-selected-remove"
                            onClick={() => handleRemoveSelect(item.id)}
                        >
                            <CloseCircleFilled />
                        </div>
                    </div>
                ))}
        </>
    );
}

export default ItemsSelected;
