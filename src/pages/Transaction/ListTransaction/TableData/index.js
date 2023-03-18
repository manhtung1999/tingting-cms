import ModalLoading from '@/components/ModalLoading';
import {
    ADMIN_ID,
    DATE_TRANSACTION,
    PAGE_SIZE,
    PaymentTypeValue,
    PaymentTypeAll,
} from '@/config/constant';
import { formatVnd } from '@/util/function';
import { Pagination, Modal, Input, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';
import ic_edit from '@/assets/image/ic_edit.svg';
const { confirm } = Modal;

function TableData({ dispatch, transactionStore, pageIndex, setPageIndex }) {
    const { listDeposit, totalRow, loading, listMerchant } = transactionStore;

    const handleAddNote = transactionId => {
        let note;
        confirm({
            title: formatMessage({ id: 'ADD_NOTE' }),
            content: (
                <div>
                    <span style={{ color: '#000' }}>{formatMessage({ id: 'NOTE' })}:</span>
                    <Input
                        onChange={e => {
                            note = e.target.value;
                        }}
                    />
                </div>
            ),
            onOk: () => {
                if (!note) {
                    message.error(formatMessage({ id: 'REQUIRE_VALUE' }));
                    return;
                }
                const payload = { id: transactionId, note };
                dispatch({ type: 'TRANSACTION/addNoteTransaction', payload });
            },
            onCancel: () => {},
        });
    };

    const renderData = listDeposit.map((item, index) => {
        return (
            <tr className="text-center" key={index}>
                <td className="col-2">{item.code}</td>
                <td className="col-3">
                    {item.systemTransactionType === 2 ? (
                        <span>{formatMessage({ id: 'INTERNAL_MONEY_TRANSFER' })}</span>
                    ) : (
                        <span>{item.transactionName}</span>
                    )}

                    {/* nhân viên trực thêm note cho BDSD để note là đã đối chiếu với giao dịch nào */}
                    {item.note ? (
                        <div style={{ color: 'yellow' }}>Note: {item.note}</div>
                    ) : (
                        <div>
                            <img
                                style={{
                                    width: 20,
                                    height: 20,
                                    marginTop: 5,
                                }}
                                src={ic_edit}
                                onClick={() => handleAddNote(item.id)}
                                alt="Add Note"
                            />
                        </div>
                    )}
                </td>
                <td className="col-2">
                    {item.bankName} - {item.bankAccount} - {item.bankUsername}
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
                {/* <td className={'col-1'}>
                    {item.totalCurrentMoney > 0
                        ? formatVnd(item.totalCurrentMoney)
                        : formatVnd(item.totalMoney)}
                </td> */}
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
            <table>
                <thead>
                    <tr className="text-center">
                        <th className="col-2">{formatMessage({ id: 'REMARK' })}</th>
                        <th className="col-3">{formatMessage({ id: 'TYPE' })}</th>
                        <th className="col-2">{formatMessage({ id: 'RECIPIENT_ACC' })}</th>
                        <th className="col-2">{formatMessage({ id: 'MERCHANT_CHANNEL' })}</th>
                        <th className={'col-1'}>{formatMessage({ id: 'AMOUNT' })}</th>
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
export default connect(({ TRANSACTION }) => ({
    transactionStore: TRANSACTION,
}))(TableData);
