import ic_export from '@/assets/image/ic_export.svg';
import {
    ADMIN_KEY,
    DATE_TRANSACTION,
    EXPORT_KEY,
    PaymentType,
    Role,
    RoleName,
    TIME_DELAY_EXPORT,
    TOKEN_KEY,
} from '@/config/constant';
import config from '@/config/index';
import { useLocalStorage } from '@/hooks';
import { DatePicker, Input, message, Select } from 'antd';
import Cleave from 'cleave.js/react';
import { connect } from 'dva';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'umi';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';
import TableData from './TableData';

const { Option } = Select;
const { RangePicker } = DatePicker;

function ListTransaction(props) {
    const { transactionStore, dispatch } = props;
    const { listMerchant, deleteResponse, updateResponse, devices } = transactionStore;
    const [rangeTime, setRangeTime] = useState([]);
    const [transactionStatus, setTransactionStatus] = useState();
    const [paymentType, setPaymentType] = useState();
    const [deviceId, setDeviceId] = useState();
    const [userId, setUserId] = useState();
    const [orderCode, setOrderCode] = useState();

    const [pageIndex, setPageIndex] = useState(1);

    const [username, setUsername] = useState();
    const [amount, setAmount] = useState();

    const [admin] = useLocalStorage(ADMIN_KEY);
    const [exportTime, setExportTime] = useLocalStorage(EXPORT_KEY);

    useEffect(() => {
        dispatch({ type: 'TRANSACTION/getDevices' });
    }, [dispatch]);

    useEffect(() => {
        const payload = {
            // page: 0,
            role: RoleName[Role.ROLE_USER],
        };
        if (admin?.role === Role.ROLE_AGENT) {
            payload.agentId = admin.id;
        }
        dispatch({ type: 'TRANSACTION/getMerchants', payload });
    }, [admin, dispatch]);

    useEffect(() => {
        let payload = {
            page: pageIndex - 1,
            // transactionType: 'send_money',
            transactionStatus: 'SUCCESS',
            userId,
            paymentType,
            orderCode,
            startDate: rangeTime?.[0],
            endDate: rangeTime?.[1],
            deviceId,
            username,
            amount,
        };
        if (admin?.role === Role.ROLE_AGENT) {
            payload.agentId = admin.id;
        }
        dispatch({ type: 'TRANSACTION/getDeposits', payload });
        const interval = setInterval(
            () => dispatch({ type: 'TRANSACTION/getDeposits', payload }),
            5000,
        );
        return () => {
            clearInterval(interval);
        };
    }, [
        pageIndex,
        userId,
        deleteResponse,
        transactionStatus,
        orderCode,
        paymentType,
        updateResponse,
        rangeTime,
        dispatch,
        admin,
        deviceId,
        username,
        amount,
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
            transactionType: 'send_money',
            transactionStatus: 'SUCCESS',
            userId,
            paymentType,
            orderCode,
            startDate: rangeTime[0],
            endDate: rangeTime[1],
            username,
            amount,
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

    const handleChangeMin = e => {
        setAmount(Number(e.currentTarget.rawValue));
    };

    return (
        <div className={styles.content}>
            <div className={styles.header}>
                <div>
                    <h3>{formatMessage({ id: 'HISTORY_TRANSACTION' })}</h3>
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
                <div className={styles.select}>
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

                <div className={styles.select} style={{ marginRight: 8, marginLeft: 8 }}>
                    <div className="mb-1">{formatMessage({ id: 'CHANNEL' })}:</div>
                    <Select
                        style={{ minWidth: 180 }}
                        defaultValue=""
                        onChange={value => setPaymentType(value)}
                    >
                        <Option value="">{formatMessage({ id: 'ALL' })}</Option>
                        {Object.keys(PaymentType).map((item, index) => {
                            return <Option value={item}>{formatMessage({ id: `${item}` })}</Option>;
                        })}
                    </Select>
                </div>

                <div className={styles.select}>
                    <div className="mb-1">{formatMessage({ id: 'BANK_NAME' })}:</div>
                    <Select
                        style={{ minWidth: 300 }}
                        defaultValue=""
                        onChange={value => setDeviceId(value)}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={devices.map(item => {
                            return {
                                value: item.id,
                                label: `${item.bankName} - ${item.numberAccount} - ${item.username}`,
                            };
                        })}
                    ></Select>
                </div>

                <div className={styles.select} style={{ marginRight: 8, marginLeft: 8 }}>
                    <div className="mb-1">{formatMessage({ id: 'MERCHANT_ORDER_ID' })}</div>
                    <Input
                        className={styles.textInput}
                        onChange={e => setOrderCode(e.target.value)}
                    />
                </div>

                {/* filter by amount money */}
                <div className={styles.select}>
                    <div className="mb-1">{formatMessage({ id: 'USERNAME' })}</div>
                    <Input
                        className={styles.textInput}
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>

                <div className={styles.select} style={{ marginRight: 8, marginLeft: 8 }}>
                    <div className="mb-1">{formatMessage({ id: 'AMOUNT' })}</div>
                    <Cleave
                        value={amount}
                        className={styles.textInput}
                        onChange={handleChangeMin}
                        options={{
                            numeral: true,
                            numeralThousandsGroupStyle: 'thousand',
                        }}
                    />
                </div>
            </div>

            <TableData pageIndex={pageIndex} setPageIndex={setPageIndex} />
        </div>
    );
}

export default connect(({ TRANSACTION }) => ({
    transactionStore: TRANSACTION,
}))(withRouter(ListTransaction));
