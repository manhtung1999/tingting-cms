import { SerialCardType } from '@/config/constant';
import { Form, Input, message, Select } from 'antd';
import Cleave from 'cleave.js/react';
import { connect } from 'dva';
import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';

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
function TopUpByTelecom({ dispatch, depositStore }) {
    const [form] = Form.useForm();
    const [amount, setAmount] = React.useState();

    const handleSubmit = values => {
        if (amount <= 0) {
            message.error(formatMessage({ id: 'REQUIRE_VALUE' }));
            return;
        }
        values.amount = amount;
        const payload = { ...values };
        dispatch({ type: 'DEPOSIT/createDepositByTelecom', payload });
    };

    const handleChangeAmount = e => {
        setAmount(Number(e.currentTarget.rawValue));
    };

    const renderCardType = SerialCardType.map(item => {
        return (
            <Option value={item.code}>
                <span>{item.name}</span>
            </Option>
        );
    });

    return (
        <div className={styles.content}>
            <div className={styles.topup}>
                <h5 className="mb-3">{formatMessage({ id: 'TOPUP_BY_TELECOM' })}</h5>
                <div className={styles.form}>
                    <Form
                        {...formItemLayout}
                        layout="vertical"
                        form={form}
                        scrollToFirstError
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            label={formatMessage({ id: 'SELECT_TELECOM' })}
                            name="telco"
                            rules={[{ required: true }]}
                        >
                            <Select style={{ minWidth: 180 }}>{renderCardType}</Select>
                        </Form.Item>

                        <Form.Item
                            label={formatMessage({ id: 'SERIAL_NUMBER' })}
                            rules={[{ required: true }]}
                            name="serial "
                            whitespace
                        >
                            <Input className={styles.textInput} />
                        </Form.Item>
                        <Form.Item
                            label={formatMessage({ id: 'PIN_CODE' })}
                            rules={[{ required: true }]}
                            name="pincode "
                            whitespace
                        >
                            <Input className={styles.textInput} />
                        </Form.Item>

                        <Form.Item
                            label={formatMessage({ id: 'AMOUNT' })}
                            name="amount"
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
}))(TopUpByTelecom);
