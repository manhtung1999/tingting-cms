import { message, Modal, Select } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';
import ModalLoading from '@/components/ModalLoading';
import { formatVnd } from '@/util/function';
import { DeviceStatusValue } from '@/config/constant';

function ModalApprove({ dispatch, currentTrans, setCurrentTrans, withdrawStore }) {
    const { devices } = withdrawStore;

    const [maxBalanceDevice, setMaxBalanceDevice] = useState();

    useEffect(() => {
        const payload = {
            userId: currentTrans.ownerId,
        };
        dispatch({ type: 'WITHDRAW/getDevices', payload });
    }, [dispatch]);

    const handleClose = () => {
        setCurrentTrans({
            ...currentTrans,
            isShow: false,
        });
    };

    const handleSubmit = () => {
        if (!maxBalanceDevice) {
            message.error(formatMessage({ id: 'REQUIRE_VALUE' }));
            return;
        }
        const chooseDevice = devices.find(i => i.id === maxBalanceDevice);
        if (currentTrans.bankName === 'Momo' && chooseDevice.bankName !== 'Momo') {
            message.error(formatMessage({ id: 'CHOOSE_MOMO' }));
            return;
        }
        if (currentTrans.bankName === 'ZaloPay' && chooseDevice.bankName !== 'ZaloPay') {
            message.error(formatMessage({ id: 'CHOOSE_ZALOPAY' }));
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

    if (devices.length === 0) {
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
                    style={{ minWidth: 350 }}
                    defaultValue={''}
                    onChange={value => setMaxBalanceDevice(value)}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={devices
                        .filter(device => device.status === DeviceStatusValue.on)
                        .map(item => {
                            return {
                                value: item.id,
                                label: `${item.bankName} - ${item.numberAccount} - ${
                                    item.username
                                } - ${formatVnd(item.totalMoney)}`,
                            };
                        })}
                ></Select>
            </div>
        </Modal>
    );
}
export default connect(({ WITHDRAW }) => ({
    withdrawStore: WITHDRAW,
}))(ModalApprove);
