import { Form, Select, message } from 'antd';
import Cleave from 'cleave.js/react';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';
import { PaymentType } from '@/config/constant';
const { Option } = Select;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 12 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
    },
};
function TopUp({ dispatch, depositStore }) {
    const { devices } = depositStore;
    const [form] = Form.useForm();
    const [amount, setAmount] = React.useState();

    useEffect(() => {
        const payload = {
            status: 'on',
        };
        dispatch({ type: 'DEPOSIT/getDevices', payload });
    }, [dispatch]);

    const handleSubmit = values => {
        if (amount <= 0) {
            message.error(formatMessage({ id: 'REQUIRE_VALUE' }));
            return;
        }
        values.totalMoney = amount;
        const payload = { ...values };
        dispatch({ type: 'DEPOSIT/createDeposit', payload });
    };

    const handleChangeAmount = e => {
        setAmount(Number(e.currentTarget.rawValue));
    };

    const renderOptions = devices
        .filter(i => i.status === 1)
        .map((item, index) => {
            return (
                <Option value={item.id}>
                    <span>
                        {item.bankName} - {item.numberAccount} - {item.username}
                    </span>
                </Option>
            );
        });

    return (
        <div className={styles.content}>
            <div className={styles.topup}>
                <h5 className="mb-3">{formatMessage({ id: 'TOPUP' })}</h5>
                <div className={styles.form}>
                    <Form
                        {...formItemLayout}
                        layout="vertical"
                        form={form}
                        scrollToFirstError
                        onFinish={handleSubmit}
                    >
                        {devices.length && (
                            <Form.Item
                                label={formatMessage({ id: 'ACCOUNT_RECEIPT' })}
                                name="mobileId"
                                rules={[{ required: true }]}
                            >
                                <Select
                                    showSearch
                                    style={{ minWidth: 180 }}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.props.children[0]
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                >
                                    {renderOptions}
                                </Select>
                            </Form.Item>
                        )}
                        <Form.Item
                            label={formatMessage({ id: 'AMOUNT' })}
                            name="totalMoney"
                            rules={[{ required: true }]}
                        >
                            <Cleave
                                className={styles.textInput}
                                placeholder="0"
                                onChange={handleChangeAmount}
                                options={{
                                    numeral: true,
                                    numeralThousandsGroupStyle: 'thousand',
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            label={formatMessage({ id: 'PAYMENT_TYPE' })}
                            name="paymentType"
                            rules={[{ required: true }]}
                        >
                            <Select style={{ minWidth: 180 }}>
                                {Object.keys(PaymentType).map((item, index) => {
                                    if (item === 'coin') {
                                        return null;
                                    }
                                    return (
                                        <Option value={index}>
                                            {formatMessage({ id: `${item}` })}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>

                        <div className="p-3 col-6 d-flex justify-content-end">
                            <button htmlType="submit" className={styles.primaryBtn}>
                                {formatMessage({ id: 'SUBMIT' })}
                            </button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}
export default connect(({ DEPOSIT }) => ({
    depositStore: DEPOSIT,
}))(TopUp);
