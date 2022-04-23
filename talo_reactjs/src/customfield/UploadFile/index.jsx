import { message, Upload } from 'antd';
import messageApi from 'api/messageApi';
import ACCEPT_FILE from 'constants/acceptFile';
import React from 'react';
import { useSelector } from 'react-redux';

const UploadFile = (props) => {
    const { typeOfFile } = props;
    const { currentConversation, currentChannel } = useSelector(
        (state) => state.chat
    );

    const handleCustomRequest = async ({ file }) => {
        const fmData = new FormData();
        let typeFile;

        if (typeOfFile === 'media') {
            typeFile = file.type.startsWith('image') ? 'IMAGE' : 'VIDEO';
        } else {
            typeFile = 'FILE';
        }
        fmData.append('type', typeFile);
        fmData.append('file', file);

        if (currentChannel) {
            fmData.append('channelId', currentChannel);
        }

        try {
            await messageApi.sendFileThroughMessage(
                fmData,
                currentConversation,
                (percentCompleted) => {
                    // console.log('value', percentCompleted);
                }
            );
            message.success(`Đã tải lên ${file.name}`);
        } catch (e) {
            message.error(`Tải lên ${file.name} thất bại`);
        }
    };
    return (
        <Upload
            accept={
                typeOfFile === 'media'
                    ? ACCEPT_FILE.IMAGE_VIDEO
                    : ACCEPT_FILE.FILE
            }
            multiple={true}
            progress
            customRequest={handleCustomRequest}
            showUploadList={false}
        >
            {props.children}
        </Upload>
    );
};

export default UploadFile;
