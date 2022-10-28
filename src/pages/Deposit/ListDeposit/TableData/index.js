import ic_delete from '@/assets/image/ic_delete.svg';
import ic_check from '@/assets/image/ic_check.svg';
import ModalLoading from '@/components/ModalLoading';
import {
    ADMIN_ID,
    ADMIN_KEY,
    DATE_TRANSACTION,
    PAGE_SIZE,
    PaymentTypeValue,
    Role,
    TIEN_KHONG_RO_NGUON,
    TransactionStatusValue,
    TransactionStatus,
} from '@/config/constant';
import { useLocalStorage } from '@/hooks';
import { formatVnd } from '@/util/function';
import { Modal, Pagination } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import React, { useState } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import ModalConfirm from '../ModalConfirm';
import styles from './styles.scss';
const { confirm } = Modal;

function TableData({ dispatch, depositStore, pageIndex, setPageIndex }) {
    const { listDeposit, totalRow, loading, listMerchant } = depositStore;
    const [admin] = useLocalStorage(ADMIN_KEY);

    const [modalConfirm, setModalConfirm] = useState({
        isShow: false,
        id: undefined,
    });

    const handleDelete = id => {
        confirm({
            title: formatMessage({ id: 'ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_TRANSACTION' }),
            onOk: () => {
                const payload = { id };
                dispatch({ type: 'DEPOSIT/deleteTransaction', payload });
            },
            onCancel: () => {},
        });
    };

    const handleAdminConfirm = id => {
        setModalConfirm({
            isShow: true,
            id,
        });
    };

    const map = listDeposit.filter(i => i.transactionName === TIEN_KHONG_RO_NGUON);
    console.log('map', map);

    const renderData = listDeposit
        .filter(i => i.transactionName !== TIEN_KHONG_RO_NGUON)
        .map((item, index) => {
            return (
                <tr className="text-center" key={index}>
                    <td className="col-2">{item.orderCode}</td>
                    <td className="col-1">{item.code}</td>
                    <td className="col-1">{item.orderUsername}</td>
                    <td className="col-2">
                        {item.paymentType === 4 ? 'USDT' : `${item.bankName} - ${item.bankAccount}`}
                    </td>
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
                                    </>
                                )}
                            </div>
                        )}
                    </td>
                    {/* <td className={admin?.role === Role.ROLE_ADMIN ? 'col-1' : 'col-2'}> */}
                    <td className="col-1">
                        {item.totalCurrentMoney > 0
                            ? formatVnd(item.totalCurrentMoney)
                            : formatVnd(item.totalMoney)}
                    </td>
                    <td className="col-1">
                        {TransactionStatusValue[item.transactionStatus] &&
                            formatMessage({ id: TransactionStatusValue[item.transactionStatus] })}
                        {item.transactionStatus === TransactionStatus.IN_PROGRESS_STAFF &&
                            (admin?.role === Role.ROLE_STAFF ||
                                admin?.role === Role.ROLE_ADMIN) && (
                                <div>
                                    <img
                                        onClick={() => handleAdminConfirm(item.id)}
                                        src={ic_check}
                                        alt="check"
                                        title="confirm"
                                        style={{ width: 17, height: 17 }}
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
                    {/* {admin?.role === Role.ROLE_ADMIN && (
                        <td className="col-1 d-flex justify-content-center">
                            <img
                                className={styles.sizeIcon}
                                src={ic_delete}
                                onClick={() => handleDelete(item.id)}
                                alt="delete"
                            />
                        </td>
                    )} */}
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
                        {/* <th className={admin?.role === Role.ROLE_ADMIN ? 'col-1' : 'col-2'}>
                            {formatMessage({ id: 'AMOUNT' })}
                        </th> */}
                        <th className="col-1">{formatMessage({ id: 'AMOUNT' })}</th>
                        <th className="col-1">{formatMessage({ id: 'STATUS' })}</th>
                        <th className="col-1">{formatMessage({ id: 'CREATED_AT' })}</th>
                        <th className="col-1">{formatMessage({ id: 'UPDATED_AT' })}</th>
                        {/* {admin?.role === Role.ROLE_ADMIN && (
                            <th className="col-1">{formatMessage({ id: 'ACTION' })}</th>
                        )} */}
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
