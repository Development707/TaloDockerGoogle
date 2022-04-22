import React, { useState } from 'react';
import { defaultStyles, FileIcon } from 'react-file-icon';
import { MdQuestionAnswer } from 'react-icons/md';
import fileHelpers from 'utils/fileHelpers';
import './style.scss';
const ReplyMessage = ({ replyMessage }) => {
    const fileName =
        replyMessage.type === 'FILE' &&
        fileHelpers.getFileName(replyMessage.content);
    const fileExtension =
        replyMessage.type === 'FILE' && fileHelpers.getFileExtension(fileName);

    const handleOpenModal = () => {};
    return (
        <>
            {replyMessage && (
                <>
                    <div className="reply-message" onClick={handleOpenModal}>
                        <div className="vertical-bar" />

                        {replyMessage.type === 'IMAGE' ? (
                            <div className="reply-block_logo">
                                <img src={replyMessage.content} alt="" />
                            </div>
                        ) : replyMessage.type === 'VIDEO' ? (
                            <div className="reply-block_logo">
                                <img
                                    src="https://karseell.vn/wp-content/uploads/2018/12/videoProduction.png"
                                    alt=""
                                />
                            </div>
                        ) : replyMessage.type === 'STICKER' ? (
                            <div className="reply-block_logo">
                                <img src={replyMessage.content} alt="" />
                            </div>
                        ) : replyMessage.type === 'FILE' ? (
                            <div className="reply-block_logo">
                                <div className="file_info-icon">
                                    <FileIcon
                                        extension={fileExtension}
                                        {...defaultStyles[fileExtension]}
                                    />
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}

                        <div className="reply-block_info">
                            <div className="info-blog_info--top">
                                <MdQuestionAnswer />
                                &nbsp;
                                <span>
                                    Trả lời{' '}
                                    <strong className="reply-block_info--user">
                                        {replyMessage.userId.name}
                                    </strong>
                                </span>
                            </div>

                            <div className="info-blog_info--bottom">
                                {replyMessage.type === 'IMAGE' ? (
                                    <span>[Hình ảnh]</span>
                                ) : replyMessage.type === 'VIDEO' ? (
                                    <span>[Video]</span>
                                ) : replyMessage.type === 'STICKER' ? (
                                    <span>[Sticker] </span>
                                ) : replyMessage.type === 'FILE' ? (
                                    <span>[File]{fileName}</span>
                                ) : replyMessage.type === 'HTML' ? (
                                    <span>[Văn bản]</span>
                                ) : (
                                    replyMessage.content
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default ReplyMessage;
