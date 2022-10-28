import { Input, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';
import { connect } from 'dva';

function EditInfo({
    dispatch,
    currentInfo,
    setCurrentInfo,
    deviceStore,
    currentManipulation,
    setCurrentManipulation,
    updateObjManipulation,
}) {
    const { actionObj } = deviceStore;

    const [updateObj, setUpdateObj] = useState();

    useEffect(() => {
        if (currentInfo.value) {
            setUpdateObj(currentInfo.value);
        }
    }, [currentInfo]);

    const handleClose = () => {
        setCurrentInfo({
            ...currentInfo,
            isShow: false,
        });
    };
    const handleSubmit = () => {
        let newInfos = [...currentManipulation.value.infos];
        newInfos[currentInfo.index] = { ...updateObj };
        let manipulations = JSON.parse(JSON.stringify(actionObj.manipulations));
        manipulations[currentManipulation.index] = JSON.parse(
            JSON.stringify(updateObjManipulation),
        );
        manipulations[currentManipulation.index].infos = JSON.parse(JSON.stringify(newInfos));
        setCurrentManipulation({
            ...currentManipulation,
            value: {
                ...updateObjManipulation,
                infos: JSON.parse(JSON.stringify(newInfos)),
            },
        });
        const payload = {
            ...actionObj,
            manipulations,
        };
        dispatch({ type: 'DEVICE/updateActionObj', payload });
        handleClose();
    };

    return (
        <Modal
            title={formatMessage({ id: 'EDIT_INFO' })}
            visible={currentInfo.isShow}
            wrapClassName={styles.modal}
            onOk={handleSubmit}
            okText={formatMessage({ id: 'SUBMIT' })}
            onCancel={handleClose}
            destroyOnClose
        >
            <div className={styles.form}>
                <div>
                    <span className="mb-2 d-block">{formatMessage({ id: 'text' })}:</span>
                    <Input
                        defaultValue={currentInfo.value.text}
                        onChange={e =>
                            setUpdateObj({
                                ...updateObj,
                                text: e.target.value,
                            })
                        }
                    />
                </div>

                <div>
                    <span className="mb-2 d-block">{formatMessage({ id: 'viewId' })}:</span>
                    <Input
                        defaultValue={currentInfo.value.viewId}
                        onChange={e =>
                            setUpdateObj({
                                ...updateObj,
                                viewId: e.target.value,
                            })
                        }
                    />
                </div>

                <div>
                    <span className="mb-2 d-block">{formatMessage({ id: 'hint' })}:</span>
                    <Input
                        defaultValue={currentInfo.value.hint}
                        onChange={e =>
                            setUpdateObj({
                                ...updateObj,
                                hint: e.target.value,
                            })
                        }
                    />
                </div>
                <div>
                    <span className="mb-2 d-block">{formatMessage({ id: 'bounds' })}:</span>
                    <Input
                        defaultValue={currentInfo.value.bounds}
                        onChange={e =>
                            setUpdateObj({
                                ...updateObj,
                                bounds: e.target.value,
                            })
                        }
                    />
                </div>
                <div>
                    <span className="mb-2 d-block">{formatMessage({ id: 'description' })}:</span>
                    <Input
                        defaultValue={currentInfo.value.description}
                        onChange={e =>
                            setUpdateObj({
                                ...updateObj,
                                description: e.target.value,
                            })
                        }
                    />
                </div>
                <div>
                    <span className="mb-2 d-block">{formatMessage({ id: 'pattern' })}:</span>
                    <Input
                        defaultValue={currentInfo.value.pattern}
                        onChange={e =>
                            setUpdateObj({
                                ...updateObj,
                                pattern: e.target.value,
                            })
                        }
                    />
                </div>
                <div>
                    <span className="mb-2 d-block">
                        {formatMessage({ id: 'transactionFieldIndex' })}:
                    </span>
                    <Input
                        defaultValue={currentInfo.value.transactionFieldIndex}
                        onChange={e =>
                            setUpdateObj({
                                ...updateObj,
                                transactionFieldIndex: e.target.value,
                            })
                        }
                    />
                </div>
                <div>
                    <span className="mb-2 d-block">{formatMessage({ id: 'parentCount' })}:</span>
                    <Input
                        defaultValue={currentInfo.value.parentCount}
                        onChange={e =>
                            setUpdateObj({
                                ...updateObj,
                                parentCount: e.target.value,
                            })
                        }
                    />
                </div>

                <div>
                    <span className="mb-2 d-block">{formatMessage({ id: 'childIndexes' })}:</span>
                    <Input
                        defaultValue={currentInfo.value.childIndexes}
                        onChange={e =>
                            setUpdateObj({
                                ...updateObj,
                                childIndexes: e.target.value,
                            })
                        }
                    />
                </div>
            </div>
        </Modal>
    );
}
export default connect(({ DEVICE }) => ({
    deviceStore: DEVICE,
}))(EditInfo);
