import React from 'react';
import styles from './styles.scss';
import ic_back from '@/assets/image/ic_back.png';
import { router } from 'umi';

const PageTitle = ({ linkBack, title }) => {
    return (
        <div className={styles.title}>
            <div className={styles.titleText}>
                <img
                    className={styles.sizeIcon}
                    onClick={() => {
                        router.push({ pathname: linkBack });
                    }}
                    src={ic_back}
                />
                <span>{title}</span>
            </div>
        </div>
    );
};

export default PageTitle;
