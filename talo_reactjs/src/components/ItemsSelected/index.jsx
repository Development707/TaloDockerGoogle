import { CloseCircleFilled } from '@ant-design/icons';
import PersonalIcon from 'features/Chat/components/PersonalIcon';
import PropTypes from 'prop-types';
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
            onRemove(id);
        }
    };

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
