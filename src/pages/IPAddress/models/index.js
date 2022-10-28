import ipAdressService from '@/services/ipAddress';
import { message } from 'antd';
import { handleErrorModel } from '@/util/function';

export default {
    namespace: 'IP_ADDRESS',
    state: {
        loading: false,
        totalRow: 0,
        listIp: [],
        deleteSuccess: undefined,
        createSuccess: undefined,
    },
    reducers: {
        getListIpSuccess(state, action) {
            return {
                ...state,
                listIp: action.payload.body,
                loading: false,
                totalRow: action.payload.totalRecord,
            };
        },

        deleteIpSuccess(state, action) {
            return {
                ...state,
                deleteSuccess: action.payload,
                loading: false,
            };
        },
        createSuccess(state, action) {
            return {
                ...state,
                createSuccess: action.payload,
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
    },

    effects: {
        *getListIp(action, { call, put }) {
            yield put({ type: 'loading' });
            try {
                const res = yield call(ipAdressService.getListIp, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'getListIpSuccess', payload: res.body });
                } else {
                    message.error(res.body.message);
                    yield put({ type: 'error' });
                }
            } catch (error) {
                handleErrorModel(error);
                yield put({ type: 'error' });
            }
        },

        *deleteIp(action, { call, put }) {
            yield put({ type: 'loading' });
            try {
                const res = yield call(ipAdressService.deleteIp, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'deleteIpSuccess', payload: res.body });
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

        *addIp(action, { call, put }) {
            try {
                const res = yield call(ipAdressService.addIp, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'createSuccess', payload: res.body });
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
    },
};
