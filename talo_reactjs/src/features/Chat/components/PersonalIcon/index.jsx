import { KeyOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import getSummaryName from 'utils/nameHelper';
import './style.scss';

PersonalIcon.propTypes = {
    avatar: PropTypes.string,
    isActive: PropTypes.bool,
    demention: PropTypes.number,
    common: PropTypes.bool,
    isHost: PropTypes.bool,
    isManager: PropTypes.bool,
    name: PropTypes.string,
    color: PropTypes.string,
    noneUser: PropTypes.bool,
};

PersonalIcon.defaultProps = {
    avatar: '',
    isActive: false,
    demention: 48,
    common: true,
    isHost: false,
    isManager: false,
    name: '',
    color: '',
    noneUser: false,
};

function PersonalIcon(props) {
    const {
        avatar,
        isActive,
        demention,
        common,
        isHost,
        isManager,
        name,
        color,
        noneUser,
    } = props;
    return (
        <div
            className={
                isActive && common
                    ? 'user-icon common'
                    : !isActive && common
                    ? 'user-icon no-online common'
                    : isActive && !common
                    ? 'user-icon'
                    : 'user-icon no-online'
            }
        >
            <Badge
                dot={isActive}
                offset={!isHost && !isManager ? [-5, 40] : [-8, 34]}
                color="green"
                count={
                    isHost ? (
                        <KeyOutlined
                            rotate="180"
                            style={{
                                backgroundColor: 'rgba(0,0,0,0.6)',
                                padding: '0.24rem',
                                borderRadius: '50%',
                                color: 'yellow',
                                fontSize: '1.3rem',
                            }}
                        />
                    ) : isManager ? (
                        <KeyOutlined
                            rotate="180"
                            style={{
                                backgroundColor: 'rgba(0,0,0,0.6)',
                                padding: '0.24rem',
                                borderRadius: '50%',
                                color: 'silver',
                                fontSize: '1.3rem',
                            }}
                        />
                    ) : (
                        ''
                    )
                }
            >
                {noneUser ? (
                    <Avatar
                        style={{
                            backgroundColor: '#87d068',
                        }}
                        size={demention}
                        icon={<UserOutlined />}
                    />
                ) : avatar ? (
                    <Avatar size={demention} src={avatar} />
                ) : (
                    <Avatar
                        size={demention}
                        style={{ backgroundColor: color ? color : '#1E90FF' }}
                    >
                        {getSummaryName(name)}
                    </Avatar>
                )}
            </Badge>
        </div>
    );
}

export default PersonalIcon;
