import accountService from '@/services/account';
import depositService from '@/services/deposit';
import { message } from 'antd';
import { handleErrorModel } from '@/util/function';

export default {
    namespace: 'CARD_MANAGEMENT',
    state: {
        loading: false,
        lockSuccess: undefined,
        listPaymentType: [],
    },
    reducers: {
        lockCardSuccess(state, action) {
            return {
                ...state,
                lockSuccess: action.payload,
                loading: false,
            };
        },

        getPaymentTypeSuccess(state, action) {
            return {
                ...state,
                listPaymentType: action.payload.body,
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
    },

    effects: {
        *lockCard(action, { call, put }) {
            yield put({ type: 'loading' });
            try {
                const res = yield call(accountService.lockCard, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'lockCardSuccess', payload: res.body });
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
    },
};
