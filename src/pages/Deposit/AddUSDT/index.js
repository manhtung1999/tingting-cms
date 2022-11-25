import { Form, message } from 'antd';
import Cleave from 'cleave.js/react';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';
import { formatVnd } from '@/util/function';
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
function AddUSDT({ dispatch, depositStore }) {
    const [form] = Form.useForm();
    const [amount, setAmount] = React.useState();

    const { listPaymentType } = depositStore;
    const [currentExchange, setCurrentExchange] = React.useState();

    useEffect(() => {
        dispatch({ type: 'DEPOSIT/getPaymentType' });
    }, [dispatch]);

    useEffect(() => {
        if (listPaymentType.length > 0) {
            const usdt = listPaymentType.find(i => i.sortNameBank === 'USDT');
            if (!usdt) {
                message.error(formatMessage({ id: 'DONT_HAVE_USDT' }));
                return;
            } else {
                setCurrentExchange(usdt.exchangeRate);
            }
        }
    }, [listPaymentType]);

    const handleSubmit = values => {
        if (amount <= 0) {
            message.error(formatMessage({ id: 'REQUIRE_VALUE' }));
            return;
        }
        values.totalMoney = amount;
        values.paymentType = 4;
        const payload = { ...values };
        dispatch({ type: 'DEPOSIT/createDeposit', payload });
    };

    const handleChangeAmount = e => {
        setAmount(Number(e.currentTarget.rawValue));
    };

    return (
        <div className={styles.content}>
            <div className={styles.topup}>
                <h5 className="mb-3">{formatMessage({ id: 'TOPUP' })}</h5>
                <h6>
                    {formatMessage({ id: 'EXCHANGE_RATE' })}: 1 USDT = {formatVnd(currentExchange)}
                </h6>
                <div className={styles.form}>
                    <Form
                        {...formItemLayout}
                        layout="vertical"
                        form={form}
                        scrollToFirstError
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            label={`${formatMessage({ id: 'AMOUNT' })}(USDT):`}
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
                                    numeralDecimalScale: 0,
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
}))(AddUSDT);
