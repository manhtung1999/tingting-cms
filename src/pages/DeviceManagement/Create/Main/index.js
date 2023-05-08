import PageTitle from '@/components/PageTitle';
import { useUploadFile } from '@/hooks';
import { Form, Input, Select } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';
import { PaymentTypeValue } from '@/config/constant';
const { Option } = Select;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
    },
};

function CreateCard(props) {
    const { dispatch, deviceStore } = props;
    const { listPaymentType } = deviceStore;
    const [form] = Form.useForm();
    const [file, setFile] = useState();
    const [avatar] = useUploadFile(file);

    const [bankId, setBankId] = useState();

    useEffect(() => {
        dispatch({ type: 'DEVICE/getPaymentType' });
    }, [dispatch]);

    useEffect(() => {
        avatar && form.setFieldsValue({ qrImage: avatar.id });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [avatar]);

    const handleSubmit = values => {
        values.metadata = 'metadata';
        values.deviceName = 'deviceName';
        values.status = 1;
        values.dailyWithdrawMoney = 1000000;
        values.oneTimesWithdrawMoney = 100000;
        values.totalMoney = Number(values.totalMoney);

        const bank = listPaymentType.find(item => item.id === values.paymentTypeId);
        if (bank) {
            values.bankName = bank.sortNameBank;
        }
        dispatch({ type: 'DEVICE/createCard', payload: values });
    };

    return (
        <div className={styles.content}>
            <PageTitle
                title={formatMessage({ id: 'ADD_CARD' })}
                linkBack="/home/device-management"
            />
            <div className={styles.form}>
                <Form form={form} {...formItemLayout} onFinish={handleSubmit} scrollToFirstError>
                    <Form.Item
                        label={formatMessage({ id: 'DEVICE_KEY' })}
                        rules={[{ required: true }]}
                        name="deviceKey"
                        whitespace
                    >
                        <Input className={styles.textInput} />
                    </Form.Item>

                    <Form.Item
                        label={formatMessage({ id: 'ACCOUNT_HOLDER' })}
                        rules={[{ required: true }]}
                        name="username"
                        whitespace
                    >
                        <Input className={styles.textInput} />
                    </Form.Item>

                    <Form.Item
                        label={formatMessage({ id: 'ACCOUNT_NUMBER' })}
                        whitespace
                        rules={[
                            { required: true },
                            {
                                pattern: new RegExp(/\d+/g), // only number
                            },
                        ]}
                        name="numberAccount"
                    >
                        <Input className={styles.textInput} />
                    </Form.Item>

                    <Form.Item
                        label={formatMessage({ id: 'PAYMENT_TYPE' })}
                        rules={[{ required: true }]}
                        name="paymentTypeId"
                    >
                        <Select
                            style={{ minWidth: 180 }}
                            defaultValue=""
                            onChange={val => setBankId(val)}
                        >
                            {listPaymentType
                                .filter(
                                    i =>
                                        i.sortNameBank !== 'USDT' &&
                                        i.fullNameBank.substring(0, 6) === 'System',
                                )
                                .map((item, index) => {
                                    return (
                                        <Option value={item.id}>
                                            {item.fullNameBank}
                                            {' - '}
                                            <span>
                                                {formatMessage({
                                                    id: PaymentTypeValue[item.type],
                                                })}
                                            </span>
                                        </Option>
                                    );
                                })}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label={`${formatMessage({ id: 'CURRENT_BALANCE' })} (₫)`}
                        rules={[
                            { required: true },
                            {
                                pattern: new RegExp(/\d+/g), // only number
                            },
                        ]}
                        name="totalMoney"
                        whitespace
                    >
                        <Input className={styles.textInput} />
                    </Form.Item>

                    <Form.Item
                        rules={[{ required: true }]}
                        label={formatMessage({ id: 'QR_CODE' })}
                        name="qrImage"
                    >
                        {avatar && (
                            <img
                                style={{
                                    width: 150,
                                    height: 150,
                                    objectFit: 'cover',
                                    display: 'block',
                                    borderRadius: 10,
                                }}
                                src={avatar.originUrl}
                                alt="qr"
                            />
                        )}
                        <label htmlFor="avatar" className={styles.labelLogo}>
                            {formatMessage({ id: 'UPLOAD' })}
                        </label>
                        <input
                            id="avatar"
                            type="file"
                            onChange={e => setFile(e.target.files[0])}
                            className={styles.textInput}
                            accept="image/png, image/jpeg"
                        />
                    </Form.Item>

                    {listPaymentType.find(i => i.id === bankId)?.sortNameBank === 'ZaloPay' && (
                        <Form.Item
                            label={formatMessage({ id: 'ZALO_ID' })}
                            rules={[{ required: true }]}
                            name="zaloId"
                            whitespace
                        >
                            <Input className={styles.textInput} />
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

export default connect(({ DEVICE }) => ({
    deviceStore: DEVICE,
}))(CreateCard);
