import ic_call from '@/assets/image/ic_call.png';
import ic_cancel from '@/assets/image/ic_cancel.png';
import ic_check from '@/assets/image/ic_check.svg';
import ic_refresh from '@/assets/image/ic_refresh.png';
import ic_uncheck from '@/assets/image/ic_uncheck.svg';
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
import { Input, message, Modal, Pagination } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import React, { useState } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import ModalApprove from '../ModalApprove';
import styles from './styles.scss';
import md5 from 'md5';
import config from '@/config/index';

const { confirm } = Modal;

function TableData({ dispatch, withdrawStore, pageIndex, setPageIndex }) {
    const { listWithdraw, totalRow, loading, listMerchant, devices, listAgent } = withdrawStore;
    const [currentTrans, setCurrentTrans] = useState({
        id: undefined,
        isShow: false,
        amout: undefined,
        bankName: undefined,
        ownerId: undefined,
    });
    const [admin] = useLocalStorage(ADMIN_KEY);

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
                dispatch({ type: 'WITHDRAW/denyTransaction', payload });
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

    const handleRefreshCard = orderCode => {
        const payload = {
            order: orderCode,
        };
        dispatch({ type: 'WITHDRAW/refreshCard', payload });
    };

    const renderTransferAcc = item => {
        if (item.mobileId) {
            const mobile = devices.find(device => device.id === item.mobileId);
            if (mobile) {
                return (
                    <>
                        <div>{mobile.bankName}-</div>
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
                            <td className="col-2">
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
                                {' - '}
                                <span>{item.bankUsername}</span>
                                <div> Request ID: {item.cardRequestId}</div>
                            </td>
                            <td className="col-1">{renderTransferAcc(item)}</td>
                            <td className={'col-1'}>
                                {item.paymentType === 5
                                    ? formatVnd(item.cardCardValue)
                                    : item.totalCurrentMoney > 0
                                    ? formatVnd(item.totalCurrentMoney)
                                    : formatVnd(item.totalMoney)}

                                {item.cardNumberCard && ` x ${item.cardNumberCard}`}
                            </td>
                            <td className="col-1">
                                {/* 
                                    Đơn đang xử lý: 
                                    + nếu nhân viên duyệt rồi thì trạng thái processing kèm nút hủy giao dịch.
                                    + nếu chưa duyệt thì thêm nút duyệt hoặc từ chối ( đối với đại lý và ko đại lý)
                                    + Update 12/05/2023: Có thêm 5 trạng thái của thiết bị
                                    + Nếu thuộc 5 trạng thái của thiết bị và có staffApproveId tức là đã duyệt lại
                                    + => cập nhật trạng thái mới nhưng các nút duyệt vẫn giống như processing.
                                */}
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
                                            {(admin?.role === Role.ROLE_ADMIN ||
                                                admin?.role === Role.ROLE_ACCOUNTANT ||
                                                // nếu đơn không phải khách hàng tạo từ cms thì mới cho phép nhân viên duyệt
                                                (item.orderCode !== item.code &&
                                                    admin?.role === Role.ROLE_STAFF)) &&
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
                                                                    item.ownerId,
                                                                )
                                                            }
                                                            src={ic_check}
                                                            alt="checked"
                                                            style={{ width: 17, height: 17 }}
                                                        />
                                                    </>
                                                )}

                                            {/* app confirm đơn update 09/12/2022 */}
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
                                                )}
                                        </>
                                    )
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
                                                                    item.ownerId,
                                                                )
                                                            }
                                                            src={ic_check}
                                                            alt="checked"
                                                            style={{ width: 17, height: 17 }}
                                                        />
                                                    </>
                                                )}

                                            {/* app confirm đơn update 09/12/2022 */}
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
                                {item.transactionStatus === 4 &&
                                    item.paymentType === PaymentTypeAll.card && (
                                        <img
                                            onClick={() => handleRefreshCard(item.orderCode)}
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
                        <th className="col-2">{formatMessage({ id: 'MERCHANT_USERNAME' })}</th>
                        <th className="col-1">{formatMessage({ id: 'ORDER_ID' })}</th>
                        <th className="col-2">{formatMessage({ id: 'RECIPIENT_ACC' })}</th>
                        <th className="col-1">{formatMessage({ id: 'TRANSFER_ACC' })}</th>

                        <th className={'col-1'}>{formatMessage({ id: 'AMOUNT' })}</th>
                        <th className="col-1">{formatMessage({ id: 'STATUS' })}</th>
                        <th className="col-1">{formatMessage({ id: 'CREATED_AT' })}</th>
                        <th className="col-1">{formatMessage({ id: 'UPDATED_AT' })}</th>
                        <th className="col-1">{formatMessage({ id: 'HANDING_AT' })}</th>
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
