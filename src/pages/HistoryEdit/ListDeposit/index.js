import ic_back from '@/assets/image/ic_back.png';
import ic_export from '@/assets/image/ic_export.svg';
import {
    ADMIN_KEY,
    DATE_TRANSACTION,
    Role,
    RoleName,
    TOKEN_KEY,
    TIME_DELAY_EXPORT,
    EXPORT_KEY,
} from '@/config/constant';
import config from '@/config/index';
import { useLocalStorage } from '@/hooks';
import { DatePicker, message, Select } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { router, withRouter } from 'umi';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';
import TableData from './TableData';

const { Option } = Select;
const { RangePicker } = DatePicker;

function ListHistory(props) {
    const { historyStore, dispatch } = props;
    const { listMerchant, agents } = historyStore;
    const [rangeTime, setRangeTime] = useState([]);
    const [userId, setUserId] = useState();

    const [pageIndex, setPageIndex] = useState(1);

    const [admin] = useLocalStorage(ADMIN_KEY);
    const [exportTime, setExportTime] = useLocalStorage(EXPORT_KEY);

    useEffect(() => {
        dispatch({ type: 'HISTORY/getDevices' });
    }, [dispatch]);

    useEffect(() => {
        const payload = {
            role: RoleName[Role.ROLE_USER],
        };
        if (admin?.role === Role.ROLE_AGENT) {
            payload.agentId = admin.id;
        }
        admin?.role !== Role.ROLE_USER && dispatch({ type: 'HISTORY/getMerchants', payload });
    }, [admin, dispatch]);

    // get agent
    useEffect(() => {
        const payload = {
            role: RoleName[Role.ROLE_AGENT],
            deleted: false,
        };
        dispatch({ type: 'HISTORY/getAgents', payload });
    }, [dispatch]);

    useEffect(() => {
        let payload = {
            page: pageIndex - 1,
            systemTransactionType: 'USER_EDIT_MONEY',
            userId,
            startDate: rangeTime?.[0],
            endDate: rangeTime?.[1],
        };
        dispatch({ type: 'HISTORY/getDeposits', payload });
    }, [pageIndex, userId, rangeTime, dispatch]);

    function disabledDate(current) {
        // Can not select days after today and today
        return current && current > moment().endOf('day');
    }

    const getQueryString = queries => {
        return Object.keys(queries)
            .filter(i => queries[i] !== undefined)
            .reduce((result, key) => {
                return [...result, `${encodeURIComponent(key)}=${queries[key]}`];
            }, [])
            .join('&');
    };

    const handleExport = () => {
        let isDisabled =
            exportTime !== ''
                ? Math.abs(new Date() - new Date(exportTime)) < TIME_DELAY_EXPORT
                : false;
        if (isDisabled) {
            message.warn(
                `${formatMessage({ id: 'DELAY_EXPORT' })}: ${TIME_DELAY_EXPORT / 1000 -
                    Math.round(Math.abs(new Date() - new Date(exportTime)) / 1000)}s`,
            );
            return;
        }

        if (!rangeTime[0] && !rangeTime[1]) {
            message.warn(formatMessage({ id: 'PLEASE_SET_TIME_EXPORT' }));
            return;
        }
        const url = 'api/v1/transaction/export';
        var params = getQueryString({
            page: pageIndex - 1,
            systemTransactionType: 'USER_EDIT_MONEY',
            userId,
            startDate: rangeTime[0],
            endDate: rangeTime[1],
        });
        fetch(config.API_DOMAIN + url + '?' + params, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/xlsx',
                Authorization: 'Bearer ' + localStorage.getItem(TOKEN_KEY),
            },
        })
            .then(response => response.blob())
            .then(blob => {
                // Create blob link to download
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `transaction.xlsx`);

                // Append to html link element page
                document.body.appendChild(link);

                // Start download
                link.click();

                // Clean up and remove the link
                link.parentNode.removeChild(link);
            });
        setExportTime(new Date().valueOf());
    };

    return (
        <div className={styles.content}>
            <div className={styles.header}>
                <div className="d-flex">
                    <img
                        className={styles.sizeIcon}
                        onClick={() => {
                            router.push({ pathname: '/home/account-manage' });
                        }}
                        src={ic_back}
                        alt="back"
                        style={{ marginRight: 10 }}
                    />
                    <h3>{formatMessage({ id: 'HISTORY_EDIT_BALANCE' })}</h3>
                </div>
                <div className={styles.datePicker}>
                    <label className="me-2">{formatMessage({ id: 'TIME' })}: </label>
                    <RangePicker
                        format={DATE_TRANSACTION}
                        disabledDate={disabledDate}
                        onChange={(dates, dateStrings) => setRangeTime(dateStrings)}
                    />
                </div>
                <button className={styles.yellowBtn} onClick={handleExport}>
                    <img width={20} style={{ marginRight: 6 }} src={ic_export} alt="" />
                    {formatMessage({ id: 'EXPORT' })}
                </button>
            </div>
            <div className={styles.pageFilter}>
                {(admin?.role === Role.ROLE_ACCOUNTANT ||
                    admin?.role === Role.ROLE_ADMIN ||
                    admin?.role === Role.ROLE_STAFF) && (
                    <>
                        <div className={styles.select} style={{ marginRight: 15 }}>
                            <div className="mb-1">{formatMessage({ id: 'MERCHANT' })}:</div>
                            <Select
                                style={{ minWidth: 180 }}
                                defaultValue=""
                                onChange={value => setUserId(value)}
                            >
                                <Option value={''}>{formatMessage({ id: 'ALL' })}</Option>
                                {listMerchant.map(item => {
                                    return <Option value={item.id}>{item.phone}</Option>;
                                })}
                            </Select>
                        </div>
                        <div className={styles.select}>
                            <div className="mb-1">{formatMessage({ id: 'AGENT' })}:</div>
                            <Select
                                style={{ minWidth: 180 }}
                                defaultValue=""
                                onChange={value => setUserId(value)}
                            >
                                <Option value={''}>{formatMessage({ id: 'ALL' })}</Option>
                                {agents.map(item => {
                                    return <Option value={item.id}>{item.phone}</Option>;
                                })}
                            </Select>
                        </div>
                    </>
                )}
            </div>
            <TableData pageIndex={pageIndex} setPageIndex={setPageIndex} />
        </div>
    );
}

export default connect(({ HISTORY }) => ({
    historyStore: HISTORY,
}))(withRouter(ListHistory));
