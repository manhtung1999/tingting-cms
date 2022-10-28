import img_cn from '@/assets/image/img_cn.png';
import img_en from '@/assets/image/img_en.png';
import img_vn from '@/assets/image/img_vn.png';
import { Select } from 'antd';
import { connect } from 'dva';
import { memo } from 'react';
import { getLocale, setLocale } from 'umi-plugin-react/locale';
import styles from './style.scss';

const { Option } = Select;

function Language({ dispatch, masterDataStore }) {
    return (
        <>
            <div className={styles.login}>
                <div className={styles.select}>
                    <Select value={getLocale()} onChange={value => setLocale(value)}>
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
            </div>
        </>
    );
}

export default connect(({ MASTERDATA }) => ({
    masterDataStore: MASTERDATA,
}))(memo(Language));
