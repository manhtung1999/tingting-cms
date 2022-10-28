import React from "react";
import styles from "./styles.scss";
import { Spin } from "antd";
function ModalLoading() {
  return (
    <div className={styles.modalLoading}>
      <div className={styles.spinLoading}>
        <Spin size="large" />
      </div>
    </div>
  );
}

export default ModalLoading;
