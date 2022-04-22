import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
    EditOutlined,
    FileImageOutlined,
    FileOutlined,
    KeyOutlined,
    NumberOutlined,
    PlaySquareOutlined,
    PushpinOutlined,
    SmileOutlined,
    UserAddOutlined,
    UserDeleteOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { FcBarChart } from 'react-icons/fc';

ShortMessage.propTypes = {
    message: PropTypes.object,
    type: PropTypes.string,
};

ShortMessage.defaultProps = {
    message: {},
    type: '',
};

function ShortMessage({ message, type }) {
    const { user } = useSelector((state) => state.global);
    const { content, isDeleted } = message;

    const renderName = () => {
        if (type) {
            if (message.user.id === user.id) {
                return 'Bạn: ';
            } else {
                return message.user.name + ': ';
            }
        } else {
            if (message.user.id === user.id) {
                return 'Bạn: ';
            } else {
                return '';
            }
        }
    };

    return (
        <>
            {isDeleted ? (
                <span>{renderName()} đã thu hồi một tin nhắn</span>
            ) : (
                <>
                    {message.type === 'TEXT' && (
                        <span>
                            {renderName()}
                            {content}
                        </span>
                    )}
                    {message.type === 'IMAGE' && (
                        <span>
                            {renderName()}
                            <FileImageOutlined />
                            &nbsp;đã gửi một hình ảnh
                        </span>
                    )}

                    {message.type === 'HTML' && (
                        <span>{renderName()}đã gửi một văn bản</span>
                    )}

                    {message.type === 'VIDEO' && (
                        <span>
                            {renderName()}
                            <PlaySquareOutlined />
                            &nbsp;đã gửi một video
                        </span>
                    )}

                    {message.type === 'FILE' && (
                        <span>
                            {renderName()}
                            <FileOutlined />
                            &nbsp;đã gửi một tệp
                        </span>
                    )}

                    {message.type === 'NOTIFY' &&
                        message.content === 'Đã thêm vào nhóm' && (
                            <span>
                                {renderName()}
                                <UserAddOutlined />
                                &nbsp;đã thêm thành viên vào nhóm
                            </span>
                        )}

                    {message.type === 'NOTIFY' &&
                        message.content ===
                            'Đã xóa thành viên ra khỏi nhóm' && (
                            <span>
                                {renderName()}
                                <UserDeleteOutlined />
                                &nbsp;đã xóa thành viên ra khỏi nhóm
                            </span>
                        )}

                    {message.type === 'NOTIFY' &&
                        message.content === 'Đã rời khỏi nhóm' && (
                            <span>{renderName()}đã rời khỏi nhóm</span>
                        )}

                    {message.type === 'NOTIFY' &&
                        message.content.startsWith(
                            'Đã đổi tên nhóm thành: '
                        ) && (
                            <span>
                                {renderName()}
                                <EditOutlined />
                                &nbsp;đã đổi tên nhóm thành
                            </span>
                        )}
                    {message.type === 'NOTIFY' &&
                        message.content.startsWith('Đã là bạn bè') && (
                            <span>
                                {renderName()}
                                <UserOutlined />
                                &nbsp;đã trở thành bạn bè
                            </span>
                        )}

                    {message.type === 'NOTIFY' &&
                        message.content === 'Đã ghim 1 tin nhắn' && (
                            <span>
                                {renderName()}
                                <PushpinOutlined />
                                &nbsp;đã ghim một tin nhắn
                            </span>
                        )}

                    {message.type === 'NOTIFY' &&
                        message.content === 'Gỡ ghim 1 tin nhắn' && (
                            <span>
                                {renderName()}
                                <PushpinOutlined />
                                &nbsp;đã bỏ ghim một tin nhắn
                            </span>
                        )}

                    {message.type === 'NOTIFY' &&
                        message.content === 'Thay đổi 1 channel' && (
                            <span>
                                {renderName()}
                                <NumberOutlined />
                                &nbsp;đã đổi tên Channel
                            </span>
                        )}

                    {message.type === 'NOTIFY' &&
                        message.content === 'Xóa 1 channel' && (
                            <span>
                                {renderName()}
                                <NumberOutlined />
                                &nbsp;đã xóa Channel
                            </span>
                        )}

                    {message.type === 'NOTIFY' &&
                        message.content === 'Đã tạo 1 channel' && (
                            <span>
                                {renderName()}
                                <NumberOutlined />
                                &nbsp;đã tạo Channel
                            </span>
                        )}
                    {message.type === 'NOTIFY' &&
                        message.content === 'Đã vào nhóm từ link' && (
                            <span>{renderName()} đã tham gia nhóm </span>
                        )}
                    {message.type === 'STICKER' && (
                        <span>
                            {renderName()}
                            <SmileOutlined />
                            &nbsp;đã gửi một sticker
                        </span>
                    )}
                    {message.type === 'NOTIFY' &&
                        message.content === 'Ảnh đại diện nhóm đã thay đổi' && (
                            <span>
                                {renderName()}
                                <EditOutlined />
                                &nbsp;đã đổi ảnh nhóm
                            </span>
                        )}
                    {message.type === 'NOTIFY' &&
                        message.content === 'Đã thêm vào quản lý nhóm' && (
                            <span>
                                {renderName()}
                                <KeyOutlined rotate="180" />
                                &nbsp;đã bổ nhiệm phó nhóm
                            </span>
                        )}
                    {message.type === 'NOTIFY' &&
                        message.content === 'Đã xóa quyền quản lý' && (
                            <span>
                                {renderName()}
                                <KeyOutlined rotate="180" />
                                &nbsp;đã xóa phó nhóm
                            </span>
                        )}

                    {message.type === 'VOTE' && (
                        <span>
                            {renderName()}
                            <FcBarChart />
                            &nbsp;bình chọn
                        </span>
                    )}
                </>
            )}
        </>
    );
}

export default ShortMessage;
