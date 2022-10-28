import accountService from '@/services/account';
import { message } from 'antd';
import { handleErrorModel } from '@/util/function';
import { router } from 'umi';
export default {
    namespace: 'ACCOUNT',
    state: {
        loading: false,
        accounts: [],
        agents: [],
        detailAccount: undefined,
        totalRow: 0,
        deleteResponse: {},
        updateResponse: {},
        listSecret: [],
    },
    reducers: {
        getAccountsSuccess(state, action) {
            return {
                ...state,
                accounts: action.payload.body,
                loading: false,
                totalRow: action.payload.totalRecord,
            };
        },
        getAgentsSuccess(state, action) {
            return {
                ...state,
                agents: action.payload.body,
            };
        },

        getDetailAccountSuccess(state, action) {
            return {
                ...state,
                detailAccount: action.payload.body,
            };
        },

        resetCurrentAccountSuccess(state) {
            return {
                ...state,
                detailAccount: {},
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

        deleteAccountSuccess(state, action) {
            return {
                ...state,
                loading: false,
                deleteResponse: action.payload,
            };
        },

        updateSuccess(state, action) {
            return {
                ...state,
                loading: false,
                updateResponse: action.payload,
            };
        },

        getSercretSuccess(state, action) {
            return {
                ...state,
                listSecret: action.payload,
            };
        },
    },

    effects: {
        *getAccounts(action, { call, put }) {
            yield put({ type: 'loading' });
            try {
                const res = yield call(accountService.getAccounts, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'getAccountsSuccess', payload: res.body });
                } else {
                    message.error(res.body.message);
                    yield put({ type: 'error' });
                }
            } catch (error) {
                handleErrorModel(error);
                yield put({ type: 'error' });
            }
        },

        *getAgents(action, { call, put }) {
            try {
                const res = yield call(accountService.getAccounts, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'getAgentsSuccess', payload: res.body });
                } else {
                    message.error(res.body.message);
                    yield put({ type: 'error' });
                }
            } catch (error) {
                handleErrorModel(error);
                yield put({ type: 'error' });
            }
        },

        *getSercret(action, { call, put }) {
            try {
                const res = yield call(accountService.getSercret, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'getSercretSuccess', payload: res.body.body });
                } else {
                    message.error(res.body.message);
                    yield put({ type: 'error' });
                }
            } catch (error) {
                handleErrorModel(error);
                yield put({ type: 'error' });
            }
        },

        *createSecret(action, { call, put }) {
            try {
                const res = yield call(accountService.createSecret, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'success', payload: res.body });
                } else {
                    message.error(res.body.message);
                    yield put({ type: 'error' });
                }
            } catch (error) {
                handleErrorModel(error);
                yield put({ type: 'error' });
            }
        },

        *getDetailAccount(action, { call, put }) {
            try {
                const res = yield call(accountService.getDetailAccount, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'getDetailAccountSuccess', payload: res.body });
                } else {
                    message.error(res.body.message);
                    yield put({ type: 'error' });
                }
            } catch (error) {
                handleErrorModel(error);
                yield put({ type: 'error' });
            }
        },
        *resetCurrentAccount(action, { call, put }) {
            yield put({ type: 'resetCurrentAccountSuccess' });
        },

        *deleteAccount(action, { call, put }) {
            yield put({ type: 'loading' });
            try {
                const res = yield call(accountService.deleteAccount, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'deleteAccountSuccess', payload: res.body });
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

        *createAccount(action, { call, put }) {
            try {
                const res = yield call(accountService.createAccount, action.payload);
                if (res.status === 200) {
                    const payload = {
                        ownerId: res.body.body.id,
                    };
                    const resSecret = yield call(accountService.createSecret, payload);
                    if (resSecret.status === 200) {
                        yield put({ type: 'success', payload: res.body });
                        message.success(res.body.message);
                        router.push('/home/account-manage');
                    } else {
                        message.error(res.body.message);
                        yield put({ type: 'error' });
                    }
                } else {
                    message.error(res.body.message);
                    yield put({ type: 'error' });
                }
            } catch (error) {
                handleErrorModel(error);
                yield put({ type: 'error' });
            }
        },

        *updateAccount(action, { call, put }) {
            yield put({ type: 'loading' });
            try {
                const res = yield call(accountService.updateAccount, action.payload.data);
                if (res.status === 200) {
                    yield put({ type: 'success', payload: res.body });
                    message.success(res.body.message);
                    router.push('/home/account-manage');
                } else {
                    message.error(res.body.message);
                    yield put({ type: 'error' });
                }
            } catch (error) {
                handleErrorModel(error);
                yield put({ type: 'error' });
            }
        },
        *configMoney(action, { call, put }) {
            yield put({ type: 'loading' });
            try {
                const res = yield call(accountService.configMoney, action.payload);
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

        *resetCurrentEdit(action, { call, put }) {
            yield put({ type: 'resetCurrentEdit' });
        },

        *updateUser(action, { call, put }) {
            yield put({ type: 'loading' });
            try {
                const res = yield call(accountService.updateUser, action.payload);
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
