import ic_check from '@/assets/image/ic_check.svg';
import ic_delete from '@/assets/image/ic_delete.svg';
import ic_uncheck from '@/assets/image/ic_uncheck.svg';
import ic_cancel from '@/assets/image/ic_cancel.png';
import EmptyComponent from '@/components/EmptyComponent';
import ModalLoading from '@/components/ModalLoading';
import {
    ADMIN_KEY,
    DATE_FORMAT_TRANSACTION,
    PAGE_SIZE,
    Role,
    TransactionStatus,
    TransactionStatusValue,
} from '@/config/constant';
import { useLocalStorage } from '@/hooks';
import { formatVnd } from '@/util/function';
import { Input, message, Modal, Pagination } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import React, { useState } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import ModalApprove from '../ModalApprove';
import styles from './styles.scss';
import { TIEN_KHONG_RO_NGUON } from '@/config/constant';
const { confirm } = Modal;

function TableData({ dispatch, withdrawStore, pageIndex, setPageIndex }) {
    const { listWithdraw, totalRow, loading, listMerchant, devices, listAgent } = withdrawStore;
    const [currentTrans, setCurrentTrans] = useState({
        id: undefined,
        isShow: false,
        amout: undefined,
        bankName: undefined,
    });
    const [admin] = useLocalStorage(ADMIN_KEY);

    const handleDelete = id => {
        confirm({
            title: formatMessage({ id: 'ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_TRANSACTION' }),
            onOk: () => {
                const payload = { id };
                dispatch({ type: 'WITHDRAW/deleteDeposit', payload });
            },
            onCancel: () => {},
        });
    };

    const handleDeny = id => {
        let reason;
        confirm({
            title: formatMessage({ id: 'ARE_YOU_SURE_YOU_WANT_TO_DENY_THIS_TRANSACTION' }),
            content: (
                <div>
                    <span style={{ color: '#000' }}>{formatMessage({ id: 'REASON' })}:</span>
                    <Input
                        onChange={e => {
                            reason = e.target.value;
                        }}
                    />
                </div>
            ),
            onOk: () => {
                if (!reason) {
                    message.error(formatMessage({ id: 'REQUIRE_VALUE' }));
                    return;
                }
                const payload = { id, reason };
                dispatch({ type: 'WITHDRAW/denyTransaction', payload });
            },
            onCancel: () => {},
        });
    };

    const handleApprove = (id, amount, bankName) => {
        setCurrentTrans({
            id,
            isShow: true,
            amount,
            bankName,
        });
    };

    const renderTransferAcc = item => {
        if (item.mobileId) {
            const mobile = devices.find(device => device.id === item.mobileId);
            if (mobile) {
                return (
                    <>
                        <div>{mobile.bankName}</div>
                        <span>{mobile.numberAccount}</span>
                    </>
                );
            }
            return <div>---</div>;
        }
        return <div>---</div>;
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
                            <td className="col-1">{item.orderCode}</td>
                            <td className="col-1">
                                {listMerchant.find(i => i.id === item.ownerId)?.phone}
                                {listAgent.find(i => i.id === item.ownerId)?.phone}
                                {' - '}
                                <span>{item.orderUsername}</span>
                            </td>
                            <td className="col-1">{item.code}</td>
                            <td className="col-2">
                                <span>{item.bankName}</span>
                                {' - '}
                                <span>{item.bankAccount}</span>
                            </td>
                            <td className="col-1">{renderTransferAcc(item)}</td>
                            <td className={admin?.role === Role.ROLE_ADMIN ? 'col-1' : 'col-2'}>
                                {item.totalCurrentMoney > 0
                                    ? formatVnd(item.totalCurrentMoney)
                                    : formatVnd(item.totalMoney)}
                            </td>
                            <td className="col-1">
                                {item.transactionStatus === TransactionStatus.IN_PROGRESS_STAFF ? (
                                    item.staffApproveId ? (
                                        <>
                                            <div className="mb-2">
                                                {formatMessage({
                                                    id: 'PROCESSING',
                                                })}
                                            </div>
                                            {(admin?.role === Role.ROLE_ADMIN ||
                                                admin?.role === Role.ROLE_STAFF) && (
                                                <span>
                                                    <img
                                                        onClick={() => handleDeny(item.id)}
                                                        className={styles.sizeIcon}
                                                        src={ic_cancel}
                                                        alt="unchecked"
                                                        title="cancel"
                                                        style={{
                                                            marginRight: 5,
                                                            width: 17,
                                                            height: 17,
                                                        }}
                                                    />
                                                </span>
                                            )}
                                        </>
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
                                            {(admin?.role === Role.ROLE_ADMIN ||
                                                admin?.role === Role.ROLE_STAFF) &&
                                                !listAgent.find(
                                                    agent => agent.id === item.ownerId,
                                                ) && (
                                                    <>
                                                        <img
                                                            onClick={() => handleDeny(item.id)}
                                                            className={styles.sizeIcon}
                                                            src={ic_uncheck}
                                                            alt="unchecked"
                                                            style={{
                                                                marginRight: 5,
                                                                width: 17,
                                                                height: 17,
                                                            }}
                                                        />
                                                        <img
                                                            onClick={() =>
                                                                handleApprove(
                                                                    item.id,
                                                                    item.totalMoney,
                                                                    item.bankName,
                                                                )
                                                            }
                                                            src={ic_check}
                                                            alt="checked"
                                                            style={{ width: 17, height: 17 }}
                                                        />
                                                    </>
                                                )}
                                            {(admin?.role === Role.ROLE_ADMIN ||
                                                admin?.role === Role.ROLE_ACCOUNTANT) &&
                                                listAgent.find(
                                                    agent => agent.id === item.ownerId,
                                                ) && (
                                                    <>
                                                        <img
                                                            onClick={() => handleDeny(item.id)}
                                                            className={styles.sizeIcon}
                                                            src={ic_uncheck}
                                                            alt="unchecked"
                                                            style={{
                                                                marginRight: 5,
                                                                width: 17,
                                                                height: 17,
                                                            }}
                                                        />
                                                        <img
                                                            onClick={() =>
                                                                handleApprove(
                                                                    item.id,
                                                                    item.totalMoney,
                                                                    item.bankName,
                                                                )
                                                            }
                                                            src={ic_check}
                                                            alt="checked"
                                                            style={{ width: 17, height: 17 }}
                                                        />
                                                    </>
                                                )}
                                        </>
                                    )
                                ) : (
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
                            <td className="col-1">
                                {moment(item.createdAt).format(DATE_FORMAT_TRANSACTION)}
                            </td>
                            <td className="col-1">
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
                })
        );

    if (loading) {
        return <ModalLoading />;
    }

    return (
        <div className={styles.table}>
            {currentTrans.isShow && (
                <ModalApprove currentTrans={currentTrans} setCurrentTrans={setCurrentTrans} />
            )}
            <table>
                <thead>
                    <tr className="text-center">
                        <th className="col-1">{formatMessage({ id: 'MERCHANT_ORDER' })}</th>
                        <th className="col-1">{formatMessage({ id: 'MERCHANT_USERNAME' })}</th>
                        <th className="col-1">{formatMessage({ id: 'ORDER_ID' })}</th>
                        <th className="col-2">{formatMessage({ id: 'RECIPIENT_ACC' })}</th>
                        <th className="col-1">{formatMessage({ id: 'TRANSFER_ACC' })}</th>

                        <th className={admin?.role === Role.ROLE_ADMIN ? 'col-1' : 'col-2'}>
                            {formatMessage({ id: 'AMOUNT' })}
                        </th>
                        <th className="col-1">{formatMessage({ id: 'STATUS' })}</th>
                        <th className="col-1">{formatMessage({ id: 'CREATED_AT' })}</th>
                        <th className="col-1">{formatMessage({ id: 'UPDATED_AT' })}</th>
                        <th className="col-1">{formatMessage({ id: 'HANDING_AT' })}</th>
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
export default connect(({ WITHDRAW }) => ({
    withdrawStore: WITHDRAW,
}))(TableData);
