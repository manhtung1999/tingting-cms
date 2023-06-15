import EmptyComponent from '@/components/EmptyComponent';
import ModalLoading from '@/components/ModalLoading';
import {
    ADMIN_KEY,
    DATE_FORMAT_TRANSACTION,
    PAGE_SIZE,
    Role,
    TIEN_KHONG_RO_NGUON,
    TransactionStatus,
    TransactionStatusValue,
} from '@/config/constant';
import { useLocalStorage } from '@/hooks';
import { formatVnd } from '@/util/function';
import { Modal, Pagination, Input, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import React, { useState } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';
import ic_cancel from '@/assets/image/ic_cancel.png';
import ic_call from '@/assets/image/ic_call.png';
import ic_uncheck from '@/assets/image/ic_uncheck.svg';
import ic_check from '@/assets/image/ic_check.svg';
import ModalApprove from '../../../Withdraw/ListWithdraw/ModalApprove';
import md5 from 'md5';
import config from '@/config/index';

const { confirm } = Modal;

function TableData({ dispatch, internalStore, pageIndex, setPageIndex }) {
    const { listWithdraw, totalRow, loading, devices } = internalStore;
    const [admin] = useLocalStorage(ADMIN_KEY);
    const [currentTrans, setCurrentTrans] = useState({
        id: undefined,
        isShow: false,
        amout: undefined,
        bankName: undefined,
        ownerId: undefined,
    });
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
                if (!reason || reason?.trim() === '') {
                    message.error(formatMessage({ id: 'REQUIRE_VALUE' }));
                    return;
                }
                const payload = { id, reason };
                dispatch({ type: 'INTERNAL_TRANSFER/denyTransaction', payload });
            },
            onCancel: () => {},
        });
    };

    const handleApprove = (id, amount, bankName, ownerId) => {
        setCurrentTrans({
            id,
            isShow: true,
            amount,
            bankName,
            ownerId,
        });
    };

    const handleAppConfirm = item => {
        if (devices.length === 0) {
            message.info(formatMessage({ id: 'PLEASE_WAIT_GET_DEVICE_SUCCESS' }));
            return;
        }
        const deviceKey = devices.find(device => device.id === item.mobileId)?.deviceKey;
        if (!deviceKey) {
            message.error('Không có device rút.');
            return;
        }
        confirm({
            title: formatMessage({ id: 'ARE_YOU_SURE_YOU_WANT_TO_APP_CONFIRM_THIS_TRANSACTION' }),
            content: <div></div>,
            onOk: () => {
                const payload = {
                    code: item.orderUsername,
                    currentMoney: item.totalMoney,
                    type: 1,
                    deviceKey,
                    md5: md5(
                        `${deviceKey}-${item.orderUsername}-${item.totalMoney}-${config.PRIVATE_KEY_MD5}`,
                    ),
                };
                dispatch({ type: 'WITHDRAW/appConfirmMoney', payload });
            },
            onCancel: () => {},
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
            listWithdraw
                .filter(i => i.transactionName !== TIEN_KHONG_RO_NGUON)
                .map((item, index) => {
                    return (
                        <tr className="text-center" key={index}>
                            <td className="col-2">{item.code}</td>
                            <td className="col-2">
                                <span>{item.bankName}</span>
                                {' - '}
                                <span>{item.bankAccount}</span>
                                {' - '}
                                <span>{item.bankUsername}</span>
                            </td>
                            <td className="col-2">{renderTransferAcc(item)}</td>
                            <td className={admin?.role === Role.ROLE_ADMIN ? 'col-1' : 'col-2'}>
                                {item.totalCurrentMoney > 0
                                    ? formatVnd(item.totalCurrentMoney)
                                    : formatVnd(item.totalMoney)}
                            </td>
                            <td className="col-1">
                                {item.transactionStatus === TransactionStatus.IN_PROGRESS_STAFF ? (
                                    <>
                                        {item.staffApproveId ? (
                                            <>
                                                <div className="mb-2">
                                                    {formatMessage({
                                                        id: 'PROCESSING',
                                                    })}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="mb-2">
                                                {formatMessage({
                                                    id:
                                                        TransactionStatusValue[
                                                            item.transactionStatus
                                                        ],
                                                })}
                                            </div>
                                        )}
                                        {moment().diff(moment(item.createdAt), 'minutes') > 15 && (
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

                                        {/* app confirm đơn update 09/12/2022 */}
                                        {(admin?.role === Role.ROLE_ADMIN ||
                                            admin?.role === Role.ROLE_ACCOUNTANT) && (
                                            <img
                                                onClick={() => handleAppConfirm(item)}
                                                src={ic_call}
                                                alt="app confirm"
                                                style={{ width: 17, height: 17 }}
                                            />
                                        )}
                                    </>
                                ) : item.transactionStatus >= TransactionStatus.DEVICE_RECEIVING ? (
                                    item.staffApproveId ? (
                                        // device nhận lệnh sau khi duyệt lại 1 lần nữa
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
                                            {/* app confirm đơn update 09/12/2022 */}
                                            {(admin?.role === Role.ROLE_ADMIN ||
                                                admin?.role === Role.ROLE_ACCOUNTANT) && (
                                                <img
                                                    onClick={() => handleAppConfirm(item)}
                                                    src={ic_call}
                                                    alt="app confirm"
                                                    style={{ width: 19, height: 19 }}
                                                />
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
                                            {/* chỉ admin và nhân viên mới được duyệt */}
                                            {(admin?.role === Role.ROLE_ADMIN ||
                                                admin?.role === Role.ROLE_STAFF) && (
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
                                                                item.ownerId,
                                                            )
                                                        }
                                                        src={ic_check}
                                                        alt="checked"
                                                        style={{ width: 17, height: 17 }}
                                                    />
                                                </>
                                            )}

                                            {/* confirm đơn của đại lý */}
                                            {(admin?.role === Role.ROLE_ADMIN ||
                                                admin?.role === Role.ROLE_ACCOUNTANT) && (
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
                                                                item.ownerId,
                                                            )
                                                        }
                                                        src={ic_check}
                                                        alt="checked"
                                                        style={{ width: 17, height: 17 }}
                                                    />
                                                </>
                                            )}

                                            {/* app confirm đơn update 09/12/2022
                                            {(admin?.role === Role.ROLE_ADMIN ||
                                                admin?.role === Role.ROLE_ACCOUNTANT) &&
                                                item.paymentType !== PaymentTypeAll.card && (
                                                    <img
                                                        onClick={() => handleAppConfirm(item)}
                                                        src={ic_call}
                                                        alt="app confirm"
                                                        style={{
                                                            width: 17,
                                                            height: 17,
                                                            marginLeft: 5,
                                                        }}
                                                    />
                                                )} */}
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
                            <td className="col-2">
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
                        <th className="col-2">{formatMessage({ id: 'ORDER_ID' })}</th>
                        <th className="col-2">{formatMessage({ id: 'RECIPIENT_ACC' })}</th>
                        <th className="col-2">{formatMessage({ id: 'TRANSFER_ACC' })}</th>
                        <th className={admin?.role === Role.ROLE_ADMIN ? 'col-1' : 'col-2'}>
                            {formatMessage({ id: 'AMOUNT' })}
                        </th>
                        <th className="col-1">{formatMessage({ id: 'STATUS' })}</th>
                        <th className="col-1">{formatMessage({ id: 'CREATED_AT' })}</th>
                        <th className="col-1">{formatMessage({ id: 'UPDATED_AT' })}</th>
                        <th className="col-2">{formatMessage({ id: 'HANDING_AT' })}</th>d */}
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
export default connect(({ INTERNAL_TRANSFER }) => ({
    internalStore: INTERNAL_TRANSFER,
}))(TableData);
