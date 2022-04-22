import { Tabs } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import ConverGroupSearch from 'components/ConverGroupSearch';
import ConverDualSearch from 'components/ConverDualSearch';
import './style.scss';
import ConverAllSearch from 'components/ConverAllSearch';

FilterContainer.propTypes = {
    dataAll: PropTypes.array,
    dataSingle: PropTypes.array,
    dataMutiple: PropTypes.array,
};

FilterContainer.defaultProps = {
    dataAll: [],
    dataDual: [],
    dataGroup: [],
};

function FilterContainer({ dataAll, dataDual, dataGroup }) {
    const { TabPane } = Tabs;

    return (
        <div className="filter-container">
            <Tabs defaultActiveKey="ALL">
                <TabPane tab="Tất cả" key="ALL">
                    <ConverAllSearch data={dataAll} />
                </TabPane>
                <TabPane tab="Cá nhân" key="SINGLE">
                    <ConverDualSearch data={dataDual} />
                </TabPane>
                <TabPane tab="Nhóm" key="GROUP">
                    <ConverGroupSearch data={dataGroup} />
                </TabPane>
            </Tabs>
        </div>
    );
}

export default FilterContainer;
