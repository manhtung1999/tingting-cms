import ModalLoading from '@/components/ModalLoading';
import PageTitle from '@/components/PageTitle';
import { Select } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'umi';
import { formatMessage } from 'umi-plugin-react/locale';
import ListManipulation from '../ListManipulation';
import { ActionType } from './enum';
import styles from './styles.scss';
import { isJsonString } from '@/util/function';
const { Option } = Select;
const UpdateDevice = props => {
    const { dispatch, deviceStore, match } = props;
    const { detailDevice, metadata, actionObj } = deviceStore;
    const [actionType, setActionType] = useState(ActionType[0]);

    const { deviceId } = match.params;

    useEffect(() => {
        if (deviceId) {
            const payload = {
                deviceId: deviceId,
            };
            dispatch({ type: 'DEVICE/getDetailDevice', payload });
        }
    }, [deviceId, dispatch]);

    useEffect(() => {
        if (actionType && metadata) {
            const payload = {
                actionType,
            };
            dispatch({ type: 'DEVICE/changeActionObj', payload });
        }
    }, [actionType, metadata, dispatch]);

    const handleSubmit = () => {
        const indexAction = metadata.findIndex(item => item.actionType === actionObj.actionType);

        let updateMetadata = JSON.parse(JSON.stringify(metadata));
        updateMetadata[indexAction] = JSON.parse(JSON.stringify(actionObj));
        updateMetadata = JSON.stringify(updateMetadata);
        const payload = {
            id: deviceId,
            metadata: updateMetadata,
            allSendMoney: -1,
            allWithdrawMoney: -1,
            dailySendMoney: -1,
            dailyWithdrawMoney: -1,
            oneTimesWithdrawMoney: -1,
            totalDailyWithdrawMoney: -1,
            withdrawMoney: -1,
        };
        dispatch({ type: 'DEVICE/updateMetadata', payload });
    };

    if (!detailDevice) {
        return <ModalLoading />;
    }

    const handleExportMetadata = () => {
        const filename = 'data.json';
        const jsonStr = JSON.stringify(metadata);

        let element = document.createElement('a');
        element.setAttribute(
            'href',
            'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr),
        );
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    };

    const handleImportMetadata = e => {
        const fileReader = new FileReader();
        fileReader.readAsText(e.target.files[0], 'UTF-8');
        fileReader.onload = e => {
            if (isJsonString(e.target.result)) {
                const payload = JSON.parse(e.target.result);
                dispatch({ type: 'DEVICE/importMedata', payload });
            }
        };
    };

    return (
        <div className={styles.content}>
            <PageTitle
                linkBack={'/home/device-management'}
                title={formatMessage({ id: 'UPDATE_DEVICE_MANIPULATION' })}
            />

            <div className="d-flex justify-content-end">
                <label htmlFor="avatar" className={styles.labelLogo}>
                    {formatMessage({ id: 'Import' })}
                </label>
                <input
                    id="avatar"
                    className={styles.textInput}
                    type="file"
                    onChange={handleImportMetadata}
                />

                <button
                    style={{ marginLeft: 20 }}
                    className={styles.primaryBtn}
                    onClick={handleExportMetadata}
                >
                    {formatMessage({ id: 'EXPORT' })}
                </button>
            </div>

            <div className="mt-4">
                <div className={`${styles.select} d-flex align-items-center mb-5`}>
                    <div className="mb-1 me-3"> {formatMessage({ id: 'ACTION_TYPE' })}:</div>
                    <Select
                        style={{ minWidth: 180 }}
                        value={actionType}
                        onChange={value => setActionType(value)}
                    >
                        {ActionType.map(action => (
                            <Option value={action}>{action}</Option>
                        ))}
                    </Select>
                </div>
                <hr />
                <h4 className="mb-4"> {formatMessage({ id: 'MANIPULATION_LIST' })} </h4>

                {actionObj && <ListManipulation />}
            </div>

            <div className="d-flex mt-5">
                <div style={{ height: 40 }}>
                    <button className={styles.primaryBtn} onClick={handleSubmit}>
                        {formatMessage({ id: 'SUBMIT' })}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default connect(({ DEVICE, MASTERDATA }) => ({
    masterdataStore: MASTERDATA,
    deviceStore: DEVICE,
}))(withRouter(UpdateDevice));
