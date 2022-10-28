import ic_delete from '@/assets/image/ic_delete.svg';
import ModalLoading from '@/components/ModalLoading';
import {
    ADMIN_ID,
    ADMIN_KEY,
    DATE_TRANSACTION,
    PAGE_SIZE,
    PaymentTypeValue,
    Role,
} from '@/config/constant';
import { useLocalStorage } from '@/hooks';
import { formatVnd } from '@/util/function';
import { Modal, Pagination } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';
const { confirm } = Modal;

function TableData({ dispatch, transactionStore, pageIndex, setPageIndex }) {
    const { listDeposit, totalRow, loading, listMerchant } = transactionStore;
    const [admin] = useLocalStorage(ADMIN_KEY);
    const handleDelete = id => {
        confirm({
            title: formatMessage({ id: 'ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_TRANSACTION' }),
            onOk: () => {
                const payload = { id };
                dispatch({ type: 'TRANSACTION/deleteTransaction', payload });
            },
            onCancel: () => {},
        });
    };
    const renderData = listDeposit.map((item, index) => {
        return (
            <tr className="text-center" key={index}>
                <td className="col-1">{item.code}</td>
                <td className="col-3">
                    {item.systemTransactionType === 2 ? (
                        <span>{formatMessage({ id: 'INTERNAL_MONEY_TRANSFER' })}</span>
                    ) : (
                        <span>{item.transactionName}</span>
                    )}
                </td>
                <td className="col-2">
                    {item.bankName} - {item.bankAccount}
                </td>
                <td className="col-2">
                    {//  chuyển tiền nội bộ
                    item.systemTransactionType === 2 ? (
                        <span>{formatMessage({ id: 'INTERNAL_MONEY_TRANSFER' })}</span>
                    ) : (
                        <>
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
                                        formatMessage({ id: PaymentTypeValue[item.paymentType] })}
                                </>
                            )}
                        </>
                    )}
                </td>
                <td className={admin?.role === Role.ROLE_ADMIN ? 'col-1' : 'col-2'}>
                    {item.totalCurrentMoney > 0
                        ? formatVnd(item.totalCurrentMoney)
                        : formatVnd(item.totalMoney)}
                </td>
                <td className="col-1">{moment(item.createdAt).format(DATE_TRANSACTION)}</td>
                <td className="col-1">{moment(item.updatedAt).format(DATE_TRANSACTION)}</td>
                {admin?.role === Role.ROLE_ADMIN && (
                    <td className="col-1 d-flex justify-content-center">
                        <img
                            className={styles.sizeIcon}
                            src={ic_delete}
                            onClick={() => handleDelete(item.id)}
                            alt="delete"
                        />
                    </td>
                )}
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
                        <th className="col-1">{formatMessage({ id: 'REMARK' })}</th>
                        <th className="col-3">{formatMessage({ id: 'TYPE' })}</th>
                        <th className="col-2">{formatMessage({ id: 'RECIPIENT_ACC' })}</th>
                        <th className="col-2">{formatMessage({ id: 'MERCHANT_CHANNEL' })}</th>
                        <th className={admin?.role === Role.ROLE_ADMIN ? 'col-1' : 'col-2'}>
                            {formatMessage({ id: 'AMOUNT' })}
                        </th>
                        <th className="col-1">{formatMessage({ id: 'CREATED_AT' })}</th>
                        <th className="col-1">{formatMessage({ id: 'UPDATED_AT' })}</th>
                        {admin?.role === Role.ROLE_ADMIN && (
                            <th className="col-1">{formatMessage({ id: 'ACTION' })}</th>
                        )}
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
export default connect(({ TRANSACTION }) => ({
    transactionStore: TRANSACTION,
}))(TableData);
