import request from './request';

export default {
    getDevices: payload => {
        return request.get('api/v1/mobile-device/get', payload);
    },

    getPaymentType: payload => {
        return request.get('api/v1/payment-type/get', payload);
    },

    updateStatus: payload => {
        return request.post('api/v1/mobile-device/update', payload);
    },

    createCard: payload => {
        return request.post('api/v1/mobile-device/create', payload);
    },

    deleteDevice: payload => {
        return request.post('api/v1/mobile-device/delete', payload);
    },

    getDetailDevice: payload => {
        return request.get('api/v1/mobile-device/get-detail', payload);
    },

    updateMetadata: payload => {
        return request.post('api/v1/mobile-device/update', payload);
    },

    refreshDevice: payload => {
        return request.post('api/v1/mobile-device/refresh', payload);
    },

    transferBalance: payload => {
        return request.post('api/v1/user/send-money-internal', payload);
    },

    transferBalanceOutside: payload => {
        return request.post('api/v1/user/withdraw-money-internal', payload);
    },

    refreshAll: payload => {
        return request.post('api/v1/mobile-device/refresh-all', payload);
    },
};
