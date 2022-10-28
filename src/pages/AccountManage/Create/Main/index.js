import PageTitle from '@/components/PageTitle';
import { Role, RoleName } from '@/config/constant';
import { Form, Input, Select } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';

const { Option } = Select;

function CreateAccount(props) {
    const { dispatch, accountStore } = props;
    const { accounts } = accountStore;
    const [form] = Form.useForm();

    const [role, setRole] = useState(Role.ROLE_USER);

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 4 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 20 },
        },
    };

    useEffect(() => {
        const payload = {
            page: 0,
            role: RoleName[Role.ROLE_AGENT],
        };
        dispatch({ type: 'ACCOUNT/getAccounts', payload });
    }, [dispatch]);

    const handleSubmit = values => {
        values.phone = values['phone'].trim();
        values.email = values['email'].trim();
        values.password = values['password'].trim();
        values.userMoneyConfig = {
            dailyWithdrawMoney: 100000,
            oneTimesWithdrawMoney: 1000,
            agentPayFeeBank: 1,
            agentPayFeeQrBank: 1,
            agentPayFeeWallet: 1,
            agentPayFeeWalletQr: 1,
            agentPayFeeUsdt: 1,
            systemPayFeeQrBank: 1,
            systemPayFeeBank: 1,
            systemPayFeeWalletQr: 1,
            systemPayFeeWallet: 1,
            systemPayFeeUsdt: 1,
            agentWithdrawFeeQrBank: 1,
            agentWithdrawFeeBank: 1,
            agentWithdrawFeeWalletQr: 1,
            agentWithdrawFeeWallet: 1,
            systemWithdrawFeeQrBank: 1,
            systemWithdrawFeeBank: 1,
            systemWithdrawFeeWalletQr: 1,
            systemWithdrawFeeWallet: 1,
        };
        console.log('values', values);
        dispatch({ type: 'ACCOUNT/createAccount', payload: values });
    };

    return (
        <div className={styles.content}>
            <PageTitle
                title={formatMessage({ id: 'ADD_ACCOUNT' })}
                linkBack="/home/account-manage"
            />
            <div className={styles.form}>
                <Form form={form} {...formItemLayout} onFinish={handleSubmit} scrollToFirstError>
                    <Form.Item
                        label={formatMessage({ id: 'USERNAME' })}
                        rules={[{ required: true }]}
                        name="phone"
                        whitespace
                    >
                        <Input className={styles.textInput} />
                    </Form.Item>

                    <Form.Item
                        label={formatMessage({ id: 'EMAIL' })}
                        whitespace
                        rules={[{ required: true }, { type: 'email' }]}
                        name="email"
                    >
                        <Input type="email" className={styles.textInput} />
                    </Form.Item>

                    <Form.Item
                        label={formatMessage({ id: 'PASSWORD' })}
                        rules={[{ required: true }]}
                        name="password"
                    >
                        <Input.Password className={styles.textInput} />
                    </Form.Item>

                    <Form.Item
                        label={formatMessage({ id: 'ROLE' })}
                        rules={[{ required: true }]}
                        name="role"
                        initialValue={Role.ROLE_USER}
                    >
                        <Select
                            style={{ minWidth: 180 }}
                            defaultValue={Role.ROLE_USER}
                            onChange={value => setRole(value)}
                        >
                            {Object.keys(Role).map((item, index) => {
                                return (
                                    <Option value={index}>
                                        {formatMessage({ id: `${item}` })}
                                    </Option>
                                );
                            })}
                        </Select>
                    </Form.Item>

                    {role === Role.ROLE_USER && (
                        <Form.Item
                            label={formatMessage({ id: 'AGENT' })}
                            name="parentId"
                            // rules={[{ required: true }]}
                        >
                            <Select style={{ minWidth: 180 }}>
                                {accounts.map(item => {
                                    return <Option value={item.id}>{item.phone}</Option>;
                                })}
                            </Select>
                        </Form.Item>
                    )}

                    <div className="d-flex justify-content-end">
                        <button htmlType="submit" className={styles.primaryBtn}>
                            {formatMessage({ id: 'SUBMIT' })}
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default connect(({ ACCOUNT }) => ({
    accountStore: ACCOUNT,
}))(CreateAccount);
