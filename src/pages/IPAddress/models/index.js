import ipAdressService from '@/services/ipAddress';
import accountService from '@/services/account';
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
        updateSuccess: undefined,
        listMerchant: [],
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

        updateSuccess(state, action) {
            return {
                ...state,
                updateSuccess: action.payload,
            };
        },

        getMerchantSuccess(state, action) {
            return {
                ...state,
                listMerchant: action.payload.body,
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

        *getMerchants(action, { call, put }) {
            try {
                const res = yield call(accountService.getAccounts, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'getMerchantSuccess', payload: res.body });
                } else {
                    message.error(res.body.message);
                    yield put({ type: 'error' });
                }
            } catch (error) {
                handleErrorModel(error);
                yield put({ type: 'error' });
            }
        },

        *updateIp(action, { call, put }) {
            try {
                const res = yield call(ipAdressService.updateIp, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'updateSuccess', payload: res.body });
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
