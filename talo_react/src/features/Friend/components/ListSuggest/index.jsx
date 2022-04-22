import { Col, Row } from 'antd';
import UserCard from 'components/UserCard';
import React, { useState } from 'react';
import SuggestCard from '../SuggestCard';
import './style.scss';

const ListSuggest = ({ data }) => {
    const [user, setUser] = useState({});
    const [visible, setVisible] = useState(false);

    const handleCancel = () => {
        setVisible(false);
    };
    const handleOnClick = (value) => {
        setUser(value);
        setVisible(true);
    };
    return (
        <div id="list_suggest">
            <Row gutter={[16, 16]}>
                {data.map((item, index) => {
                    if (item.status === 'NOT_FRIEND') {
                        return (
                            <Col
                                span={6}
                                xl={{ span: 6 }}
                                lg={{ span: 8 }}
                                md={{ span: 12 }}
                                sm={{ span: 12 }}
                                xs={{ span: 24 }}
                            >
                                <SuggestCard
                                    key={index}
                                    data={item}
                                    onClick={handleOnClick}
                                />
                            </Col>
                        );
                    }
                })}
            </Row>
            <UserCard user={user} isVisible={visible} onCancel={handleCancel} />
        </div>
    );
};

export default ListSuggest;
