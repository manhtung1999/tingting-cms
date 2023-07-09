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
    TransactionStatus,
} from '@/config/constant';
import config from '@/config/index';
import { useLocalStorage, useDebounce } from '@/hooks';
import { formatVnd } from '@/util/function';
import { DatePicker, Input, message, Select } from 'antd';
import Cleave from 'cleave.js/react';
import { connect } from 'dva';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'umi';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';
import TableData from './TableData';
import RangeTimeComponent from '@/components/TimeRange';

const { Option } = Select;
const { RangePicker } = DatePicker;

function ListDeposit(props) {
    const { depositStore, dispatch } = props;
    const {
        listMerchant,
        deleteResponse,
        updateResponse,
        devices,
        nap,
        rut,
        systemFee,
        agentFee,
        listPaymentType,
    } = depositStore;
    const [rangeTime, setRangeTime] = useState([]);
    const [transactionStatus, setTransactionStatus] = useState();
    const [paymentType, setPaymentType] = useState();
    const [deviceId, setDeviceId] = useState();
    const [userId, setUserId] = useState();
    const [orderCode, setOrderCode] = useState();
    const [code, setCode] = useState();
    const [username, setUsername] = useState();
    const [amount, setAmount] = useState();
    const [currentExchange, setCurrentExchange] = useState();
    const [paymentTypeId, setPaymentTypeId] = useState();
    const [cardCode, setCardCode] = useState();
    const [serial, setSerial] = useState();
    const [cardRequestId, setCardRequestId] = useState();
    const [cardValue, setCardValue] = useState();

    const [pageIndex, setPageIndex] = useState(1);

    const [admin] = useLocalStorage(ADMIN_KEY);

    const [exportTime, setExportTime] = useLocalStorage(EXPORT_KEY);

    const debouncedSearchAmount = useDebounce(amount, 500); // 1s

    useEffect(() => {
        dispatch({ type: 'DEPOSIT/getPaymentType' });
    }, [dispatch]);

    useEffect(() => {
        if (listPaymentType.length > 0) {
            const usdt = listPaymentType.find(i => i.sortNameBank === 'USDT');
            if (!usdt) {
                message.error(formatMessage({ id: 'DONT_HAVE_USDT' }));
                return;
            } else {
                setCurrentExchange(usdt.exchangeRate);
            }
        }
    }, [listPaymentType]);

    useEffect(() => {
        dispatch({ type: 'DEPOSIT/getDevices' });
    }, [dispatch]);

    useEffect(() => {
        const payload = {
            role: RoleName[Role.ROLE_USER],
        };
        if (admin?.role === Role.ROLE_AGENT) {
            payload.agentId = admin.id;
        }
        admin?.role !== Role.ROLE_USER && dispatch({ type: 'DEPOSIT/getMerchants', payload });
    }, [admin, dispatch]);

    useEffect(() => {
        let payload = {
            page: pageIndex - 1,
            transactionType: 'send_money',
            transactionStatus,
            userId,
            paymentType,
            code: code,
            username,
            startDate: rangeTime?.[0],
            endDate: rangeTime?.[1],
            deviceId,
            amount: debouncedSearchAmount,
            orderCode: orderCode,
            systemTransactionType: 'MONEY_IN_SYSTEM',
            paymentTypeId,
            cardCode,
            serial,
            requestId: cardRequestId,
            cardValue,
        };
        if (admin?.role === Role.ROLE_AGENT) {
            payload.agentId = admin.id;
        }
        if (admin?.role === Role.ROLE_USER) {
            payload.userId = admin.id;
        }
        dispatch({ type: 'DEPOSIT/getDeposits', payload });
        const interval = setInterval(
            () => dispatch({ type: 'DEPOSIT/getDeposits', payload }),
            30000,
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
        code,
        paymentType,
        updateResponse,
        rangeTime,
        dispatch,
        admin,
        deviceId,
        username,
        debouncedSearchAmount,
        paymentTypeId,
        cardCode,
        serial,
        cardRequestId,
        cardValue,
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
        let userIdExport = userId;
        let agentId;
        if (admin?.role === Role.ROLE_USER) {
            userIdExport = admin?.id;
        }
        if (admin?.role === Role.ROLE_AGENT) {
            agentId = admin?.id;
        }
        var params = getQueryString({
            page: pageIndex - 1,
            transactionType: 'send_money',
            transactionStatus,
            userId: userIdExport,
            paymentType,
            orderCode,
            startDate: rangeTime[0],
            endDate: rangeTime[1],
            agentId,
            cardCode,
            serial,
            paymentTypeId,
            requestId: cardRequestId,
            cardValue,
            amount: debouncedSearchAmount,
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
        const amount = Number(e.currentTarget.rawValue);
        setAmount(amount || '');
    };

    const handleChangeCardValue = e => {
        const amount = Number(e.currentTarget.rawValue);
        setCardValue(amount || '');
    };

    const listPaymentTypeByCard = listPaymentType.slice(0, 4);

    return (
        <div className={styles.content}>
            <div className={styles.header}>
                <div>
                    <h3>{formatMessage({ id: 'DEPOSIT_LIST' })}</h3>
                </div>
                <div className={styles.datePicker}>
                    <label className="me-2">{formatMessage({ id: 'TIME' })}: </label>
                    <RangePicker
                        format={DATE_TRANSACTION}
                        disabledDate={disabledDate}
                        onChange={(dates, dateStrings) => {
                            console.log({ dateStrings });
                            setRangeTime(dateStrings);
                        }}
                    />
                </div>
                <RangeTimeComponent setRangeTime={setRangeTime} />
                <button className={styles.yellowBtn} onClick={handleExport}>
                    <img width={20} style={{ marginRight: 6 }} src={ic_export} alt="" />
                    {formatMessage({ id: 'EXPORT' })}
                </button>
            </div>
            <div className={styles.pageFilter}>
                {(admin?.role === Role.ROLE_ACCOUNTANT ||
                    admin?.role === Role.ROLE_ADMIN ||
                    admin?.role === Role.ROLE_AGENT ||
                    admin?.role === Role.ROLE_STAFF) && (
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
                )}
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
                        <Option value={'card'}>{formatMessage({ id: `CARD` })}</Option>
                    </Select>
                </div>

                {/* Filter by status */}
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

                {/* Filter by bank name */}
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

                {/* filter by amount money */}
                <div className={styles.select}>
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

                <div className={styles.pageFilter}>
                    {/* filter by order KH */}
                    <div className={styles.select}>
                        <div className="mb-1">{formatMessage({ id: 'MERCHANT_ORDER_ID' })}</div>
                        <Input
                            className={styles.textInput}
                            onChange={e => setOrderCode(e.target.value)}
                        />
                    </div>
                    <div className={styles.select} style={{ marginRight: 8, marginLeft: 8 }}>
                        <div className="mb-1">{formatMessage({ id: 'ORDER_ID' })}</div>
                        <Input
                            className={styles.textInput}
                            onChange={e => setCode(e.target.value)}
                        />
                    </div>

                    <div className={styles.select}>
                        <div className="mb-1">{formatMessage({ id: 'USER_ORDER' })}</div>
                        <Input
                            className={styles.textInput}
                            onChange={e => setUsername(e.target.value)}
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

                    <div className={styles.select}>
                        <div className="mb-1">{formatMessage({ id: 'SERIAL' })}</div>
                        <Input
                            className={styles.textInput}
                            onChange={e => setSerial(e.target.value)}
                        />
                    </div>
                    <div className={styles.select}>
                        <div className="mb-1">Card request id: </div>
                        <Input
                            className={styles.textInput}
                            onChange={e => setCardRequestId(e.target.value)}
                        />
                    </div>

                    <div className={styles.select} style={{ marginRight: 8, marginLeft: 8 }}>
                        <div className="mb-1">{formatMessage({ id: 'CARD_VALUE' })}</div>
                        <Cleave
                            value={cardValue}
                            className={styles.textInput}
                            onChange={handleChangeCardValue}
                            options={{
                                numeral: true,
                                numeralThousandsGroupStyle: 'thousand',
                            }}
                        />
                    </div>

                    {/* {rangeTime.length > 0 &&
                        currentExchange &&
                        (admin?.role === Role.ROLE_ADMIN ||
                            admin?.role === Role.ROLE_STAFF ||
                            admin?.role === Role.ROLE_ACCOUNTANT ||
                            admin?.role === Role.ROLE_AGENT) && (
                            <div
                                style={{ marginLeft: 10 }}
                                className="d-flex flex-grow-1 flex-column justify-content-end"
                            >
                                <div className="d-flex">
                                    <h6 style={{ fontSize: 12, marginRight: 15 }}>
                                        {formatMessage({ id: 'DEPOSIT' })}: {formatVnd(nap)} (
                                        <span style={{ fontSize: 12 }}>
                                            {Number(nap / currentExchange).toFixed(2)} USDT
                                        </span>
                                        )
                                    </h6>
                                    <h6 style={{ fontSize: 12 }}>
                                        {formatMessage({ id: 'WITHDRAW' })}: {formatVnd(rut)} (
                                        <span style={{ fontSize: 12 }}>
                                            {Number(rut / currentExchange).toFixed(2)} USDT
                                        </span>
                                        )
                                    </h6>
                                </div>
                                {(admin?.role === Role.ROLE_ADMIN ||
                                    admin?.role === Role.ROLE_STAFF ||
                                    admin?.role === Role.ROLE_ACCOUNTANT) && (
                                    <div className="d-flex">
                                        <h6 style={{ fontSize: 12, marginRight: 15 }}>
                                            {formatMessage({ id: 'FEE' })}:{' '}
                                            {formatVnd(systemFee + agentFee)} (
                                            <span style={{ fontSize: 12 }}>
                                                {Number(
                                                    (systemFee + agentFee) / currentExchange,
                                                ).toFixed(2)}{' '}
                                                USDT
                                            </span>
                                            )
                                        </h6>
                                        <h6 style={{ fontSize: 12 }}>
                                            {formatMessage({ id: 'BALANCE' })}:{' '}
                                            {formatVnd(nap - rut - systemFee - agentFee)} (
                                            <span style={{ fontSize: 12 }}>
                                                {Number(
                                                    (nap - rut - systemFee - agentFee) /
                                                        currentExchange,
                                                ).toFixed(2)}{' '}
                                                USDT
                                            </span>
                                            )
                                        </h6>
                                    </div>
                                )}

                                {admin?.role === Role.ROLE_AGENT && (
                                    <div className="d-flex">
                                        <h6 style={{ fontSize: 12, marginRight: 15 }}>
                                            {formatMessage({ id: 'commission' })}:{' '}
                                            {formatVnd(agentFee)} (
                                            <span style={{ fontSize: 12 }}>
                                                {Number(agentFee / currentExchange).toFixed(2)} USDT
                                            </span>
                                            )
                                        </h6>
                                    </div>
                                )}
                            </div>
                        )} */}
                </div>
            </div>

            <TableData pageIndex={pageIndex} setPageIndex={setPageIndex} />
        </div>
    );
}

export default connect(({ DEPOSIT }) => ({
    depositStore: DEPOSIT,
}))(withRouter(ListDeposit));
