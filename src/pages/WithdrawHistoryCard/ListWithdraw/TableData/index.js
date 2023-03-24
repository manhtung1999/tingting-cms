import ic_refresh from '@/assets/image/ic_refresh.png';
import ic_detail from '@/assets/image/ic_detail.png';
import EmptyComponent from '@/components/EmptyComponent';
import ModalLoading from '@/components/ModalLoading';
import {
    ADMIN_KEY,
    DATE_FORMAT_TRANSACTION,
    PAGE_SIZE,
    PaymentTypeAll,
    Role,
    TIEN_KHONG_RO_NGUON,
    TransactionStatus,
    TransactionStatusValue,
} from '@/config/constant';
import { useLocalStorage } from '@/hooks';
import { formatVnd } from '@/util/function';
import { Pagination } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import React, { useState } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';
import ModalDetal from '../ModalDetal';
function TableData({ dispatch, withdrawStore, pageIndex, setPageIndex }) {
    const { listWithdraw, totalRow, loading, listAgent } = withdrawStore;

    const [admin] = useLocalStorage(ADMIN_KEY);

    const [currentTrans, setCurrentTrans] = useState({
        isShow: false,
        id: undefined,
    });

    const handleRefreshCard = orderCode => {
        const payload = {
            orderCode,
        };
        dispatch({ type: 'WITHDRAW_CARD/refreshCard', payload });
    };

    const showDetal = id => {
        setCurrentTrans({
            isShow: true,
            id,
        });
    };

    const renderData =
        listWithdraw.length === 0 ? (
            <EmptyComponent />
        ) : (
            ((admin?.role !== Role.ROLE_USER && listAgent.length) ||
                admin?.role === Role.ROLE_USER) &&
            listWithdraw
                .filter(i => i.transactionName !== TIEN_KHONG_RO_NGUON)
                .map((item, index) => {
                    return (
                        <tr className="text-center" key={index}>
                            <td className="col-2">
                                {item.orderCode}
                                <div>Request ID: {item.cardRequestId}</div>
                            </td>
                            <td className="col-1">{item.code}</td>
                            <td className={'col-1'}>
                                {formatVnd(item.cardCardValue)} x {item.cardNumberCard}
                                <div>{item.bankName}</div>
                            </td>
                            <td className="col-1">
                                {item.transactionStatus === TransactionStatus.IN_PROGRESS_STAFF ? (
                                    item.staffApproveId ? (
                                        <div className="mb-2">
                                            {formatMessage({
                                                id: 'PROCESSING',
                                            })}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mb-2">
                                                {formatMessage({
                                                    id:
                                                        TransactionStatusValue[
                                                            item.transactionStatus
                                                        ],
                                                })}
                                            </div>
                                            {item.paymentType === PaymentTypeAll.card && (
                                                <img
                                                    onClick={() =>
                                                        handleRefreshCard(item.orderCode)
                                                    }
                                                    src={ic_refresh}
                                                    alt="refresh"
                                                    title="refresh"
                                                    style={{
                                                        width: 17,
                                                        height: 17,
                                                        marginLeft: 5,
                                                    }}
                                                />
                                            )}
                                        </>
                                    )
                                ) : (
                                    // trạng thái khác
                                    <div className="mb-2">
                                        {formatMessage({
                                            id: TransactionStatusValue[item.transactionStatus],
                                        })}
                                    </div>
                                )}
                                {item.reason && (
                                    <strong
                                        style={{
                                            display: 'block',
                                            fontSize: 10,
                                            color: 'red',
                                        }}
                                    >
                                        ({item.reason})
                                    </strong>
                                )}{' '}
                            </td>
                            <td className="col-2">
                                {moment(item.createdAt).format(DATE_FORMAT_TRANSACTION)}
                            </td>
                            <td className="col-2">
                                {moment(item.updatedAt).format(DATE_FORMAT_TRANSACTION)}
                            </td>
                            <td className="col-1">
                                {item.staffApproveId ? (
                                    <>
                                        <span>{item.staffName}</span> -
                                        <span>
                                            {moment(item.updatedAt).format(DATE_FORMAT_TRANSACTION)}
                                        </span>
                                    </>
                                ) : (
                                    '---'
                                )}
                            </td>

                            <td className="col-2">
                                <img
                                    onClick={() => showDetal(item.id)}
                                    width={25}
                                    height={25}
                                    title="Detail"
                                    src={ic_detail}
                                    alt="view detail"
                                />
                            </td>
                        </tr>
                    );
                })
        );

    if (loading) {
        return <ModalLoading />;
    }

    return (
        <div className={styles.table}>
            {currentTrans.isShow && (
                <ModalDetal currentTrans={currentTrans} setCurrentTrans={setCurrentTrans} />
            )}
            <table>
                <thead>
                    <tr className="text-center">
                        <th className="col-2">{formatMessage({ id: 'MERCHANT_ORDER' })}</th>
                        <th className="col-1">{formatMessage({ id: 'ORDER_ID' })}</th>
                        <th className={'col-1'}>{formatMessage({ id: 'AMOUNT' })}</th>
                        <th className="col-1">{formatMessage({ id: 'STATUS' })}</th>
                        <th className="col-2">{formatMessage({ id: 'CREATED_AT' })}</th>
                        <th className="col-2">{formatMessage({ id: 'UPDATED_AT' })}</th>
                        <th className="col-1">{formatMessage({ id: 'HANDING_AT' })}</th>
                        <th className="col-2">{formatMessage({ id: 'ACTION' })}</th>
                    </tr>
                </thead>
                <tbody>{renderData}</tbody>
            </table>

            <div className={styles.pagination}>
                <Pagination
                    onChange={p => setPageIndex(p)}
                    defaultCurrent={pageIndex}
                    current={pageIndex}
                    size="small"
                    total={totalRow}
                    pageSize={PAGE_SIZE}
                />
            </div>
        </div>
    );
}
export default connect(({ WITHDRAW_CARD }) => ({
    withdrawStore: WITHDRAW_CARD,
}))(TableData);
