import ic_export from '@/assets/image/ic_export.svg';
import { ADMIN_KEY, DATE_TRANSACTION, Role, TOKEN_KEY, TransactionStatus } from '@/config/constant';
import config from '@/config/index';
import { useLocalStorage } from '@/hooks';
import { DatePicker, message, Select } from 'antd';
import Cleave from 'cleave.js/react';
import { connect } from 'dva';
import moment from 'moment';
import React, { useEffect, useState, useCallback } from 'react';
import { withRouter } from 'umi';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';
import TableData from './TableData';
import _ from 'lodash';

const { Option } = Select;
const { RangePicker } = DatePicker;

function ListInternalTransfer(props) {
    const { internalStore, dispatch } = props;
    const {
        deleteResponse,
        updateResponse,
        denyResponse,
        approveResponse,
        devices,
    } = internalStore;
    const [rangeTime, setRangeTime] = useState([]);
    const [transactionStatus, setTransactionStatus] = useState();
    const [deviceId, setDeviceId] = useState();

    const [pageIndex, setPageIndex] = useState(1);

    const [min, setMin] = useState();
    const [max, setMax] = useState();

    const [admin] = useLocalStorage(ADMIN_KEY);

    useEffect(() => {
        dispatch({ type: 'INTERNAL_TRANSFER/getDevices' });
    }, [dispatch]);

    useEffect(() => {
        let payload = {
            page: pageIndex - 1,
            // transactionType: 'withdraw_money',
            transactionStatus,
            startDate: rangeTime?.[0],
            endDate: rangeTime?.[1],
            deviceId,
            systemTransactionType: 'MONEY_SEND_INTERNAL',
        };
        if (admin?.role === Role.ROLE_AGENT) {
            payload.agentId = admin.id;
        }
        if (admin?.role === Role.ROLE_USER) {
            payload.userId = admin.id;
        }
        dispatch({ type: 'INTERNAL_TRANSFER/getWithdraws', payload });

        const interval = setInterval(
            () => dispatch({ type: 'INTERNAL_TRANSFER/getWithdraws', payload }),
            5000,
        );
        return () => {
            clearInterval(interval);
        };
    }, [
        pageIndex,
        deleteResponse,
        transactionStatus,
        updateResponse,
        rangeTime,
        dispatch,
        denyResponse,
        approveResponse,
        admin,
        deviceId,
    ]);

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

    const INTERVAL = 60 * 1000;
    const debouncedClick = useCallback(
        _.debounce(
            () => {
                handleExport();
            },
            INTERVAL,
            { leading: true, trailing: false, maxWait: INTERVAL },
        ),
        [],
    );

    const handleExport = () => {
        if (!rangeTime[0] && !rangeTime[1]) {
            message.warn(formatMessage({ id: 'PLEASE_SET_TIME_EXPORT' }));
            return;
        }
        const url = 'api/v1/transaction/export';
        var params = getQueryString({
            page: pageIndex - 1,
            transactionType: 'withdraw_money',
            transactionStatus,
            startDate: rangeTime[0],
            endDate: rangeTime[1],
            systemTransactionType: 'MONEY_SEND_INTERNAL',
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
    };

    const handleChangeMin = e => {
        setMin(Number(e.currentTarget.rawValue));
    };

    const handleChangeMax = e => {
        setMax(Number(e.currentTarget.rawValue));
    };

    return (
        <div className={styles.content}>
            <div className={styles.header}>
                <div>
                    <h3>{formatMessage({ id: 'INTERNAL_TRANSFER_LIST' })}</h3>
                </div>
                <div className={styles.datePicker}>
                    <label className="me-2">{formatMessage({ id: 'TIME' })}: </label>
                    <RangePicker
                        format={DATE_TRANSACTION}
                        disabledDate={disabledDate}
                        onChange={(dates, dateStrings) => setRangeTime(dateStrings)}
                    />
                </div>
            </div>
            <div className={styles.pageFilter}>
                <div className={styles.select}>
                    <div className="mb-1">{formatMessage({ id: 'STATUS' })}:</div>
                    <Select
                        style={{ minWidth: 180 }}
                        defaultValue=""
                        onChange={value => setTransactionStatus(value)}
                    >
                        <Option value="">{formatMessage({ id: 'ALL' })}</Option>
                        {Object.keys(TransactionStatus).map((item, index) => {
                            return <Option value={item}>{formatMessage({ id: `${item}` })}</Option>;
                        })}
                    </Select>
                </div>
                <div className={styles.select}>
                    <div className="mb-1">{formatMessage({ id: 'DEVICE' })}:</div>
                    <Select
                        style={{ minWidth: 320 }}
                        defaultValue=""
                        onChange={value => setDeviceId(value)}
                    >
                        <Option value={''}>{formatMessage({ id: 'ALL' })}</Option>
                        {devices.map(item => {
                            return (
                                <Option value={item.id}>
                                    {item.bankName} - {item.numberAccount} - {item.username}{' '}
                                </Option>
                            );
                        })}
                    </Select>
                </div>
                {/* filter by amount money */}
                <div className={styles.select} style={{ marginRight: 8, marginLeft: 8 }}>
                    <div className="mb-1">{formatMessage({ id: 'MIN' })}</div>
                    <Cleave
                        value={min}
                        className={styles.textInput}
                        onChange={handleChangeMin}
                        options={{
                            numeral: true,
                            numeralThousandsGroupStyle: 'thousand',
                        }}
                    />
                </div>
                <div className={styles.select}>
                    <div className="mb-1">{formatMessage({ id: 'MAX' })}</div>
                    <Cleave
                        value={max}
                        className={styles.textInput}
                        onChange={handleChangeMax}
                        options={{
                            numeral: true,
                            numeralThousandsGroupStyle: 'thousand',
                        }}
                    />
                </div>
                <button className={styles.yellowBtn} onClick={handleExport}>
                    <img width={20} style={{ marginRight: 6 }} src={ic_export} alt="" />
                    {formatMessage({ id: 'EXPORT' })}
                </button>
            </div>
            <TableData pageIndex={pageIndex} setPageIndex={setPageIndex} />
        </div>
    );
}

export default connect(({ INTERNAL_TRANSFER }) => ({
    internalStore: INTERNAL_TRANSFER,
}))(withRouter(ListInternalTransfer));
