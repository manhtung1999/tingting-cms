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
import { connect } from 'dva';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'umi';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';
import TableData from './TableData';

const { Option } = Select;
const { RangePicker } = DatePicker;

function ListReport(props) {
    const { reportStore, dispatch } = props;
    const { listPaymentType, listMerchant, deleteResponse, updateResponse, devices } = reportStore;
    const [rangeTime, setRangeTime] = useState([]);
    const [paymentType, setPaymentType] = useState();
    const [deviceId, setDeviceId] = useState();
    const [userId, setUserId] = useState();
    const [orderCode, setOrderCode] = useState();
    const [transactionType, setTransactionType] = useState();
    const [pageIndex, setPageIndex] = useState(1);
    const [paymentTypeId, setPaymentTypeId] = useState();
    const [cardCode, setCardCode] = useState();
    const [serial, setSerial] = useState();
    const [cardRequestId, setCardRequestId] = useState();

    const [admin] = useLocalStorage(ADMIN_KEY);
    const [exportTime, setExportTime] = useLocalStorage(EXPORT_KEY);

    useEffect(() => {
        dispatch({ type: 'REPORT/getDevices' });
    }, [dispatch]);

    useEffect(() => {
        dispatch({ type: 'REPORT/getPaymentType' });
    }, [dispatch]);

    useEffect(() => {
        const payload = {
            role: RoleName[Role.ROLE_USER],
        };
        if (admin?.role === Role.ROLE_AGENT) {
            payload.agentId = admin.id;
        }
        admin?.role !== Role.ROLE_USER && dispatch({ type: 'REPORT/getMerchants', payload });
    }, [admin, dispatch]);

    useEffect(() => {
        let payload = {
            page: pageIndex - 1,
            transactionStatus: 'SUCCESS',
            userId,
            paymentType,
            code: orderCode,
            startDate: rangeTime?.[0],
            endDate: rangeTime?.[1],
            deviceId,
            systemTransactionType: 'MONEY_IN_SYSTEM',
            transactionType,
            cardCode,
            serial,
            paymentTypeId,
            requestId: cardRequestId,
        };
        if (admin?.role === Role.ROLE_AGENT) {
            payload.agentId = admin.id;
        }
        if (admin?.role === Role.ROLE_USER) {
            payload.userId = admin.id;
        }
        dispatch({ type: 'REPORT/getDeposits', payload });
        const interval = setInterval(() => dispatch({ type: 'REPORT/getDeposits', payload }), 5000);
        return () => {
            clearInterval(interval);
        };
    }, [
        pageIndex,
        userId,
        deleteResponse,
        orderCode,
        paymentType,
        updateResponse,
        rangeTime,
        dispatch,
        admin,
        deviceId,
        transactionType,
        cardCode,
        serial,
        paymentTypeId,
        cardRequestId,
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

        const queryObj = {
            page: pageIndex - 1,
            transactionStatus: 'SUCCESS',
            userId,
            paymentType,
            code: orderCode,
            startDate: rangeTime[0],
            endDate: rangeTime[1],
            deviceId,
            systemTransactionType: 'MONEY_IN_SYSTEM',
            transactionType,
            cardCode,
            serial,
            paymentTypeId,
            requestId: cardRequestId,
        };
        if (admin?.role === Role.ROLE_AGENT) {
            queryObj.agentId = admin.id;
        }
        if (admin?.role === Role.ROLE_USER) {
            queryObj.userId = admin.id;
        }
        var params = getQueryString(queryObj);
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
    const listPaymentTypeByCard = listPaymentType.slice(0, 4);

    return (
        <div className={styles.content}>
            <div className={styles.header}>
                <div>
                    <h3>{formatMessage({ id: 'REPORT' })}</h3>
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
                    <div className={styles.select} style={{ marginRight: 8 }}>
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
                )}
                <div className={styles.select} style={{ marginRight: 8 }}>
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
                        <Option value={'card'}>{formatMessage({ id: `CARD` })}</Option>
                    </Select>
                </div>

                <div className={styles.select}>
                    <div className="mb-1">{formatMessage({ id: 'TYPE' })}:</div>
                    <Select
                        style={{ minWidth: 150 }}
                        defaultValue=""
                        onChange={value => setTransactionType(value)}
                    >
                        <Option value="">{formatMessage({ id: 'ALL' })}</Option>
                        <Option value={'send_money'}>{formatMessage({ id: `DEPOSIT` })}</Option>
                        <Option value={'withdraw_money'}>
                            {formatMessage({ id: `WITHDRAW` })}
                        </Option>
                    </Select>
                </div>

                <div className={styles.select} style={{ marginRight: 8, marginLeft: 8 }}>
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

                <div className={styles.select}>
                    <div className="mb-1">{formatMessage({ id: 'MERCHANT_ORDER_ID' })}</div>
                    <Input
                        className={styles.textInput}
                        onChange={e => setOrderCode(e.target.value)}
                    />
                </div>

                {/* Filter by telecom card */}
                <div className={styles.select} style={{ marginRight: 8, marginLeft: 8 }}>
                    <div className="mb-1">{formatMessage({ id: 'CARD' })}:</div>
                    <Select
                        style={{ minWidth: 180 }}
                        defaultValue=""
                        onChange={value => setPaymentTypeId(value)}
                    >
                        <Option value="">{formatMessage({ id: 'ALL' })}</Option>
                        {listPaymentTypeByCard.map((item, index) => {
                            return <Option value={item.id}>{item.sortNameBank}</Option>;
                        })}
                    </Select>
                </div>

                <div className={styles.select} style={{ marginRight: 8 }}>
                    <div className="mb-1">{formatMessage({ id: 'CARD_NUMBER' })}</div>
                    <Input
                        className={styles.textInput}
                        onChange={e => setCardCode(e.target.value)}
                    />
                </div>

                <div className={styles.select} style={{ marginRight: 8 }}>
                    <div className="mb-1">{formatMessage({ id: 'SERIAL' })}</div>
                    <Input className={styles.textInput} onChange={e => setSerial(e.target.value)} />
                </div>

                <div className={styles.select}>
                    <div className="mb-1">Card request id: </div>
                    <Input
                        className={styles.textInput}
                        onChange={e => setCardRequestId(e.target.value)}
                    />
                </div>
            </div>
            <TableData pageIndex={pageIndex} setPageIndex={setPageIndex} />
        </div>
    );
}

export default connect(({ REPORT }) => ({
    reportStore: REPORT,
}))(withRouter(ListReport));
