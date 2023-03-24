import ic_check from '@/assets/image/ic_check.svg';
import ModalLoading from '@/components/ModalLoading';
import {
    ADMIN_ID,
    ADMIN_KEY,
    DATE_TRANSACTION,
    PAGE_SIZE,
    PaymentTypeAll,
    PaymentTypeValue,
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
import ModalConfirm from '../ModalConfirm';
import styles from './styles.scss';

function TableData({ depositStore, pageIndex, setPageIndex, dispatch }) {
    const { listDeposit, totalRow, loading, listMerchant } = depositStore;
    const [admin] = useLocalStorage(ADMIN_KEY);

    const [modalConfirm, setModalConfirm] = useState({
        isShow: false,
        id: undefined,
    });
    const handleAdminConfirm = id => {
        setModalConfirm({
            isShow: true,
            id,
        });
    };

    const renderData = listDeposit
        .filter(i => i.transactionName !== TIEN_KHONG_RO_NGUON)
        .map((item, index) => {
            const serialOrBankAccount = item.cardSerialEncode || item.bankAccount;
            return (
                <tr className="text-center" key={index}>
                    <td className="col-2">{item.orderCode}</td>
                    <td className="col-1">{item.code}</td>
                    <td className="col-1">{item.orderUsername}</td>
                    <td className="col-2">
                        {item.paymentType === 4
                            ? 'USDT'
                            : `${item.bankName} - ${serialOrBankAccount || ''}`}
                        {item.cardSerialEncode && <div>({formatMessage({ id: 'SERIAL' })})</div>}
                    </td>

                    {/* receipient acc  */}
                    <td className="col-2">
                        {item.ownerId === ADMIN_ID && item.paymentType === 4 ? (
                            <>
                                <span>Admin</span>
                                {' - '}
                                {PaymentTypeValue[item.paymentType] &&
                                    formatMessage({ id: PaymentTypeValue[item.paymentType] })}
                            </>
                        ) : (
                            <div>
                                {item.ownerId === ADMIN_ID ? (
                                    <div
                                        style={{ whiteSpace: 'pre-wrap' }}
                                        dangerouslySetInnerHTML={{ __html: item.metadata }}
                                    />
                                ) : (
                                    <>
                                        <span>
                                            {listMerchant.find(i => i.id === item.ownerId)?.phone}
                                        </span>
                                        {' - '}
                                        {PaymentTypeValue[item.paymentType] &&
                                            formatMessage({
                                                id: PaymentTypeValue[item.paymentType],
                                            })}
                                        <span>{item.cardCodeEncode}</span>
                                        {item.cardCodeEncode && (
                                            <div>({formatMessage({ id: 'CARD_NUMBER' })})</div>
                                        )}
                                        <span>Request ID: {item.cardRequestId}</span>
                                    </>
                                )}
                            </div>
                        )}
                    </td>

                    {/* total money column */}
                    <td className="col-1">
                        {item.paymentType === PaymentTypeAll.card ? (
                            <>
                                {formatVnd(item.totalMoneyChange)} <br />
                                <span>Card value: {formatVnd(item.totalMoney)}</span>
                            </>
                        ) : item.totalCurrentMoney > 0 ? (
                            formatVnd(item.totalCurrentMoney)
                        ) : (
                            formatVnd(item.totalMoney)
                        )}
                    </td>

                    {/* status column */}
                    <td className="col-1">
                        {TransactionStatusValue[item.transactionStatus] &&
                            formatMessage({ id: TransactionStatusValue[item.transactionStatus] })}
                        {item.transactionStatus === TransactionStatus.IN_PROGRESS_STAFF && item.paymentType !== PaymentTypeAll.card &&
                            (admin?.role === Role.ROLE_STAFF ||
                                admin?.role === Role.ROLE_ADMIN) && (
                                <div>
                                    <img
                                        onClick={() => handleAdminConfirm(item.id)}
                                        src={ic_check}
                                        alt="check"
                                        title="confirm"
                                        style={{ width: 17, height: 17, marginRight: 5 }}
                                    />
                                </div>
                            )}
                        {item.reason && (
                            <strong style={{ display: 'block', fontSize: 10, color: 'red' }}>
                                ({item.reason})
                            </strong>
                        )}
                    </td>
                    <td className="col-1">{moment(item.createdAt).format(DATE_TRANSACTION)}</td>
                    <td className="col-1">{moment(item.updatedAt).format(DATE_TRANSACTION)}</td>
                </tr>
            );
        });

    if (loading) {
        return <ModalLoading />;
    }

    return (
        <div className={styles.table}>
            <ModalConfirm modalConfirm={modalConfirm} setModalConfirm={setModalConfirm} />
            <table>
                <thead>
                    <tr className="text-center">
                        <th className="col-2">{formatMessage({ id: 'MERCHANT_ORDER' })}</th>
                        <th className="col-1">{formatMessage({ id: 'ORDER_ID' })}</th>
                        <th className="col-1">{formatMessage({ id: 'USER_ORDER' })}</th>
                        <th className="col-2">{formatMessage({ id: 'RECIPIENT_ACC' })}</th>
                        <th className="col-2">{formatMessage({ id: 'MERCHANT_CHANNEL' })}</th>
                        <th className="col-1">{formatMessage({ id: 'AMOUNT' })}</th>
                        <th className="col-1">{formatMessage({ id: 'STATUS' })}</th>
                        <th className="col-1">{formatMessage({ id: 'CREATED_AT' })}</th>
                        <th className="col-1">{formatMessage({ id: 'UPDATED_AT' })}</th>
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
export default connect(({ DEPOSIT }) => ({
    depositStore: DEPOSIT,
}))(TableData);
