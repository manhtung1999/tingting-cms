import deviceService from '@/services/device';
import { message } from 'antd';
import { handleErrorModel, isJsonString } from '@/util/function';
import { router } from 'umi';
import depositService from '@/services/deposit';

export default {
    namespace: 'DEVICE',
    state: {
        loading: false,
        devices: [],
        totalRow: 0,
        paymentTypes: [],
        updateSuccess: undefined,
        deleteSuccess: undefined,
        listPaymentType: [],
        detailDevice: {},
        actionObj: undefined,
        metadata: undefined,
        actionType: 'LOGIN',
    },
    reducers: {
        getDevicesSuccess(state, action) {
            return {
                ...state,
                devices: action.payload.body,
                loading: false,
                totalRow: action.payload.totalRecord,
            };
        },

        getPaymentTypeSuccess(state, action) {
            return {
                ...state,
                listPaymentType: action.payload.body,
            };
        },

        updateStatusSuccess(state, action) {
            return {
                ...state,
                updateSuccess: action.payload.body,
            };
        },

        deleteDeviceSuccess(state, action) {
            return {
                ...state,
                deleteSuccess: action.payload,
                loading: false,
            };
        },

        loading(state) {
            return {
                ...state,
                loading: true,
            };
        },

        success(state) {
            return {
                ...state,
                loading: false,
            };
        },

        error(state) {
            return {
                ...state,
                loading: false,
            };
        },

        getDetailDeviceSuccess(state, action) {
            let metadata = undefined;
            if (action.payload.body.metadata && isJsonString(action.payload.body.metadata)) {
                metadata = JSON.parse(action.payload.body.metadata);
            }
            return {
                ...state,
                detailDevice: action.payload.body,
                metadata,
            };
        },

        changeActionObjSuccess(state, action) {
            let actionObj = state.metadata.find(
                item => item.actionType === action.payload.actionType,
            );
            if (!actionObj) {
                actionObj = {
                    actionType: action.payload.actionType,
                    manipulations: [],
                };
            }
            return {
                ...state,
                actionObj,
                actionType: action.payload.actionType,
            };
        },

        updateActionObjSuccess(state, action) {
            return {
                ...state,
                actionObj: action.payload,
            };
        },

        importMedataSuccess(state, action) {
            let actionObj = state.metadata.find(
                item => item.actionType === action.payload.actionType,
            );
            if (!actionObj) {
                actionObj = {
                    actionType: action.payload.actionType,
                    manipulations: [],
                };
            }
            return {
                ...state,
                metadata: action.payload,
                actionObj,
            };
        },
    },

    effects: {
        *getPaymentType(action, { call, put }) {
            try {
                const res = yield call(depositService.getPaymentType, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'getPaymentTypeSuccess', payload: res.body });
                } else {
                    message.error(res.body.message);
                    yield put({ type: 'error' });
                }
            } catch (error) {
                handleErrorModel(error);
                yield put({ type: 'error' });
            }
        },
        *getDevices(action, { call, put }) {
            yield put({ type: 'loading' });
            try {
                const res = yield call(deviceService.getDevices, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'getDevicesSuccess', payload: res.body });
                } else {
                    message.error(res.body.message);
                    yield put({ type: 'error' });
                }
            } catch (error) {
                handleErrorModel(error);
                yield put({ type: 'error' });
            }
        },

        *deleteDevice(action, { call, put }) {
            yield put({ type: 'loading' });
            try {
                const res = yield call(deviceService.deleteDevice, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'deleteDeviceSuccess', payload: res.body });
                    message.success(res.body.message);
                } else {
                    message.error(res.body.message);
                    yield put({ type: 'error' });
                }
            } catch (error) {
                handleErrorModel(error);
                yield put({ type: 'error' });
            }
        },

        *updateStatus(action, { call, put }) {
            yield put({ type: 'loading' });
            try {
                const res = yield call(deviceService.updateStatus, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'updateStatusSuccess', payload: res.body });
                    message.success(res.body.message);
                } else {
                    message.error(res.body.message);
                    yield put({ type: 'error' });
                }
            } catch (error) {
                handleErrorModel(error);
                yield put({ type: 'error' });
            }
        },

        *getDetailDevice(action, { call, put }) {
            try {
                const res = yield call(deviceService.getDetailDevice, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'getDetailDeviceSuccess', payload: res.body });
                } else {
                    message.error(res.body.message);
                    yield put({ type: 'error' });
                }
            } catch (error) {
                handleErrorModel(error);
                yield put({ type: 'error' });
            }
        },

        *createCard(action, { call, put }) {
            try {
                const res = yield call(deviceService.createCard, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'success', payload: res.body });
                    message.success(res.body.message);
                    router.push('/home/device-management');
                } else {
                    message.error(res.body.message);
                    yield put({ type: 'error' });
                }
            } catch (error) {
                handleErrorModel(error);
                yield put({ type: 'error' });
            }
        },

        *updateMetadata(action, { call, put }) {
            yield put({ type: 'loading' });

            try {
                const res = yield call(deviceService.updateMetadata, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'success' });
                    message.success(res.body.message);
                    // router.push('/home/device-management');
                } else {
                    message.error(res.body.message);
                    yield put({ type: 'error' });
                }
            } catch (error) {
                handleErrorModel(error);
                yield put({ type: 'error' });
            }
        },

        *refreshDevice(action, { call, put }) {
            try {
                const res = yield call(deviceService.refreshDevice, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'success' });
                    message.success(res.body.message);
                } else {
                    message.error(res.body.message);
                    yield put({ type: 'error' });
                }
            } catch (error) {
                handleErrorModel(error);
                yield put({ type: 'error' });
            }
        },

        *refreshAll(action, { call, put }) {
            try {
                const res = yield call(deviceService.refreshAll, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'success' });
                    message.success(res.body.message);
                } else {
                    message.error(res.body.message);
                    yield put({ type: 'error' });
                }
            } catch (error) {
                handleErrorModel(error);
                yield put({ type: 'error' });
            }
        },

        // manipulation
        *changeActionObj(action, { call, put }) {
            try {
                yield put({ type: 'changeActionObjSuccess', payload: action.payload });
            } catch (error) {
                yield put({ type: 'error' });
            }
        },

        *updateActionObj(action, { call, put }) {
            try {
                yield put({ type: 'updateActionObjSuccess', payload: action.payload });
            } catch (error) {
                yield put({ type: 'error' });
            }
        },

        *importMedata(action, { call, put }) {
            try {
                yield put({ type: 'importMedataSuccess', payload: action.payload });
            } catch (error) {
                yield put({ type: 'error' });
            }
        },
    },
};
