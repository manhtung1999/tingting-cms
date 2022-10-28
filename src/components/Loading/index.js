import React from 'react';
import { Spin } from 'antd';
import styles from './style.scss';
function Loading() {
  return (
    <div className={styles.spinLoading}>
      <Spin size="large" />
    </div>
  );
}

export default Loading;
