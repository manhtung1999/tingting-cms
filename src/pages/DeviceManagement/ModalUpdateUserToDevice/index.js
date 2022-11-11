import { Role, RoleName } from '@/config/constant';
import { Modal, Select } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';
import ModalLoading from '@/components/ModalLoading';
const { Option } = Select;

function ModalUpdateUserToDevice({ deviceStore, dispatch, currentDevice, setCurrentDevice }) {
    const { listMerchant, detailDevice } = deviceStore;

    const [deviceOfUserId, setDeviceOfUserId] = useState();

    console.log('deviceOfUserId: ', deviceOfUserId);

    useEffect(() => {
        if (detailDevice.deviceOfUserId) {
            setDeviceOfUserId(detailDevice.deviceOfUserId);
        }
    }, [detailDevice]);

    useEffect(() => {
        if (currentDevice.id && currentDevice.isShow) {
            const payload = {
                deviceId: currentDevice.id,
            };
            dispatch({ type: 'DEVICE/getDetailDevice', payload });
        }
    }, [currentDevice, dispatch]);

    // get merchant
    useEffect(() => {
        const payload = {
            role: RoleName[Role.ROLE_USER],
            deleted: false,
        };
        dispatch({ type: 'DEVICE/getMerchants', payload });
    }, [dispatch]);

    const handleClose = () => {
        setDeviceOfUserId(undefined);
        setCurrentDevice({
            ...currentDevice,
            isShow: false,
        });
    };

    const handleSubmit = () => {
        if (!deviceOfUserId) {
            return;
        }
        const payload = {
            id: currentDevice.id,
            deviceOfUserId,
            allSendMoney: -1,
            allWithdrawMoney: -1,
            dailySendMoney: -1,
            dailyWithdrawMoney: -1,
            oneTimesWithdrawMoney: -1,
            totalDailyWithdrawMoney: -1,
            withdrawMoney: -1,
        };
        dispatch({ type: 'DEVICE/updateStatus', payload });
        handleClose();
    };

    // if (!detailDevice || listMerchant.length === 0) {
    //     return <ModalLoading />;
    // }

    return (
        <Modal
            title={formatMessage({ id: 'ADD_MERCHANT_TO_DEVICE' })}
            visible={currentDevice.isShow}
            wrapClassName={styles.modal}
            onOk={handleSubmit}
            okText={formatMessage({ id: 'SUBMIT' })}
            onCancel={handleClose}
            destroyOnClose
        >
            <div className={styles.form}>
                <Select
                    style={{ minWidth: 180 }}
                    // defaultValue={detailDevice.deviceOfUserId}
                    value={deviceOfUserId}
                    onChange={value => setDeviceOfUserId(value)}
                >
                    <Option value={-2}>Xóa khách hàng</Option>

                    {listMerchant.map((item, index) => {
                        return <Option value={item.id}>{item.phone}</Option>;
                    })}
                </Select>
            </div>
        </Modal>
    );
}
export default connect(({ DEVICE }) => ({
    deviceStore: DEVICE,
}))(ModalUpdateUserToDevice);
