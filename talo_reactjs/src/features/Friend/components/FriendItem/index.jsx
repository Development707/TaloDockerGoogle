import { MoreOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import PersonalIcon from 'features/Chat/components/PersonalIcon';
import PropTypes from 'prop-types';
import dateUtils from 'utils/dateUtils';
import './style.scss';

FriendItem.propTypes = {
    data: PropTypes.object.isRequired,
    onClickMenu: PropTypes.func,
};

FriendItem.defaultProps = {
    onClickMenu: null,
};

function FriendItem({ data, onClickMenu }) {
    const handleClickMenu = ({ key }) => {
        if (onClickMenu) {
            onClickMenu(key, data.id);
        }
    };

    const menu = (
        <Menu onClick={handleClickMenu}>
            <Menu.Item key="1">
                <span className="menu-item--highlight">Xem thông tin</span>
            </Menu.Item>
            <Menu.Item key="2" danger>
                <span className="menu-item--highlight">Xóa bạn</span>
            </Menu.Item>
        </Menu>
    );

    return (
        <Dropdown overlay={menu} trigger={['contextMenu']}>
            <div id="friend-item">
                <div className="friend-item_left">
                    <div className="friend-item-avatar">
                        <PersonalIcon
                            isActive={data.isOnline}
                            avatar={data.avatar.url}
                            name={data.name}
                        />
                    </div>

                    <div className="friend-item-name">
                        {data.name}
                        {data.lastLogin && (
                            <div className="recent-login">
                                {`Truy cập ${dateUtils.toTime(
                                    data.lastLogin
                                )} trước`}
                            </div>
                        )}
                    </div>
                </div>
                <div className="friend-item_right">
                    <div className="friend-item-interact">
                        <Dropdown overlay={menu} trigger={['click']}>
                            <Button
                                type="text"
                                icon={
                                    <MoreOutlined
                                        rotate={90}
                                        style={{ fontSize: '20px' }}
                                    />
                                }
                                style={{ background: 'eeeff2' }}
                            />
                        </Dropdown>
                    </div>
                </div>
            </div>
        </Dropdown>
    );
}

export default FriendItem;
