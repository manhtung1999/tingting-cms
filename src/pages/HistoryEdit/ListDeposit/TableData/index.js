import ModalLoading from '@/components/ModalLoading';
import {
    PAGE_SIZE,
    PaymentTypeValue,
    TIEN_KHONG_RO_NGUON,
    TransactionType,
    DATE_FORMAT_TRANSACTION,
} from '@/config/constant';
import { formatVnd } from '@/util/function';
import { Pagination } from 'antd';
import { connect } from 'dva';
import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';
import moment from 'moment';
function TableData({ historyStore, pageIndex, setPageIndex }) {
    const { listDeposit, totalRow, loading, listMerchant } = historyStore;

    const renderData = listDeposit
        .filter(i => i.transactionName !== TIEN_KHONG_RO_NGUON)
        .map((item, index) => {
            return (
                <tr className="text-center" key={index}>
                    <td className="col-1">
                        {listMerchant.find(i => i.id === item.ownerId)?.phone}
                    </td>
                    <td className="col-2">
                        {item.systemTransactionType === 2 ? (
                            <span>{formatMessage({ id: 'INTERNAL_MONEY_TRANSFER' })}</span>
                        ) : (
                            <span>{item.transactionName}</span>
                        )}
                    </td>
                    <td className="col-2">
                        {item.transactionType === TransactionType['send_money'] ? (
                            <span>+{formatVnd(item.totalMoneyChange)}</span>
                        ) : (
                            <span>-{formatVnd(item.totalMoneyChange)}</span>
                        )}
                    </td>
                    <td className="col-1">{formatVnd(item.userMoney)}</td>
                    <td className="col-2">{item.staffName}</td>
                    <td className="col-2">{item.reason}</td>
                    <td className={'col-2'}>
                        {moment(item.updatedAt).format(DATE_FORMAT_TRANSACTION)}
                    </td>
                </tr>
            );
        });

    if (loading) {
        return <ModalLoading />;
    }

    return (
        <div className={styles.table}>
            <table>
                <thead>
                    <tr className="text-center">
                        <th className="col-1">{formatMessage({ id: 'MERCHANT' })}</th>
                        <th className="col-2">{formatMessage({ id: 'TYPE' })}</th>
                        <th className="col-2">{formatMessage({ id: 'AMOUNT' })}</th>
                        <th className="col-1">{formatMessage({ id: 'BALANCE' })}</th>
                        <th className="col-2">{formatMessage({ id: 'HANDLE_ACC' })}</th>
                        <th className="col-2">{formatMessage({ id: 'REASON' })}</th>
                        <th className={'col-2'}>{formatMessage({ id: 'TIME' })}</th>
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
export default connect(({ HISTORY }) => ({
    historyStore: HISTORY,
}))(TableData);
