import img_cn from '@/assets/image/img_cn.png';
import img_en from '@/assets/image/img_en.png';
import img_vn from '@/assets/image/img_vn.png';
import { ADMIN_KEY } from '@/config/constant';
import { useLocalStorage } from '@/hooks';
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Modal, Select } from 'antd';
import { connect } from 'dva';
import { memo, useState } from 'react';
import { formatMessage, getLocale, setLocale } from 'umi-plugin-react/locale';
import ChangePassword from './ChangePassword';
import styles from './style.scss';

const { Option } = Select;

function UserInfo({ dispatch, masterDataStore }) {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        Modal.confirm({
            title: formatMessage({ id: 'CONFIRM' }),
            icon: <ExclamationCircleOutlined />,
            content: formatMessage({ id: 'ARE_YOU_SURE_LOGOUT' }),
            okText: formatMessage({ id: 'OK' }),
            cancelText: formatMessage({ id: 'CANCEL' }),
            onOk: () => {
                dispatch({
                    type: 'MASTERDATA/logout',
                });
            },
        });
    };

    const [admin] = useLocalStorage(ADMIN_KEY);

    const menu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: (
                        <span onClick={() => setIsModalVisible(true)}>
                            {formatMessage({ id: 'CHANGE_PASSWORD' })}
                        </span>
                    ),
                },
                {
                    key: '2',
                    label: <span onClick={showModal}>{formatMessage({ id: 'LOG_OUT' })}</span>,
                },
            ]}
        />
    );

    return (
        <>
            <div className={styles.login}>
                <div className={styles.select}>
                    <Select
                        value={getLocale()}
                        //  defaultValue={'en-US'}
                        onChange={value => setLocale(value)}
                    >
                        <Option value="en-US">
                            <img width={30} src={img_en} alt="" />
                        </Option>
                        <Option value="vi-VN">
                            <img width={30} src={img_vn} alt="" />
                        </Option>
                        <Option value="zh-CN">
                            <img width={30} src={img_cn} alt="" />
                        </Option>
                    </Select>
                </div>
                <div className={styles.user}>
                    <div className="d-flex align-items-center">
                        <div className="me-2">
                            <Dropdown overlayClassName={styles.dropdown} overlay={menu}>
                                <div
                                    style={{
                                        padding: '4px 10px',
                                        borderRadius: '10px',
                                        border: '2px solid rgb(81 68 86)',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <span>{admin?.phone}</span>
                                    <DownOutlined />
                                </div>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>
            <ChangePassword isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
        </>
    );
}

export default connect(({ MASTERDATA }) => ({
    masterDataStore: MASTERDATA,
}))(memo(UserInfo));
