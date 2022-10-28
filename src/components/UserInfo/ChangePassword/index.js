import { Form, Input, message, Modal } from 'antd';
import { connect } from 'dva';
import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';

function ChangePassword({ dispatch, isModalVisible, setIsModalVisible }) {
    const [form] = Form.useForm();
    const handleSubmit = values => {
        values.oldPass = values['oldPass'].trim();
        values.newPass = values['newPass'].trim();
        values.confirmNewPass = values['confirmNewPass'].trim();
        if (values.oldPass === values.newPass) {
            message.error(formatMessage({ id: 'NEW_PASSWORD_CANNOT_SAME_OLD_PASSWORD' }));
            return;
        }
        if (values.confirmNewPass !== values.newPass) {
            message.error(formatMessage({ id: 'CONFIRM_NEW_PASSWORD_FAIL' }));
            return;
        } else if (values.newPass.length < 6) {
            message.warning(formatMessage({ id: 'PASSWORD_CANNOT_LESS_THAN_6_CHARACTERS' }));
            return;
        }
        delete values.confirmNewPass;
        dispatch({
            type: 'MASTERDATA/changePassword',
            payload: values,
        });
        setIsModalVisible(false);
    };

    const handleClose = () => {
        setIsModalVisible(false);
    };
    const _handleKeyDown = e => {
        if (e.key === 'Enter') {
            // Get the next input field
            const nextSibling = document.querySelector(`input[name=password]`);

            // If found, focus the next field
            if (nextSibling !== null) {
                nextSibling.focus();
            }
        }
    };

    return (
        <>
            <Modal
                title={formatMessage({ id: 'CHANGE_PASSWORD' })}
                visible={isModalVisible}
                wrapClassName={styles.modal}
                onOk={() => form.submit()}
                okText={formatMessage({ id: 'SUBMIT' })}
                onCancel={handleClose}
                destroyOnClose
            >
                <div className={styles.form}>
                    <Form layout="vertical" form={form} scrollToFirstError onFinish={handleSubmit}>
                        <Form.Item
                            label={formatMessage({ id: 'OLD_PASSWORD' })}
                            name="oldPass"
                            rules={[{ required: true }]}
                            onKeyPress={_handleKeyDown}
                        >
                            <Input.Password className={styles.textInputLight}></Input.Password>
                        </Form.Item>
                        <Form.Item
                            label={formatMessage({ id: 'NEW_PASSWORD' })}
                            name="newPass"
                            rules={[{ required: true }]}
                        >
                            <Input.Password className={styles.textInputLight}></Input.Password>
                        </Form.Item>
                        <Form.Item
                            label={formatMessage({ id: 'CONFIRM_NEW_PASSWORD' })}
                            name="confirmNewPass"
                            rules={[{ required: true }]}
                        >
                            <Input.Password className={styles.textInputLight}></Input.Password>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </>
    );
}
export default connect(({ MASTERDATA }) => ({
    masterDataStore: MASTERDATA,
}))(ChangePassword);
