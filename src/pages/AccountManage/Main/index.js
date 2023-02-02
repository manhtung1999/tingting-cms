import ic_agent from '@/assets/image/ic_agent.png';
import ic_delete from '@/assets/image/ic_delete.svg';
import ic_edit from '@/assets/image/ic_edit.svg';
import ic_eye from '@/assets/image/ic_eye.svg';
import EmptyComponent from '@/components/EmptyComponent';
import Loading from '@/components/Loading';
import {
    ADMIN_KEY,
    DATE_FILTER,
    DATE_TIME,
    PAGE_SIZE,
    Role,
    RoleName,
    TypeLock,
    Lock,
} from '@/config/constant';
import { useLocalStorage } from '@/hooks';
import { formatVnd } from '@/util/function';
import { DatePicker, Input, Modal, Pagination, Switch } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { router, withRouter } from 'umi';
import { formatMessage } from 'umi-plugin-react/locale';
import ModalSecret from '../ModalSecret';
import ModalUpdateStaff from '../ModalUpdateStaff';
import ModalAddAgent from '../ModalAddAgent';
import styles from './styles.scss';
import ModalUpdateBalance from '../ModalUpdateBalance';

const { RangePicker } = DatePicker;

const { confirm } = Modal;

function AccountManage(props) {
    let { dispatch, accountStore } = props;
    let {
        accounts,
        totalRow,
        loading,
        deleteResponse,
        updateResponse,
        listSecret,
        lockResponse,
        isLockAll,
    } = accountStore;
    const [admin] = useLocalStorage(ADMIN_KEY);
    const [pageIndex, setPageIndex] = useState(1);
    const [showSecret, setShowSecret] = useState(false);
    const [name, setName] = useState();
    const [rangeTime, setRangeTime] = useState([]);
    const [currentStaff, setCurrentStaff] = useState({
        isShow: false,
        id: undefined,
        currentMoney: undefined,
    });

    const [currentAddAgent, setCurrentAddAgent] = useState({
        isShow: false,
        id: undefined,
    });

    const [currentAgent, setCurrentAgent] = useState({
        isShow: false,
        id: undefined,
    });
    const [role, setRole] = useState(RoleName[Role.ROLE_USER]);

    // check lock all user status
    useEffect(() => {
        dispatch({ type: 'ACCOUNT/checkLockAll' });
    }, [dispatch, lockResponse]);

    useEffect(() => {
        let payload = {
            page: pageIndex - 1,
            phone: name,
            role: role,
            deleted: false,
            timeStart: rangeTime?.[0],
            timeEnd: rangeTime?.[1],
        };

        if (admin?.role === Role.ROLE_ACCOUNTANT || admin?.role === Role.ROLE_STAFF) {
            payload.role = 'ROLE_USER';
        }
        dispatch({ type: 'ACCOUNT/getAccounts', payload });
    }, [
        admin,
        pageIndex,
        name,
        role,
        deleteResponse,
        updateResponse,
        rangeTime,
        dispatch,
        lockResponse,
    ]);

    const goToCreate = () => {
        router.push('/home/create-account');
    };

    const deleteAccount = useCallback(
        payload => {
            dispatch({ type: 'ACCOUNT/deleteAccount', payload });
        },
        [dispatch],
    );

    const handleDelete = accountId => {
        confirm({
            title: formatMessage({ id: 'ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_ACCOUNT' }),
            onOk: () => {
                deleteAccount({ id: accountId });
            },
            onCancel: () => {},
        });
    };

    const handleEdit = (id, currentMoney) => {
        if (role === RoleName[Role.ROLE_USER]) {
            setCurrentStaff({
                isShow: true,
                id,
                currentMoney,
            });
        } else {
            setCurrentAgent({
                isShow: true,
                id,
            });
        }
    };

    const handleAddAgent = id => {
        setCurrentAddAgent({
            isShow: true,
            id,
        });
    };

    const handleGetSecret = userId => {
        const payload = {
            userId,
        };

        dispatch({ type: 'ACCOUNT/getSercret', payload });
        setShowSecret(true);
    };

    let initialValue = 0;
    let allBalance =
        accounts.length &&
        accounts.reduce(function(accumulator, curValue) {
            return accumulator + curValue.totalMoney;
        }, initialValue);

    function disabledDate(current) {
        // Can not select days after today and today
        return current && current > moment().endOf('day');
    }

    const onChangeLockAll = locked => {
        const payload = {
            lockUser: locked ? Lock.YES : Lock.NO,
            typeLock: TypeLock.ALL,
        };
        dispatch({ type: 'ACCOUNT/lockUser', payload });
    };

    const onChangeLockUser = (locked, id) => {
        const payload = {
            id,
            lockUser: locked ? Lock.YES : Lock.NO,
            typeLock: TypeLock.ONE,
        };
        dispatch({ type: 'ACCOUNT/lockUser', payload });
    };

    const renderDataUsers = loading ? (
        <Loading />
    ) : accounts.length === 0 ? (
        <EmptyComponent />
    ) : (
        accounts.map((value, index) => (
            <tr className="row text-center" key={(value, index)}>
                <td
                    className={
                        role !== RoleName[Role.ROLE_USER] && role !== RoleName[Role.ROLE_AGENT]
                            ? 'col-2'
                            : 'col-1'
                    }
                >
                    {value.id}
                </td>
                <td
                    className={
                        role !== RoleName[Role.ROLE_USER] && role !== RoleName[Role.ROLE_AGENT]
                            ? 'col-3'
                            : 'col-2'
                    }
                >
                    {value.phone}
                </td>
                <td className={admin?.role === Role.ROLE_ADMIN ? 'col-2' : 'col-3'}>
                    {value.email}
                </td>
                {(role === RoleName[Role.ROLE_USER] || role === RoleName[Role.ROLE_AGENT]) && (
                    <td className={admin?.role === Role.ROLE_ADMIN ? 'col-2' : 'col-3'}>
                        {formatVnd(value.totalMoney)}
                    </td>
                )}

                <td className="col-3">{moment(value.createdAt).format(DATE_TIME)}</td>
                <td
                    className="col-2 d-flex"
                    style={{ justifyContent: 'space-evenly', alignItems: 'center' }}
                >
                    {/* ON-OFF lock user */}
                    {role === RoleName[Role.ROLE_USER] &&
                        (admin?.role === Role.ROLE_ADMIN ||
                            admin?.role === Role.ROLE_ACCOUNTANT) && (
                            <>
                                <span>Lock: </span>
                                <Switch
                                    size="small"
                                    title="Lock"
                                    checked={value.lockUser === 'YES'}
                                    onChange={checked => onChangeLockUser(checked, value.id)}
                                />
                            </>
                        )}

                    {(role === RoleName[Role.ROLE_USER] || role === RoleName[Role.ROLE_ADMIN]) &&
                        admin?.role === Role.ROLE_ADMIN && (
                            <>
                                <img
                                    className={styles.sizeIcon}
                                    src={ic_edit}
                                    onClick={() => handleEdit(value.id, value.totalMoney)}
                                    alt="Edit"
                                />
                                <img
                                    className={styles.sizeIcon}
                                    src={ic_eye}
                                    onClick={() => handleGetSecret(value.id)}
                                    alt="secret"
                                />
                            </>
                        )}

                    {/* edit số dư đại lý */}
                    {role === RoleName[Role.ROLE_AGENT] && admin?.role === Role.ROLE_ADMIN && (
                        <ModalUpdateBalance id={value.id} currentMoney={value.currentMoney} />
                    )}
                    {admin?.role === Role.ROLE_ADMIN && (
                        <>
                            <img
                                style={{ marginLeft: 10 }}
                                className={styles.sizeIcon}
                                src={ic_delete}
                                onClick={() => handleDelete(value.id)}
                                alt="Delete"
                            />
                            {role === RoleName[Role.ROLE_USER] && !value.parentId && (
                                <img
                                    className={styles.sizeIcon}
                                    src={ic_agent}
                                    onClick={() => handleAddAgent(value.id)}
                                    alt="Thêm đại lý"
                                    title="Thêm đại lý"
                                />
                            )}
                        </>
                    )}
                </td>
            </tr>
        ))
    );

    return (
        <div className={styles.content}>
            {currentStaff.isShow && (
                <ModalUpdateStaff currentStaff={currentStaff} setCurrentStaff={setCurrentStaff} />
            )}

            {currentAddAgent.isShow && (
                <ModalAddAgent
                    currentAddAgent={currentAddAgent}
                    setCurrentAddAgent={setCurrentAddAgent}
                />
            )}

            {currentAgent.isShow && (
                <ModalUpdateBalance id={currentAgent.id} currentMoney={currentAgent.currentMoney} />
            )}

            {showSecret && (
                <ModalSecret
                    listSecret={listSecret}
                    showSecret={showSecret}
                    setShowSecret={setShowSecret}
                />
            )}

            <div className={styles.header}>
                <div className={styles.filterByRole}>
                    {admin?.role === Role.ROLE_ADMIN && (
                        <>
                            <span
                                className={
                                    role === RoleName[Role.ROLE_USER]
                                        ? styles.activeRole
                                        : styles.role
                                }
                                onClick={() => setRole(RoleName[Role.ROLE_USER])}
                            >
                                {formatMessage({ id: 'ROLE_USER' })}
                            </span>
                            <span
                                className={
                                    role === RoleName[Role.ROLE_STAFF]
                                        ? styles.activeRole
                                        : styles.role
                                }
                                onClick={() => setRole(RoleName[Role.ROLE_STAFF])}
                            >
                                {formatMessage({ id: 'ROLE_STAFF' })}
                            </span>
                            <span
                                className={
                                    role === RoleName[Role.ROLE_ACCOUNTANT]
                                        ? styles.activeRole
                                        : styles.role
                                }
                                onClick={() => setRole(RoleName[Role.ROLE_ACCOUNTANT])}
                            >
                                {formatMessage({ id: 'ROLE_ACCOUNTANT' })}
                            </span>

                            <span
                                className={
                                    role === RoleName[Role.ROLE_AGENT]
                                        ? styles.activeRole
                                        : styles.role
                                }
                                onClick={() => setRole(RoleName[Role.ROLE_AGENT])}
                            >
                                {formatMessage({ id: 'ROLE_AGENT' })}
                            </span>

                            <span onClick={() => router.push('/home/history-edit')}>
                                {formatMessage({ id: 'HISTORY_EDIT_BALANCE' })}
                            </span>
                        </>
                    )}
                </div>
                <div className={styles.datePicker}>
                    <label className="me-2">{formatMessage({ id: 'TIME' })}: </label>
                    <RangePicker
                        format={DATE_FILTER}
                        disabledDate={disabledDate}
                        onChange={(dates, dateStrings) => setRangeTime(dateStrings)}
                    />
                </div>
            </div>
            <div className={styles.pageFilter}>
                <div style={{ height: 40 }}>
                    <div className="mb-1">{formatMessage({ id: 'NAME' })}:</div>
                    <Input onChange={e => setName(e.target.value)} className={styles.textInput} />
                </div>
                <div className="d-flex align-items-center">
                    {/* ON-OFF user */}
                    {(admin?.role === Role.ROLE_ADMIN || admin?.role === Role.ROLE_ACCOUNTANT) &&
                        role === RoleName[Role.ROLE_USER] && (
                            <div>
                                <span>LOCK ALL: </span>
                                <Switch checked={isLockAll} onChange={onChangeLockAll} />
                            </div>
                        )}
                    {/* END ON-OFF USER */}
                    {admin?.role === Role.ROLE_ADMIN && (
                        <div style={{ height: 40, marginLeft: 30 }}>
                            <button className={styles.primaryBtn} onClick={goToCreate}>
                                {formatMessage({ id: 'ADD_ACCOUNT' })}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.table}>
                <table>
                    <thead>
                        <tr className="text-center">
                            <th
                                className={
                                    role !== RoleName[Role.ROLE_USER] &&
                                    role !== RoleName[Role.ROLE_AGENT]
                                        ? 'col-2'
                                        : 'col-1'
                                }
                            >
                                ID
                            </th>
                            <th
                                className={
                                    role !== RoleName[Role.ROLE_USER] &&
                                    role !== RoleName[Role.ROLE_AGENT]
                                        ? 'col-3'
                                        : 'col-2'
                                }
                            >
                                {' '}
                                {formatMessage({ id: 'USERNAME' })}
                            </th>
                            <th className={admin?.role === Role.ROLE_ADMIN ? 'col-2' : 'col-3'}>
                                {formatMessage({ id: 'EMAIL' })}
                            </th>

                            {role === RoleName[Role.ROLE_USER] && (
                                <th className={admin?.role === Role.ROLE_ADMIN ? 'col-2' : 'col-3'}>
                                    {formatMessage({ id: 'BALANCE' })}
                                </th>
                            )}
                            {role === RoleName[Role.ROLE_AGENT] && (
                                <th className="col-2">{formatMessage({ id: 'BALANCE' })}</th>
                            )}
                            <th className="col-3">{formatMessage({ id: 'CREATED_AT' })}</th>
                            {admin?.role === Role.ROLE_ADMIN && (
                                <th className="col-2">{formatMessage({ id: 'ACTION' })}</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {(role === RoleName[Role.ROLE_USER] ||
                            role === RoleName[Role.ROLE_AGENT]) && (
                            <tr className="row text-center">
                                <div style={{ fontWeight: 'bold' }}>
                                    <span className="me-2">
                                        {formatMessage({ id: 'TOTAL_BALANCE' })}:
                                    </span>
                                    {formatVnd(allBalance)}
                                </div>
                            </tr>
                        )}
                        {renderDataUsers}
                    </tbody>
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

export default connect(({ ACCOUNT }) => ({
    accountStore: ACCOUNT,
}))(withRouter(AccountManage));
