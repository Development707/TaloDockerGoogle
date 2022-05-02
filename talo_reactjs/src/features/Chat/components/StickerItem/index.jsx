import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import './style.scss';
import messageApi from 'api/messageApi';

StickerItem.propTypes = {
    data: PropTypes.object,
    onClose: PropTypes.func,
    onScroll: PropTypes.func,
};

StickerItem.defaultProps = {
    data: {},
    onClose: null,
    onScroll: null,
};

function StickerItem({ data, onClose, onScroll }) {
    const { currentConversation, currentChannel } = useSelector(
        (state) => state.chat
    );
    const handleSelectSticker = async (value) => {
        if (onClose) {
            onClose();
        }
        const newMessage = {
            content: value.url,
            type: 'STICKER',
        };

        if (currentChannel) {
            newMessage.channelId = currentChannel;
        }

        await messageApi
            .sendTextMessage(currentConversation, newMessage)
            .then((res) => {
                const { id } = res;
                if (onScroll) {
                    onScroll(id);
                }
            })
            .catch((err) => console.log('Send Message Fail'));
    };

    return (
        <div className="sticker-item">
            <div className="sticker-item_name">{data.name}</div>

            <div className="sticker-item_list-sticker">
                {data.emojis.map((ele, index) => (
                    <div
                        className="sticker-item_img"
                        key={index}
                        onClick={() => handleSelectSticker(ele)}
                    >
                        <img src={ele.url} alt={`${data.name} ${index}`} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StickerItem;
