import request from './request';

export default {
    getAccounts: payload => {
        return request.get('api/v1/user/get-user', payload);
    },
    getDetailAccount: payload => {
        return request.get('api/admin/v1/user/get-detail', payload);
    },

    deleteAccount: payload => {
        return request.post('api/admin/v1/user/delete-user', payload);
    },
    createAccount: payload => {
        return request.post('api/admin/v1/user/add-user', payload);
    },
    restoreAccount: payload => {
        return request.post('api/admin/v1/user/restore-user', payload);
    },
    updateAccount: payload => {
        return request.post('api/admin/v1/user/edit-user', payload);
    },

    configMoney: payload => {
        return request.post('api/v1/money-config/update', payload);
    },

    getPaymentType: payload => {
        return request.get('api/v1/payment-type/get', payload);
    },

    getDeposits: payload => {
        return request.get('api/v1/transaction/get', payload);
    },

    createDeposit: payload => {
        return request.post('api/v1/user/send-money', payload);
    },

    createWithdraw: payload => {
        return request.post('api/v1/user/withdraw-money', payload);
    },

    deleteTransaction: payload => {
        return request.post('api/v1/user/withdraw-money', payload);
    },

    getCardBank: payload => {
        return request.post('api/v1/card-bank/get', payload);
    },

    createCardBank: payload => {
        return request.post('api/v1/card-bank/create', payload);
    },

    denyTransaction: payload => {
        return request.post('api/v1/transaction/staff-delete-money', payload);
    },
    approveTransaction: payload => {
        return request.post('api/v1/transaction/staff-confirm-money', payload);
    },

    confirmDeposit: payload => {
        return request.post('api/v1/transaction/staff-confirm-money-success', payload);
    },

    adminCreateDeposit: payload => {
        return request.post('api/v1/user/admin-send-money-user', payload);
    },

    adminCreateWithdraw: payload => {
        return request.post('api/v1/user/admin-withdraw-money-for-user', payload);
    },

    getUserCard: payload => {
        return request.get('api/v1/card-bank/user-get', payload);
    },

    appConfirmMoney: payload => {
        return request.post('api/v1/public/confirm-money', payload);
    },

    addNoteTransaction: payload => {
        return request.post('api/v1/user/update-note', payload);
    },

    deleteCardBank: payload => {
        return request.post('api/v1/card-bank/delete', payload);
    },

    refreshCard: payload => {
        return request.post('api/v1/public/refresh', payload);
    },

    getDetailCardTransaction: payload => {
        return request.get('api/v1/user/get-detail-tran', payload);
    },
};
