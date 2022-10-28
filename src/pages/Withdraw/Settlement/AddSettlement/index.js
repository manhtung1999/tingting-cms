import React from 'react';
import styles from './styles.scss';
import { formatMessage } from 'umi-plugin-react/locale';
import { Form } from 'antd';
export default function AddSettlement() {
    const [form] = Form.useForm();

    return (
        <div className={styles.add}>
            <h6>
                {formatMessage({ id: 'MERCHANT_BALANCE' })}: <span>0đ</span>
            </h6>
        </div>
    );
}
