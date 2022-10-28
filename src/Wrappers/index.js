import PageHeader from '@/components/PageHeader';
import UserInfo from '@/components/UserInfo';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { withRouter } from 'umi';
import { setLocale } from 'umi-plugin-react/locale';
import styles from './styles.scss';

function AppWrappers(props) {
    useEffect(() => {
        const locale = localStorage.getItem('umi_locale');
        if (locale) {
            setLocale(locale);
        } else {
            setLocale('en-US');
        }
    }, []);

    return (
        <div style={{ display: 'contents' }}>
            <PageHeader />
            <UserInfo />
            <div className={styles.fullSpace}>{props.children}</div>
        </div>
    );
}

export default connect(({ MASTERDATA }) => ({
    masterDataStore: MASTERDATA,
}))(withRouter(AppWrappers));
