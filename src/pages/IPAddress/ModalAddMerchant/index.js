import { Modal, Select } from 'antd';
import { connect } from 'dva';
import React, { useState } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';
const { Option } = Select;

function ModalAddMerchant({ ipStore, dispatch, currentAddMerchant, setCurrentAddMerchant }) {
    let { listMerchant } = ipStore;

    const [ownerId, setOwnerId] = useState();

    const handleClose = () => {
        setCurrentAddMerchant({
            ...currentAddMerchant,
            isShow: false,
        });
    };

    const handleUpdate = () => {
        if (!ownerId) {
            return;
        }
        const payload = {
            id: currentAddMerchant.id,
            ipAddress: currentAddMerchant.ipAddress,
            ownerId,
        };
        dispatch({ type: 'IP_ADDRESS/updateIp', payload });
        handleClose();
    };

    return (
        <Modal
            title={formatMessage({ id: 'UPDATE' })}
            visible={currentAddMerchant.isShow}
            wrapClassName={styles.modal}
            onOk={handleUpdate}
            okText={formatMessage({ id: 'OK' })}
            onCancel={handleClose}
            destroyOnClose
        >
            <div className={styles.listSecret}>
                <div className={styles.select}>
                    <Select
                        style={{ minWidth: 180 }}
                        defaultValue=""
                        onChange={value => setOwnerId(value)}
                    >
                        {listMerchant.map((acc, index) => {
                            return (
                                <Option key={index} value={acc.id}>
                                    {acc.phone}
                                </Option>
                            );
                        })}
                    </Select>
                </div>
            </div>
        </Modal>
    );
}
export default connect(({ IP_ADDRESS }) => ({
    ipStore: IP_ADDRESS,
}))(ModalAddMerchant);
