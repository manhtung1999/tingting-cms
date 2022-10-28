import { Modal, Input, message } from 'antd';
import { connect } from 'dva';
import React, { useState } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';

function ModalCreate({ dispatch, modalCreate, setModalCreate }) {
    const [ipAddress, setIpAddress] = useState();

    const handleClose = () => {
        setModalCreate(false);
    };

    const handleSubmit = () => {
        if (!ipAddress) {
            message.error(formatMessage({ id: 'REQUIRE_VALUE' }));
            return;
        }
        const payload = {
            ipAddress,
        };
        dispatch({ type: 'IP_ADDRESS/addIp', payload });
        handleClose();
    };

    const _handleKeyDown = e => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };
    return (
        <Modal
            title={formatMessage({ id: 'ADD_IP_ADDRESS' })}
            visible={modalCreate}
            wrapClassName={styles.modal}
            onOk={handleSubmit}
            okText={formatMessage({ id: 'SUBMIT' })}
            onCancel={handleClose}
            destroyOnClose
        >
            <div className={styles.form}>
                <Input
                    onChange={e => setIpAddress(e.target.value)}
                    placeholder={formatMessage({ id: 'INPUT_IP_ADDRESS' })}
                    className={styles.textInputLight}
                    onKeyPress={_handleKeyDown}
                ></Input>
            </div>
        </Modal>
    );
}
export default connect(({ IP_ADDRESS }) => ({
    ipStore: IP_ADDRESS,
}))(ModalCreate);
