import { Modal, Select } from 'antd';
import React, { useState } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';
import { ManipulationType, ScrollDirection, FillTextType } from '../../Main/enum';
import { useEffect } from 'react';
import ModalListInfo from '../ModalListInfo';
import { connect } from 'dva';
import Cleave from 'cleave.js/react';

const { Option } = Select;
function ModalUpdateManipulation({
    deviceStore,
    dispatch,
    currentManipulation,
    setCurrentManipulation,
}) {
    const { actionObj } = deviceStore;

    const [updateObj, setUpdateObj] = useState();

    useEffect(() => {
        if (currentManipulation.value) {
            setUpdateObj(currentManipulation.value);
        }
    }, [currentManipulation]);

    const handleClose = () => {
        setCurrentManipulation({
            ...currentManipulation,
            isShow: false,
        });
    };
    const handleSubmit = () => {
        let manipulations = JSON.parse(JSON.stringify(actionObj.manipulations));

        manipulations[currentManipulation.index] = JSON.parse(JSON.stringify(updateObj));

        const payload = {
            ...actionObj,
            manipulations,
        };
        dispatch({ type: 'DEVICE/updateActionObj', payload });
        handleClose();
    };

    return (
        <Modal
            title={formatMessage({ id: 'UPDATE_MANIPULATION' })}
            visible={currentManipulation.isShow}
            wrapClassName={styles.modal}
            onOk={handleSubmit}
            okText={formatMessage({ id: 'SUBMIT' })}
            onCancel={handleClose}
            destroyOnClose
        >
            <div className={styles.form}>
                <ModalListInfo
                    infos={currentManipulation.value.infos}
                    setCurrentManipulation={setCurrentManipulation}
                    currentManipulation={currentManipulation}
                    updateObj={updateObj}
                />

                <div>
                    <span className="mb-2 d-block">
                        {formatMessage({ id: 'MANIPULATIONT_TYPE' })}:
                    </span>
                    <Select
                        style={{ minWidth: 180 }}
                        onChange={value =>
                            setUpdateObj({
                                ...updateObj,
                                manipulationType: value,
                            })
                        }
                        defaultValue={currentManipulation.value.manipulationType}
                    >
                        {ManipulationType.map(item => (
                            <Option value={item}>{item}</Option>
                        ))}
                    </Select>
                </div>

                <div>
                    <span className="mb-2 d-block">{formatMessage({ id: 'DELAY' })} (ms):</span>
                    <Cleave
                        value={currentManipulation.value.delay}
                        className={styles.textInputLight}
                        onChange={e =>
                            setUpdateObj({
                                ...updateObj,
                                delay: Number(e.currentTarget.rawValue),
                            })
                        }
                        options={{
                            numeral: true,
                            numeralThousandsGroupStyle: 'thousand',
                        }}
                    />
                </div>

                <div>
                    <span className="mb-2 d-block">
                        {formatMessage({ id: 'FILL_TEXT_TYPE' })} :
                    </span>
                    <Select
                        style={{ minWidth: 180 }}
                        onChange={value =>
                            setUpdateObj({
                                ...updateObj,
                                fillTextType: value,
                            })
                        }
                        defaultValue={currentManipulation.value.fillTextType}
                    >
                        {FillTextType.map(item => (
                            <Option value={item}>{item}</Option>
                        ))}
                    </Select>
                </div>

                <div>
                    <span className="mb-2 d-block">
                        {formatMessage({ id: 'SCROLL_DIRECTION' })}:
                    </span>
                    <Select
                        style={{ minWidth: 180 }}
                        onChange={value =>
                            setUpdateObj({
                                ...updateObj,
                                scrollDirection: value,
                            })
                        }
                        defaultValue={currentManipulation.value.scrollDirection}
                    >
                        {ScrollDirection.map(item => (
                            <Option value={item}>{item}</Option>
                        ))}
                    </Select>
                </div>
            </div>
        </Modal>
    );
}

export default connect(({ DEVICE }) => ({
    deviceStore: DEVICE,
}))(ModalUpdateManipulation);
