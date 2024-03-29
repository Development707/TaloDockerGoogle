import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import InfoTitle from '../InfoTitle';
import { Tabs } from 'antd';
import TabPaneMedia from '../TabPaneMedia';
import { useSelector } from 'react-redux';
import Scrollbars from 'react-custom-scrollbars';
import ContentTabPaneMedia from '../ContentTabPaneMedia';
import ContentTabPaneFile from '../ContentTabPaneFile';
import mediaApi from 'api/mediaApi';
import './style.scss';

InfoMediaSearch.propTypes = {
    onBack: PropTypes.func,
    tabpane: PropTypes.number.isRequired,
};
InfoMediaSearch.defaultProps = {
    onBack: null,
};
function InfoMediaSearch(props) {
    const { onBack, tabpane } = props;

    const { TabPane } = Tabs;
    const { memberInConversation, currentConversation } = useSelector(
        (state) => state.chat
    );
    const [activeKey, setActiveKey] = useState(tabpane.toString());
    const [medias, setMedias] = useState([]);

    const getTypeWithTabpane = (value) => {
        if (value === 1) {
            return 'IMAGE';
        }
        if (value === 2) {
            return 'VIDEO';
        }
        if (value === 3) {
            return 'FILE';
        }
    };

    const [query, setQuery] = useState({
        conversationId: currentConversation,
        type: getTypeWithTabpane(tabpane),
    });

    const handleOnBack = (value) => {
        if (onBack) {
            onBack(value);
        }
    };

    const getType = (key) => {
        let type = 'IMAGE';
        if (key === '2') type = 'VIDEO';
        if (key === '3') type = 'FILE';

        return type;
    };

    const handleChangeTab = (activeKey) => {
        setQuery({ ...query, type: getType(activeKey), userIdSend: '' });
        setActiveKey(activeKey);
    };

    const handleQueryChange = async (queryResult) => {
        setQuery({ ...query, ...queryResult });
    };

    useEffect(() => {
        const fetchMedia = async () => {
            const mediasResult = await mediaApi.getAllMedia(
                query.conversationId,
                query.userIdSend,
                query.type,
                query.startTime,
                query.endTime
            );
            setMedias(mediasResult);
        };

        fetchMedia();
    }, [query]);

    return (
        <div id="info_media-search">
            <div className="info_media-search--title">
                <InfoTitle
                    isBack={true}
                    text="Kho lưu trữ"
                    onBack={handleOnBack}
                    isSelected={true}
                />
            </div>

            <div className="info_media-search--tabpane">
                <Tabs
                    activeKey={activeKey}
                    size="middle"
                    onChange={handleChangeTab}
                >
                    <TabPane tab="Ảnh" key="1">
                        <TabPaneMedia
                            members={memberInConversation}
                            onQueryChange={handleQueryChange}
                        />
                    </TabPane>

                    <TabPane tab="Video" key="2">
                        <TabPaneMedia
                            members={memberInConversation}
                            onQueryChange={handleQueryChange}
                        />
                    </TabPane>
                    <TabPane tab="File" key="3">
                        <TabPaneMedia
                            members={memberInConversation}
                            onQueryChange={handleQueryChange}
                        />
                    </TabPane>
                </Tabs>
            </div>

            <div className="info_media-search-content">
                <Scrollbars
                    autoHide={true}
                    autoHideTimeout={1000}
                    autoHideDuration={200}
                    style={{ width: '100%' }}
                    height="100%"
                >
                    {activeKey === '1' && (
                        <ContentTabPaneMedia items={medias} type="image" />
                    )}
                    {activeKey === '2' && (
                        <ContentTabPaneMedia items={medias} type="video" />
                    )}
                    {activeKey === '3' && <ContentTabPaneFile items={medias} />}
                </Scrollbars>
            </div>
        </div>
    );
}

export default InfoMediaSearch;
