import { message, Modal, Select } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';
import ModalLoading from '@/components/ModalLoading';
import { formatVnd } from '@/util/function';

function compare(a, b) {
    if (a.totalMoney < b.totalMoney) {
        return 1;
    }
    if (a.totalMoney > b.totalMoney) {
        return -1;
    }
    return 0;
}

function ModalApprove({ dispatch, currentTrans, setCurrentTrans, withdrawStore }) {
    const { devices } = withdrawStore;

    const [maxBalanceDevice, setMaxBalanceDevice] = useState();

    useEffect(() => {
        const payload = {
            status: 'on',
        };
        dispatch({ type: 'WITHDRAW/getDevices', payload });
    }, [dispatch]);

    useEffect(() => {
        if (devices.length) {
            const maxBalanceDevice = devices.sort(compare)[0];
            maxBalanceDevice && setMaxBalanceDevice(maxBalanceDevice.id);
        }
    }, [devices]);

    const handleClose = () => {
        setCurrentTrans({
            ...currentTrans,
            isShow: false,
        });
    };

    const handleSubmit = () => {
        const chooseDevice = devices.find(i => i.id === maxBalanceDevice);
        if (currentTrans.bankName === 'Momo' && chooseDevice.bankName !== 'Momo') {
            message.error(formatMessage({ id: 'CHOOSE_MOMO' }));
            return;
        }
        if (currentTrans.bankName === 'ZaloPay' && chooseDevice.bankName !== 'ZaloPay') {
            message.error(formatMessage({ id: 'CHOOSE_ZALOPAY' }));
            return;
        }

        if (currentTrans.bankName === 'VNPay' && chooseDevice.bankName !== 'VNPay') {
            message.error(formatMessage({ id: 'CHOOSE_VNPAY' }));
            return;
        }

        if (chooseDevice.totalMoney < currentTrans.amount) {
            message.error(formatMessage({ id: 'NOT_ENOUGH_BALANCE' }));
            return;
        }
        const payload = {
            id: currentTrans.id,
            mobileId: maxBalanceDevice,
        };
        dispatch({ type: 'WITHDRAW/approveTransaction', payload });
        handleClose();
    };

    if (!devices.length || !maxBalanceDevice) {
        return <ModalLoading />;
    }

    return (
        <Modal
            title={formatMessage({ id: 'APPROVE_WITHRAW_REQUEST' })}
            visible={currentTrans.isShow}
            wrapClassName={styles.modal}
            onOk={handleSubmit}
            okText={formatMessage({ id: 'SUBMIT' })}
            onCancel={handleClose}
            destroyOnClose
        >
            <div className={styles.form}>
                <div>{formatMessage({ id: 'SELECT_PAYMENT_ACCOUNT' })}:</div>
                <Select
                    defaultValue={maxBalanceDevice}
                    onChange={value => setMaxBalanceDevice(value)}
                >
                    {devices.map((item, index) => {
                        return (
                            <Select.Option key={index} value={item.id}>
                                <span>{item.bankName}</span>
                                {' - '}
                                <span>{item.numberAccount}</span>
                                {' - '}
                                <span>{formatVnd(item.totalMoney)}</span>
                            </Select.Option>
                        );
                    })}
                </Select>
            </div>
        </Modal>
    );
}
export default connect(({ WITHDRAW }) => ({
    withdrawStore: WITHDRAW,
}))(ModalApprove);
