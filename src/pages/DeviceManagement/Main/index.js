import ic_delete from '@/assets/image/ic_delete.svg';
import ic_edit from '@/assets/image/ic_edit.svg';
import ic_refresh from '@/assets/image/ic_refresh.png';
import ic_agent from '@/assets/image/ic_agent.png';
import EmptyComponent from '@/components/EmptyComponent';
import { ADMIN_KEY, DeviceStatus, PAGE_SIZE } from '@/config/constant';
import { useLocalStorage } from '@/hooks';
import { Input, Modal, Pagination, Select } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { router, withRouter } from 'umi';
import { formatMessage } from 'umi-plugin-react/locale';
import { DeviceStatusValue, Role } from '../../../config/constant';
import { formatVnd } from '../../../util/function';
import ModalUpdateDailyWithdraw from '../ModalUpdateDailyWithdraw';
import ModalUpdateStatus from '../ModalUpdateStatus';
import styles from './styles.scss';
import ModalLoading from '@/components/ModalLoading';
import ModalUpdateUserToDevice from '../ModalUpdateUserToDevice';
const { confirm } = Modal;
const { Option } = Select;

function DeviceManagement(props) {
    let { dispatch, deviceStore } = props;
    let { devices, totalRow, updateSuccess, deleteSuccess, listPaymentType, loading } = deviceStore;
    const [admin] = useLocalStorage(ADMIN_KEY);
    const [pageIndex, setPageIndex] = useState(1);
    const [paymentTypeId, setPaymentTypeId] = useState();
    const [username, setUsername] = useState();
    const [accountNumber, setAccountNumber] = useState();
    const [status, setStatus] = useState();
    const [currentUpdate, setCurrentUpdate] = useState({
        showStatus: false,
        id: undefined,
        status: undefined,
    });
    const [currentWithdraw, setCurrentWithdraw] = useState({
        showWithdraw: false,
        id: undefined,
        dailyWithdrawMoney: undefined,
    });

    const [currentDevice, setCurrentDevice] = useState({
        isShow: false,
        id: undefined,
    });

    useEffect(() => {
        dispatch({ type: 'DEVICE/getPaymentType' });
    }, [dispatch]);

    let initialValue = 0;
    let allBalance =
        devices.length &&
        devices.reduce(function(accumulator, curValue) {
            return accumulator + curValue.totalMoney;
        }, initialValue);

    useEffect(() => {
        let payload = {
            page: pageIndex - 1,
            accountNumber,
            status,
            username,
            paymentTypeId,
        };
        dispatch({ type: 'DEVICE/getDevices', payload });
    }, [
        pageIndex,
        accountNumber,
        username,
        status,
        paymentTypeId,
        dispatch,
        updateSuccess,
        deleteSuccess,
    ]);

    const handleDelete = deviceId => {
        confirm({
            title: formatMessage({ id: 'ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_DEVICE' }),
            onOk: () => {
                const payload = { id: deviceId };
                dispatch({ type: 'DEVICE/deleteDevice', payload });
            },
            onCancel: () => {},
        });
    };

    const renderDataUsers = loading ? (
        <ModalLoading />
    ) : devices.length === 0 ? (
        <EmptyComponent />
    ) : (
        devices.map((value, index) => (
            <tr className="row text-center" key={(value, index)}>
                <td className="col-2">{value.deviceKey}</td>
                <td className={admin?.role === Role.ROLE_ADMIN ? 'col-2' : 'col-1'}>
                    {value.username}
                </td>
                <td className="col-2">
                    [{value.bankName}]{value.numberAccount}
                </td>
                <td className={`col-1 ${styles.moneyColor}`}>{formatVnd(value.totalMoney)}</td>
                <td className={`col-1 ${styles.moneyColor}`}>
                    <div>+{formatVnd(value.dailySendMoney)}</div>
                    <div>-{formatVnd(value.withdrawMoney)}</div>
                </td>
                <td className={`col-1 ${styles.moneyColor}`}>
                    <div>+{formatVnd(value.allSendMoney)}</div>
                    <div>-{formatVnd(value.allWithdrawMoney)}</div>
                </td>
                <td className={admin?.role === Role.ROLE_ADMIN ? 'col-1' : 'col-2'}>
                    {formatVnd(value.dailyWithdrawMoney)}
                    {admin?.role === Role.ROLE_ADMIN && (
                        <span
                            onClick={() =>
                                setCurrentWithdraw({
                                    showWithdraw: true,
                                    id: value.id,
                                    dailyWithdrawMoney: value.dailyWithdrawMoney,
                                })
                            }
                            style={{ marginLeft: 5, cursor: 'pointer' }}
                        >
                            <img className={styles.iconSize} src={ic_edit} alt="" />
                        </span>
                    )}
                </td>
                <td
                    className="col-1"
                    onClick={() => {
                        (admin?.role === Role.ROLE_ADMIN || admin?.role === Role.ROLE_STAFF) &&
                            setCurrentUpdate({
                                showStatus: true,
                                id: value.id,
                                status: value.status,
                            });
                    }}
                >
                    <span
                        className={
                            value.status === DeviceStatusValue.off
                                ? styles.lockedStatus
                                : value.status === DeviceStatusValue.on
                                ? styles.activeStatus
                                : styles.pauseStatus
                        }
                    >
                        {DeviceStatus[value.status] &&
                            formatMessage({ id: DeviceStatus[value.status] })}
                    </span>
                </td>

                <td className="col-1">
                    {admin?.role === Role.ROLE_ADMIN && (
                        <img
                            style={{ marginRight: 7 }}
                            onClick={() =>
                                setCurrentDevice({
                                    isShow: true,
                                    id: value.id,
                                })
                            }
                            src={ic_agent}
                            alt="ic_agent"
                            width={20}
                            height={20}
                        />
                    )}
                    <img
                        style={{ marginRight: 7 }}
                        onClick={() => refresh(value.id)}
                        src={ic_refresh}
                        alt="refresh"
                        width={20}
                        height={20}
                    />
                    {admin?.role === Role.ROLE_ADMIN && (
                        <img
                            className={styles.sizeIcon}
                            src={ic_delete}
                            onClick={() => handleDelete(value.id)}
                            alt="Delete"
                        />
                    )}
                </td>
            </tr>
        ))
    );
    const goToCreate = () => {
        router.push('/home/create-card');
    };

    const arrayUniqueByBankName = listPaymentType.filter(paymentType =>
        paymentType.fullNameBank.includes('System-'),
    );

    const refresh = id => {
        let payload = {
            id: id,
        };
        dispatch({ type: 'DEVICE/refreshDevice', payload });
    };

    const refreshAll = () => {
        dispatch({ type: 'DEVICE/refreshAll' });
    };

    return (
        <div className={styles.content}>
            {currentDevice && (
                <ModalUpdateUserToDevice
                    currentDevice={currentDevice}
                    setCurrentDevice={setCurrentDevice}
                />
            )}
            <div className={styles.header}>
                <div>
                    <h3>{formatMessage({ id: 'DEVICE_MANAGEMENT' })}</h3>
                </div>
                {admin?.role === Role.ROLE_ADMIN && (
                    <div style={{ height: 40 }}>
                        <button className={styles.primaryBtn} onClick={goToCreate}>
                            {formatMessage({ id: 'ADD_CARD' })}
                        </button>
                    </div>
                )}

                {(admin?.role === Role.ROLE_ADMIN || admin?.role === Role.ROLE_STAFF) && (
                    <div style={{ height: 40 }}>
                        <button className={styles.primaryBtn} onClick={refreshAll}>
                            {formatMessage({ id: 'REFRESH_ALL' })}
                        </button>
                    </div>
                )}
            </div>
            <div className={styles.pageFilter}>
                <div className={styles.select}>
                    <div className="mb-1"> {formatMessage({ id: 'STATUS' })}:</div>
                    <Select
                        style={{ minWidth: 180 }}
                        defaultValue=""
                        onChange={value => setStatus(value)}
                    >
                        <Option value="">{formatMessage({ id: 'ALL' })}</Option>

                        {Object.keys(DeviceStatusValue).map((item, index) => {
                            return <Option value={item}>{formatMessage({ id: `${item}` })}</Option>;
                        })}
                        <Option value="error">Error</Option>
                    </Select>
                </div>

                <div style={{ height: 40 }}>
                    <div className="mb-1">{formatMessage({ id: 'ACCOUNT_HOLDER' })}:</div>
                    <Input
                        onChange={e => setUsername(e.target.value)}
                        className={styles.textInput}
                    />
                </div>
                <div style={{ height: 40 }}>
                    <div className="mb-1">{formatMessage({ id: 'ACCOUNT_NUMBER' })}:</div>
                    <Input
                        onChange={e => setAccountNumber(e.target.value)}
                        className={styles.textInput}
                    />
                </div>
                <div style={{ height: 40 }}>
                    <div className="mb-1">{formatMessage({ id: 'BANK_NAME' })}:</div>
                    <Select
                        defaultValue={''}
                        style={{ minWidth: 180 }}
                        onChange={value => setPaymentTypeId(value)}
                    >
                        <Option value={''}>All</Option>
                        {arrayUniqueByBankName.map((item, index) => {
                            return <Option value={item.id}>{item.sortNameBank}</Option>;
                        })}
                    </Select>
                </div>
            </div>

            <div className={styles.table}>
                <table>
                    <thead>
                        <tr className="text-center">
                            <th className="col-2"> {formatMessage({ id: 'ID' })}</th>
                            <th className={admin?.role === Role.ROLE_ADMIN ? 'col-2' : 'col-1'}>
                                {' '}
                                {formatMessage({ id: 'ACCOUNT_HOLDER' })}
                            </th>
                            <th className="col-2">{formatMessage({ id: 'ACCOUNT_NUMBER' })}</th>
                            <th className="col-1">{formatMessage({ id: 'BALANCE' })}</th>
                            <th className="col-1">{formatMessage({ id: 'CUMULATIVE_TODAY' })}</th>
                            <th className="col-1">{formatMessage({ id: 'ALL_CUMULATIVE' })}</th>
                            <th className={admin?.role === Role.ROLE_ADMIN ? 'col-1' : 'col-2'}>
                                {formatMessage({ id: 'WITHDRAWAL_DAILY_LIMIT' })}
                            </th>
                            <th className="col-1">{formatMessage({ id: 'STATUS' })}</th>
                            <th className="col-1">{formatMessage({ id: 'ACTION' })}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="row text-center">
                            <div style={{ fontWeight: 'bold' }}>
                                <span className="me-2">
                                    {formatMessage({ id: 'TOTAL_BALANCE' })}:
                                </span>
                                {formatVnd(allBalance)}
                            </div>
                        </tr>
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
            <ModalUpdateStatus currentUpdate={currentUpdate} setCurrentUpdate={setCurrentUpdate} />
            {currentWithdraw.showWithdraw && (
                <ModalUpdateDailyWithdraw
                    currentWithdraw={currentWithdraw}
                    setCurrentWithdraw={setCurrentWithdraw}
                />
            )}
        </div>
    );
}

export default connect(({ DEVICE }) => ({
    deviceStore: DEVICE,
}))(withRouter(DeviceManagement));
