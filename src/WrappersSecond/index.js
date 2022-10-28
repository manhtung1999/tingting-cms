import { connect } from 'dva';
import React, { useEffect } from 'react';
import { withRouter } from 'umi';
import { setLocale } from 'umi-plugin-react/locale';
import Language from '../components/Language';
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
        <div
            style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Language />
            {props.children}
        </div>
    );
}

export default connect(({ MASTERDATA }) => ({
    masterDataStore: MASTERDATA,
}))(withRouter(AppWrappers));
