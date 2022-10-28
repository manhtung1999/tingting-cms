import React, { useState, useEffect } from 'react';
import styles from './styles.scss';
import { formatMessage } from 'umi-plugin-react/locale';
import { Form, Input, Select, Modal } from 'antd';
import { connect } from 'dva';

const { Option } = Select;

function AddRecipient({ withdrawStore, dispatch }) {
    const { listPaymentType } = withdrawStore;
    const [isModal, setIsModal] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        dispatch({ type: 'WITHDRAW/getPaymentType' });
    }, [dispatch]);

    const handleSubmit = values => {
        const payload = {
            ...values,
            bankName: listPaymentType.find(item => item.id === values.paymentTypeId).sortNameBank,
        };
        console.log('payload', payload);
        dispatch({ type: 'WITHDRAW/createCardBank', payload });
        handleClose();
    };

    const handleClose = () => {
        setIsModal(false);
    };

    const key = 'sortNameBank';
    const arrayUniqueByBankName = [
        ...new Map(listPaymentType.map(item => [item[key], item])).values(),
    ];

    return (
        <>
            <div className={styles.addRecip}>
                <span className={styles.add} onClick={() => setIsModal(true)}>
                    +
                </span>
                <b>{formatMessage({ id: 'NEW_RECIPIENT' })}</b>
            </div>
            <Modal
                title={formatMessage({ id: 'SET_UP_NEW_WITHDRAW_ACCOUNT' })}
                visible={isModal}
                wrapClassName={styles.modal}
                onOk={() => form.submit()}
                onCancel={handleClose}
                destroyOnClose
            >
                <div className={styles.form}>
                    <Form layout="vertical" form={form} scrollToFirstError onFinish={handleSubmit}>
                        <Form.Item
                            label={formatMessage({ id: 'BANK_NAME' })}
                            name="paymentTypeId"
                            rules={[{ required: true }]}
                        >
                            <Select style={{ minWidth: 180 }}>
                                {arrayUniqueByBankName
                                    .filter(i => i.sortNameBank !== 'USDT')
                                    .map((item, index) => {
                                        return <Option value={item.id}>{item.sortNameBank}</Option>;
                                    })}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label={formatMessage({ id: 'ACCOUNT_HOLDER' })}
                            rules={[{ required: true }]}
                            name="username"
                        >
                            <Input className={styles.textInputLight} />
                        </Form.Item>
                        <Form.Item
                            label={formatMessage({ id: 'ACCOUNT_NUMBER' })}
                            rules={[{ required: true }]}
                            name="numberAccount"
                        >
                            <Input className={styles.textInputLight} />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </>
    );
}
export default connect(({ WITHDRAW }) => ({
    withdrawStore: WITHDRAW,
}))(AddRecipient);
