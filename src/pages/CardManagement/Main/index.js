import { DATE_TIME_FULL, PAGE_SIZE, TypeLockCard } from '@/config/constant';
import { Pagination, Switch } from 'antd';

import { connect } from 'dva';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'umi';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';
import { useLocalStorage } from '@/hooks';
import { ADMIN_KEY, Role } from '@/config/constant';
import { formatVnd } from '@/util/function';
import Loading from '@/components/Loading';
import EmptyComponent from '@/components/EmptyComponent';

function CardManagement(props) {
    let { dispatch, cardStore, masterStore } = props;
    let { totalRow, lockSuccess, loading } = cardStore;
    let { listPaymentType, balanceTelecom } = masterStore;
    const [pageIndex, setPageIndex] = useState(1);
    const [paymentTypes, setNewPaymentType] = useState([]);

    useEffect(() => {
        if (listPaymentType.length) {
            setNewPaymentType(listPaymentType);
        }
    }, [listPaymentType]);

    useEffect(() => {
        dispatch({ type: 'CARD_MANAGEMENT/getPaymentType' });
    }, [dispatch, lockSuccess]);

    const onChangeLockDepositCard = (locked, id, currentType) => {
        let typeLock;

        if (locked) {
            if (currentType === TypeLockCard.CLOSE_WITHDRAW_MONEY) {
                typeLock = TypeLockCard.CLOSE_ALL;
            } else {
                typeLock = TypeLockCard.CLOSE_SEND_MONEY;
            }
        } else {
            if (currentType === TypeLockCard.CLOSE_ALL) {
                typeLock = TypeLockCard.CLOSE_WITHDRAW_MONEY;
            } else {
                typeLock = TypeLockCard.OPEN;
            }
        }
        const payload = {
            id,
            statusPayment: typeLock,
        };
        dispatch({ type: 'CARD_MANAGEMENT/lockCard', payload });
        const newPaymentType = paymentTypes.map((i, index) => {
            if (i.id === id) {
                i.statusPayment = typeLock;
            }
            return i;
        });
        setNewPaymentType(newPaymentType);
    };

    const onChangeLockWithdrawCard = (locked, id, currentType) => {
        let typeLock;

        if (locked) {
            if (currentType === TypeLockCard.CLOSE_SEND_MONEY) {
                typeLock = TypeLockCard.CLOSE_ALL;
            } else {
                typeLock = TypeLockCard.CLOSE_WITHDRAW_MONEY;
            }
        } else {
            if (currentType === TypeLockCard.CLOSE_ALL) {
                typeLock = TypeLockCard.CLOSE_SEND_MONEY;
            } else {
                typeLock = TypeLockCard.OPEN;
            }
        }
        const payload = {
            id,
            statusPayment: typeLock,
        };
        dispatch({ type: 'CARD_MANAGEMENT/lockCard', payload });
        const newPaymentType = paymentTypes.map((i, index) => {
            if (i.id === id) {
                i.statusPayment = typeLock;
            }
            return i;
        });
        setNewPaymentType(newPaymentType);
    };

    const listPaymentTypeByCard = listPaymentType.length > 5 ? listPaymentType.slice(0, 4) : [];
    const renderDataCard = loading ? (
        <Loading />
    ) : listPaymentTypeByCard.length === 0 ? (
        <EmptyComponent />
    ) : (
        listPaymentTypeByCard.map((value, index) => {
            const isLockDeposit =
                value.statusPayment === 'CLOSE_ALL' || value.statusPayment === 'CLOSE_SEND_MONEY';
            if (value.id === 65) {
                console.log({ isLockDeposit });
            }
            const isLockWithdraw =
                value.statusPayment === 'CLOSE_ALL' ||
                value.statusPayment === 'CLOSE_WITHDRAW_MONEY';
            const isLockAll = value.statusPayment === 'CLOSE_ALL';
            return (
                <tr className="row text-center" key={(value, index)}>
                    <td className="col-3">{value.id}</td>
                    <td className="col-3">{value.sortNameBank}</td>
                    <td className="col-3">{moment(value.createdAt).format(DATE_TIME_FULL)}</td>
                    <td className="col-3">
                        <div>
                            <div>
                                <span>{formatMessage({ id: 'LOCK_CARD_DEPOSIT' })}: </span>
                                <Switch
                                    checked={isLockDeposit}
                                    onChange={locked =>
                                        onChangeLockDepositCard(
                                            locked,
                                            value.id,
                                            value.statusPayment,
                                        )
                                    }
                                />
                            </div>
                            <div className="my-3">
                                <span>{formatMessage({ id: 'LOCK_CARD_WITHDRAW' })}: </span>
                                <Switch
                                    checked={isLockWithdraw}
                                    onChange={locked =>
                                        onChangeLockWithdrawCard(
                                            locked,
                                            value.id,
                                            value.statusPayment,
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </td>
                </tr>
            );
        })
    );
    const [admin] = useLocalStorage(ADMIN_KEY);

    return (
        <div className={styles.content}>
            <div className={styles.header}>
                <div className="px-3 w-100 d-flex justify-content-between align-items-center">
                    <h3>{formatMessage({ id: 'CARD_MANAGEMENT' })}</h3>
                    <div className={styles.money}>
                        {(admin?.role === Role.ROLE_ADMIN ||
                            admin?.role === Role.ROLE_ACCOUNTANT ||
                            admin?.role === Role.ROLE_STAFF) && (
                            <div className={styles.balance}>
                                <span>{formatMessage({ id: 'BALANCE_TELECOM' })}: </span>
                                <span>{balanceTelecom && formatVnd(balanceTelecom)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.table}>
                <table>
                    <thead>
                        <tr className="text-center">
                            <th className="col-3"> {formatMessage({ id: 'ID' })}</th>
                            <th className="col-3"> {formatMessage({ id: 'NAME' })}</th>
                            <th className="col-3">{formatMessage({ id: 'CREATED_AT' })}</th>
                            <th className="col-3">{formatMessage({ id: 'ACTION' })}</th>
                        </tr>
                    </thead>
                    <tbody>{renderDataCard}</tbody>
                </table>

                <div className={styles.pagination}>
                    <Pagination
                        onChange={page => setPageIndex(page)}
                        defaultCurrent={pageIndex}
                        current={pageIndex}
                        size="small"
                        total={totalRow}
                        pageSize={PAGE_SIZE}
                    />
                </div>
            </div>
        </div>
    );
}

export default connect(({ CARD_MANAGEMENT, MASTERDATA }) => ({
    cardStore: CARD_MANAGEMENT,
    masterStore: MASTERDATA,
}))(withRouter(CardManagement));
