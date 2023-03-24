import ic_export from '@/assets/image/ic_export.svg';
import {
    ADMIN_KEY,
    DATE_TRANSACTION,
    EXPORT_KEY,
    Role,
    TIME_DELAY_EXPORT,
    TOKEN_KEY,
    TransactionStatus,
    RoleName,
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

function ListWithdraw(props) {
    const { withdrawStore, dispatch } = props;
    const { updateResponse, listPaymentType } = withdrawStore;
    const [rangeTime, setRangeTime] = useState([]);
    const [transactionStatus, setTransactionStatus] = useState();
    const [userId, setUserId] = useState();
    const [username, setUsername] = useState();
    const [orderCode, setOrderCode] = useState();
    const [code, setCode] = useState();
    const [pageIndex, setPageIndex] = useState(1);
    const [cardValue, setCardValue] = useState();
    const [paymentTypeId, setPaymentTypeId] = useState();
    const [cardCode, setCardCode] = useState();
    const [serial, setSerial] = useState();
    const [admin] = useLocalStorage(ADMIN_KEY);
    const [exportTime, setExportTime] = useLocalStorage(EXPORT_KEY);
    const [cardRequestId, setCardRequestId] = useState();

    useEffect(() => {
        dispatch({ type: 'WITHDRAW_CARD/getPaymentType' });
    }, [dispatch]);

    useEffect(() => {
        let payload = {
            page: pageIndex - 1,
            transactionType: 'withdraw_money',
            transactionStatus,
            userId,
            paymentType: 'card',
            orderCode,
            code,
            startDate: rangeTime?.[0],
            endDate: rangeTime?.[1],
            username,
            systemTransactionType: 'MONEY_IN_SYSTEM',
            cardValue,
            paymentTypeId,
            cardCode,
            serial,
            requestId: cardRequestId,
        };
        if (admin?.role === Role.ROLE_AGENT) {
            payload.agentId = admin.id;
        }
        if (admin?.role === Role.ROLE_USER) {
            payload.userId = admin.id;
        }
        dispatch({ type: 'WITHDRAW_CARD/getWithdraws', payload });

        const interval = setInterval(
            () => dispatch({ type: 'WITHDRAW_CARD/getWithdraws', payload }),
            5000,
        );
        return () => {
            clearInterval(interval);
        };
    }, [
        pageIndex,
        username,
        transactionStatus,
        orderCode,
        updateResponse,
        rangeTime,
        dispatch,
        admin,
        userId,
        code,
        cardValue,
        paymentTypeId,
        cardCode,
        serial,
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
            transactionType: 'withdraw_money',
            transactionStatus,
            username,
            paymentType: 5,
            orderCode,
            startDate: rangeTime[0],
            endDate: rangeTime[1],
            systemTransactionType: 'MONEY_IN_SYSTEM',
            userId: userIdExport,
            agentId,
            cardValue,
            requestId: cardRequestId,
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

    const handleChangeAmount = e => {
        const amount = Number(e.currentTarget.rawValue);
        setCardValue(amount || '');
    };

    const listPaymentTypeByCard = listPaymentType.slice(0, 4);

    return (
        <div className={styles.content}>
            <div className={styles.header}>
                <div>
                    <h3>{formatMessage({ id: 'HISTORY_WITHDRAW_CARD' })}</h3>
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
                <div className={styles.select} style={{ marginRight: 8, marginLeft: 8 }}>
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

                {/* filter by order KH */}
                <div className={styles.select} style={{ marginRight: 8, marginLeft: 8 }}>
                    <div className="mb-1">{formatMessage({ id: 'MERCHANT_ORDER_ID' })}</div>
                    <Input
                        className={styles.textInput}
                        onChange={e => setOrderCode(e.target.value)}
                    />
                </div>
                <div className={styles.select}>
                    <div className="mb-1">{formatMessage({ id: 'ORDER_ID' })}</div>
                    <Input className={styles.textInput} onChange={e => setCode(e.target.value)} />
                </div>
                <div className={styles.select} style={{ marginLeft: 8 }}>
                    <div className="mb-1">{formatMessage({ id: 'USERNAME' })}</div>
                    <Input
                        className={styles.textInput}
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>

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
                    <Input className={styles.textInput} onChange={e => setSerial(e.target.value)} />
                </div>

                {/* filter by amount money */}
                <div className={styles.select} style={{ marginRight: 8, marginLeft: 8 }}>
                    <div className="mb-1">{formatMessage({ id: 'CARD_VALUE' })}</div>
                    <Cleave
                        value={cardValue}
                        className={styles.textInput}
                        onChange={handleChangeAmount}
                        options={{
                            numeral: true,
                            numeralThousandsGroupStyle: 'thousand',
                        }}
                    />
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

export default connect(({ WITHDRAW_CARD }) => ({
    withdrawStore: WITHDRAW_CARD,
}))(withRouter(ListWithdraw));
