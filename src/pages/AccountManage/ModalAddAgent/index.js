import { Modal, Select } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';
const { Option } = Select;

function ModalAddAgent({ accountStore, dispatch, currentAddAgent, setCurrentAddAgent }) {
    let { agents } = accountStore;

    const [parentId, setParentId] = useState();

    useEffect(() => {
        let payload = {
            role: 'ROLE_AGENT',
            deleted: false,
        };
        dispatch({ type: 'ACCOUNT/getAgents', payload });
    }, [dispatch]);

    const handleClose = () => {
        setCurrentAddAgent({
            ...currentAddAgent,
            isShow: false,
        });
    };

    const handleUpdate = () => {
        if (!parentId) {
            return;
        }
        const payload = {
            id: currentAddAgent.id,
            parentId: parentId,
        };
        dispatch({ type: 'ACCOUNT/updateUser', payload });
        handleClose();
    };

    return (
        <Modal
            title={formatMessage({ id: 'UPDATE_AGENT' })}
            visible={currentAddAgent.isShow}
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
                        onChange={value => setParentId(value)}
                    >
                        {agents.map((acc, index) => {
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
export default connect(({ ACCOUNT }) => ({
    accountStore: ACCOUNT,
}))(ModalAddAgent);
