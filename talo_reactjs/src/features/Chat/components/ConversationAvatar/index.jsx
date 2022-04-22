import { Avatar, Tooltip } from 'antd';
import DEFAULT_AVATAR from 'assets/images/user/talo_user_default.jpg';
import AvatarCustom from 'components/AvatarCustom';
import PropTypes from 'prop-types';
import COVERSATION_STYLE from './ConversationAvatarStyle';
import './style.scss';
ConversationAvatar.propTypes = {
    demension: PropTypes.number,
    isGroupCard: PropTypes.bool,
    totalMembers: PropTypes.number.isRequired,
    members: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    avatar: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    isActived: PropTypes.bool,
    sizeAvatar: PropTypes.number,
    frameSize: PropTypes.number,
};

ConversationAvatar.defaultProps = {
    demension: 28,
    isGroupCard: false,
    isActived: false,
    avatar: '',
    sizeAvatar: 48,
    frameSize: 48,
};

function ConversationAvatar({
    avatar,
    demension,
    isGroupCard,
    totalMembers,
    members,
    type,
    name,
    isActived,
    sizeAvatar,
    frameSize,
}) {
    const renderAvatar = () => {
        let tempAvatar = [];
        for (let index = 0; index < totalMembers; index++) {
            if (members[index]?.avatar?.url) {
                tempAvatar.push(
                    <Avatar
                        key={index}
                        style={
                            totalMembers === 3 && index === 2
                                ? COVERSATION_STYLE.styleGroup3(demension)
                                : {}
                        }
                        size={demension}
                        src={members[index]?.avatar?.url}
                    />
                );
            } else {
                tempAvatar.push(
                    <AvatarCustom
                        key={index}
                        name={members[index]?.name}
                        avatar={members[index]?.avatar?.url}
                        size={demension}
                        style={
                            totalMembers === 3 && index === 2
                                ? {
                                      ...COVERSATION_STYLE.styleGroup3(
                                          demension
                                      ),
                                      backgroundColor: '#1E90FF',
                                  }
                                : {
                                      backgroundColor: '#1E90FF',
                                  }
                        }
                    />
                );
            }
        }
        return tempAvatar;
    };

    const renderGroupManyUser = () => {
        let tempAvatar = [];
        for (let index = 0; index < 4; index++) {
            if (index < 3) {
                if (members[index]?.avatar?.url) {
                    tempAvatar.push(
                        <div className="per-user">
                            <Avatar
                                size={demension}
                                src={members[index]?.avatar?.url}
                                style={
                                    index === 2
                                        ? { marginTop: (demension / 6) * -1 }
                                        : {}
                                }
                            />
                        </div>
                    );
                } else {
                    tempAvatar.push(
                        <div className="per-user">
                            <AvatarCustom
                                key={index}
                                name={members[index]?.name}
                                avatar={members[index]?.avatar?.url}
                                size={demension}
                                style={
                                    index === 2
                                        ? {
                                              marginTop: (demension / 6) * -1,
                                              backgroundColor: '#1E90FF',
                                          }
                                        : {
                                              backgroundColor: '#1E90FF',
                                          }
                                }
                            />
                        </div>
                    );
                }
            } else {
                tempAvatar.push(
                    <div className="per-user">
                        <Tooltip placement="top">
                            <Avatar
                                style={{
                                    backgroundColor: '#7562d8',
                                    color: '#fff',
                                    marginTop: (demension / 6) * -1,
                                }}
                                size={demension}
                            >
                                +{totalMembers - 3}
                            </Avatar>
                        </Tooltip>
                    </div>
                );
            }
        }
        return tempAvatar;
    };

    return (
        <div className="avatar_conversation">
            {avatar !== '' ? (
                <AvatarCustom size={frameSize} src={avatar} name={name} />
            ) : type === 'DUAL' ? (
                <AvatarCustom size={sizeAvatar} src={avatar} name={name} />
            ) : (
                <>
                    {totalMembers === 3 ? (
                        <div className="conversation-item_box">
                            <div className="left-side-box">
                                <div
                                    style={
                                        (isGroupCard
                                            ? COVERSATION_STYLE.friendCardAvatar(
                                                  demension
                                              )
                                            : {},
                                        {
                                            width: `${frameSize}px`,
                                            height: `${frameSize}px`,
                                        })
                                    }
                                    className="icon-users-group"
                                >
                                    <Avatar.Group
                                        maxCount={3}
                                        maxPopoverPlacement={false}
                                    >
                                        {renderAvatar()}
                                    </Avatar.Group>
                                </div>
                            </div>
                        </div>
                    ) : totalMembers === 2 ? (
                        <div className="conversation-item_box">
                            <div className="left-side-box">
                                <div
                                    className="icon-users-group"
                                    style={
                                        (isGroupCard
                                            ? COVERSATION_STYLE.friendCardAvatarMixStyle2(
                                                  demension
                                              )
                                            : COVERSATION_STYLE.styleGroup2,
                                        {
                                            width: `${frameSize}px`,
                                            height: `${frameSize}px`,
                                        })
                                    }
                                >
                                    <Avatar.Group
                                        maxCount={3}
                                        maxPopoverPlacement="none"
                                    >
                                        {renderAvatar()}
                                    </Avatar.Group>
                                </div>
                            </div>
                        </div>
                    ) : totalMembers > 3 ? (
                        <div className="conversation-item_box">
                            <div className="left-side-box">
                                <div
                                    className="icon-users-group"
                                    style={
                                        (isGroupCard
                                            ? COVERSATION_STYLE.friendCardAvatar(
                                                  demension
                                              )
                                            : {},
                                        {
                                            width: `${frameSize}px`,
                                            height: `${frameSize}px`,
                                        })
                                    }
                                >
                                    <div id="group-many-user">
                                        {renderGroupManyUser()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <Avatar
                                size={sizeAvatar}
                                src={avatar ? avatar : DEFAULT_AVATAR}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ConversationAvatar;
