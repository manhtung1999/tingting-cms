import { Form, Input, Modal } from 'antd';
import { connect } from 'dva';
import React, { useState } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';

function AddInfo({ dispatch, currentManipulation, setCurrentManipulation, deviceStore }) {
    const { actionObj } = deviceStore;

    const [isModal, setIsModal] = useState(false);
    const [form] = Form.useForm();

    const handleClose = () => {
        setIsModal(false);
    };

    const handleSubmit = values => {
        let manipulations = JSON.parse(JSON.stringify(actionObj.manipulations));
        manipulations[currentManipulation.index].infos.push(values);
        const payload = {
            ...actionObj,
            manipulations,
        };

        setCurrentManipulation({
            ...currentManipulation,
            value: {
                ...currentManipulation.value,
                infos: manipulations[currentManipulation.index].infos,
            },
        });

        dispatch({ type: 'DEVICE/updateActionObj', payload });
        handleClose();
    };

    return (
        <>
            <div className={styles.addRecip}>
                <span className={styles.add} onClick={() => setIsModal(true)}>
                    +
                </span>
                <b>{formatMessage({ id: 'ADD_INFO' })}</b>
            </div>
            <Modal
                title={formatMessage({ id: 'ADD_INFO' })}
                visible={isModal}
                wrapClassName={styles.modal}
                onOk={() => form.submit()}
                onCancel={handleClose}
                destroyOnClose
            >
                <div className={styles.form}>
                    <Form layout="vertical" form={form} scrollToFirstError onFinish={handleSubmit}>
                        <Form.Item label={formatMessage({ id: 'text' })} name="text">
                            <Input className={styles.textInputLight} />
                        </Form.Item>
                        <Form.Item label={formatMessage({ id: 'viewId' })} name="viewId">
                            <Input className={styles.textInputLight} />
                        </Form.Item>
                        <Form.Item label={formatMessage({ id: 'hint' })} name="hint">
                            <Input className={styles.textInputLight} />
                        </Form.Item>
                        <Form.Item label={formatMessage({ id: 'bounds' })} name="bounds">
                            <Input className={styles.textInputLight} />
                        </Form.Item>
                        <Form.Item label={formatMessage({ id: 'description' })} name="description">
                            <Input className={styles.textInputLight} />
                        </Form.Item>
                        <Form.Item label={formatMessage({ id: 'pattern' })} name="pattern">
                            <Input className={styles.textInputLight} />
                        </Form.Item>
                        <Form.Item
                            label={formatMessage({ id: 'transactionFieldIndex' })}
                            name="transactionFieldIndex"
                        >
                            <Input className={styles.textInputLight} />
                        </Form.Item>
                        <Form.Item label={formatMessage({ id: 'parentCount' })} name="parentCount">
                            <Input className={styles.textInputLight} />
                        </Form.Item>
                        <Form.Item
                            label={formatMessage({ id: 'childIndexes' })}
                            name="childIndexes"
                        >
                            <Input className={styles.textInputLight} />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </>
    );
}
export default connect(({ DEVICE }) => ({
    deviceStore: DEVICE,
}))(AddInfo);
