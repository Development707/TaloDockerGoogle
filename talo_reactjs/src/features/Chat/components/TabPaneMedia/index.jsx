import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Row, Select } from 'antd';
import PersonalIcon from '../PersonalIcon';
import RangeCalendarCustom from 'components/RangeCalendarCustom';
import fileHelpers from 'utils/fileHelpers';
import './style.scss';
TabPaneMedia.propTypes = {
    members: PropTypes.array,
    onQueryChange: PropTypes.func,
};

TabPaneMedia.defaultProps = {
    members: [],
    onQueryChange: null,
};

function TabPaneMedia(props) {
    const { members, onQueryChange } = props;

    const { Option } = Select;
    const [sender, setSender] = useState('');

    const [query, setQuery] = useState({});

    const handleDatePickerChange = (date, dateString) => {
        const queryTempt = {
            ...query,
            ...fileHelpers.convertDateStringsToServerDateObject(dateString),
        };
        setQuery({ ...query, queryTempt });
        if (onQueryChange) onQueryChange(queryTempt);
    };
    const handleChange = (memberId) => {
        const index = members.findIndex((ele) => ele.id === memberId);
        let queryTempt = {};

        if (index > -1) {
            setSender(members[index].name);
            queryTempt = {
                ...query,
                userIdSend: memberId,
            };
            setQuery(queryTempt);
        } else {
            setSender('');
            queryTempt = {
                ...query,
                userIdSend: '',
            };
            setQuery(queryTempt);
        }
        if (onQueryChange) onQueryChange(queryTempt);
    };
    return (
        <div id="tabpane-media">
            <Row gutter={[16, 8]}>
                <Col span={24}>
                    <Select
                        dropdownMatchSelectWidth={false}
                        optionLabelProp="label"
                        showSearch
                        style={{ width: '100%' }}
                        onChange={handleChange}
                        placeholder="Người gửi"
                        optionFilterProp="children"
                        value={sender}
                        filterOption={(input, option) =>
                            option.value
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                        }
                        filterSort={(optionA, optionB) =>
                            optionA.children
                                .toString()
                                .toLowerCase()
                                .localeCompare(
                                    optionB.children.toString().toLowerCase()
                                )
                        }
                        allowClear
                    >
                        {members.map((item, index) => (
                            <Option key={index} value={item.id}>
                                <div className="option-item">
                                    <div className="icon-user-item">
                                        <PersonalIcon
                                            demention={24}
                                            avatar={item.avatar?.url}
                                            name={item.name}
                                        />
                                    </div>

                                    <div className="name-user-item">
                                        {item.name}
                                    </div>
                                </div>
                            </Option>
                        ))}
                    </Select>
                </Col>

                <Col span={24}>
                    <RangeCalendarCustom
                        style={{ width: '100%' }}
                        onChange={handleDatePickerChange}
                        allowClear={true}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default TabPaneMedia;
