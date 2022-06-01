import { Divider, Table, Tag } from 'antd';
import reportApi from 'api/reportApi';
import React, { useEffect, useState } from 'react';
import dateUtils from 'utils/dateUtils';
import commonFunc from 'utils/tableSttFunc';

const ReportPage = () => {
    const [dataSource, setDataSource] = useState([]);

    const handleGetAllReport = async () => {
        try {
            const reports = await reportApi.getReport();
            return reports;
        } catch (error) {}
    };

    useEffect(() => {
        handleGetAllReport()
            .then((result) => {
                setDataSource(result);
            })
            .catch((err) => {
                throw err;
            });
    }, []);
    const checkTime = (date) => {
        if (date) {
            const time = dateUtils.toTime(date);
            if (
                time.indexOf('ngày') ||
                time.indexOf('giờ') ||
                time.indexOf('phút')
            ) {
                return true;
            }
            return false;
        }
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
        },
        {
            title: 'Tài khoản',
            dataIndex: 'user',
            key: 'user',
            render: (user) => <>{user.name}</>,
        },
        {
            title: 'Loại báo cáo',
            dataIndex: 'type',
            key: 'type',
            render: (type) => (
                <>
                    {type === 'CONVERSATION' ? (
                        <Tag color="blue">Cuộc hội thoại</Tag>
                    ) : type === 'APP' ? (
                        <Tag color="red">Chương trình lỗi</Tag>
                    ) : type === 'USER' ? (
                        <Tag color="green">Người dùng</Tag>
                    ) : (
                        <></>
                    )}
                </>
            ),
        },
        {
            title: 'Nội dung báo cáo',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Ngày giờ báo cáo',
            dataIndex: 'date',
            key: 'date',
            render: (date) => (
                <>
                    {`${dateUtils.toTime(date).toLowerCase()}`}{' '}
                    {`${checkTime(date) ? 'trước' : ''}`}
                </>
            ),
        },
    ];

    return (
        <div className="report-page" style={{ padding: '10px 20px' }}>
            <Divider orientation="left">Danh sách báo cáo</Divider>

            <div className="report-table">
                <Table
                    dataSource={commonFunc.addSTTForList(
                        dataSource,
                        0 * dataSource.length
                    )}
                    columns={columns}
                    bordered
                ></Table>
            </div>
        </div>
    );
};

export default ReportPage;
