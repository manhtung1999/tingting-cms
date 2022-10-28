import '@/base.scss';
import { connect } from 'dva';
import React from 'react';
import { withRouter } from 'umi';
import styles from './styles.scss';

function PageTemplate(props) {
    const { content } = props;

    // useEffect(() => {
    //     setLocale('en-US');
    // }, []);
    return <div className={styles.contentPage}>{content}</div>;
}

export default connect(({ MASTERDATA }) => ({
    masterDataStore: MASTERDATA,
}))(withRouter(PageTemplate));
