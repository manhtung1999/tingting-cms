import ModalLoading from '@/components/ModalLoading';
import {
    PAGE_SIZE,
    PaymentTypeValue,
    TIEN_KHONG_RO_NGUON,
    TransactionType,
} from '@/config/constant';
import { formatVnd } from '@/util/function';
import { Pagination } from 'antd';
import { connect } from 'dva';
import React, { useState } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import ModalConfirm from '../ModalConfirm';
import styles from './styles.scss';

function TableData({ reportStore, pageIndex, setPageIndex }) {
    const { listDeposit, totalRow, loading, listMerchant } = reportStore;

    const [modalConfirm, setModalConfirm] = useState({
        isShow: false,
        id: undefined,
    });

    const renderData = listDeposit
        .filter(i => i.transactionName !== TIEN_KHONG_RO_NGUON)
        .map((item, index) => {
            return (
                <tr className="text-center" key={index}>
                    <td className="col-1">
                        {listMerchant.find(i => i.id === item.ownerId)?.phone}
                    </td>
                    <td className="col-2">
                        {PaymentTypeValue[item.paymentType] &&
                            formatMessage({ id: PaymentTypeValue[item.paymentType] })}
                    </td>
                    <td className="col-2">
                        {item.systemTransactionType === 2 ? (
                            <span>{formatMessage({ id: 'INTERNAL_MONEY_TRANSFER' })}</span>
                        ) : (
                            <span>{item.transactionName}</span>
                        )}
                    </td>
                    {/* <td className="col-2">{formatVnd(item.totalMoneyChange)}</td> */}
                    <td className="col-2">
                        {item.transactionType === TransactionType['send_money']
                            ? formatVnd(item.totalMoneyChange)
                            : formatVnd(item.totalCurrentMoney)}
                    </td>
                    <td className="col-1">
                        {item.transactionType === TransactionType['send_money']
                            ? formatVnd(item.totalCurrentMoney - item.totalMoneyChange)
                            : formatVnd(item.totalMoneyChange - item.totalCurrentMoney)}
                    </td>
                    <td className="col-2">
                        {item.bankName} - {item.bankAccount}
                    </td>
                    <td className="col-2">{item.code}</td>
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
                        <th className="col-1">{formatMessage({ id: 'MERCHANT' })}</th>
                        <th className="col-2">{formatMessage({ id: 'CHANNEL' })}</th>
                        <th className="col-2">{formatMessage({ id: 'TYPE' })}</th>
                        <th className="col-2">{formatMessage({ id: 'AMOUNT' })}</th>
                        <th className="col-1">{formatMessage({ id: 'FEE' })}</th>
                        <th className="col-2">{formatMessage({ id: 'RECIPIENT_ACC' })}</th>
                        <th className="col-2">{formatMessage({ id: 'REMARK' })}</th>
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
export default connect(({ REPORT }) => ({
    reportStore: REPORT,
}))(TableData);
