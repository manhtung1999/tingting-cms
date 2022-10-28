import { Form, Modal, Select } from 'antd';
import Cleave from 'cleave.js/react';
import { connect } from 'dva';
import React, { useState } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { FillTextType, ManipulationType, ScrollDirection } from '../../Main/enum';
import styles from './styles.scss';

const { Option } = Select;
function AddManipulation({ dispatch, currentManipulation, setCurrentManipulation, deviceStore }) {
    const { actionObj } = deviceStore;

    const [isModal, setIsModal] = useState(false);
    const [form] = Form.useForm();

    const handleClose = () => {
        setIsModal(false);
    };

    const handleSubmit = values => {
        let manipulations = JSON.parse(JSON.stringify(actionObj.manipulations));
        values.delay = Number(values.delay);
        manipulations.push(values);

        const payload = {
            ...actionObj,
            manipulations,
        };
        dispatch({ type: 'DEVICE/updateActionObj', payload });
        handleClose();
    };

    return (
        <>
            <div className={styles.addRecip}>
                <span className={styles.add} onClick={() => setIsModal(true)}>
                    +
                </span>
                <b>{formatMessage({ id: 'ADD' })}</b>
            </div>
            <Modal
                title={formatMessage({ id: 'ADD_MANIPULATION' })}
                visible={isModal}
                wrapClassName={styles.modal}
                onOk={() => form.submit()}
                onCancel={handleClose}
                destroyOnClose
            >
                <div className={styles.form}>
                    <Form layout="vertical" form={form} scrollToFirstError onFinish={handleSubmit}>
                        <Form.Item
                            label={formatMessage({ id: 'MANIPULATIONT_TYPE' })}
                            name="manipulationType"
                        >
                            <Select style={{ minWidth: 180 }}>
                                {ManipulationType.map(item => (
                                    <Option value={item}>{item}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label={formatMessage({ id: 'DELAY' })} name="delay">
                            <Cleave
                                className={styles.textInputLight}
                                options={{
                                    numeral: true,
                                    numeralThousandsGroupStyle: 'thousand',
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label={formatMessage({ id: 'FILL_TEXT_TYPE' })}
                            name="fillTextType"
                        >
                            <Select style={{ minWidth: 180 }}>
                                {FillTextType.map(item => (
                                    <Option value={item}>{item}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label={formatMessage({ id: 'SCROLL_DIRECTION' })}
                            name="scrollDirection"
                        >
                            <Select style={{ minWidth: 180 }}>
                                {ScrollDirection.map(item => (
                                    <Option value={item}>{item}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </>
    );
}
export default connect(({ DEVICE }) => ({
    deviceStore: DEVICE,
}))(AddManipulation);
