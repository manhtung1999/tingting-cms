import { Input, Modal, Select, message } from 'antd';
import { connect } from 'dva';
import React, { useState } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';
const { Option } = Select;

function ModalCreate({ dispatch, modalCreate, setModalCreate, ipStore }) {
    let { listMerchant } = ipStore;

    const [ipAddress, setIpAddress] = useState();
    const [ownerId, setOwnerId] = useState();

    const handleClose = () => {
        setModalCreate(false);
    };

    const handleSubmit = () => {
        if (!ipAddress || !ownerId) {
            message.error(formatMessage({ id: 'REQUIRE_VALUE' }));
            return;
        }
        const payload = {
            ipAddress,
            ownerId,
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
                <div style={{ marginBottom: 10 }} />
                <div className={styles.select}>
                    <label htmlFor="">{formatMessage({ id: 'MERCHANT' })}: </label> <br />
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
}))(ModalCreate);
